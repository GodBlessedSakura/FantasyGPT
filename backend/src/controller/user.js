import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, TopicModel, ConversationModel } from "@/models";
import response from "@/utils/response";
import logger from "@/utils/logger";

export default class User {
  /* ---------  Non-admin functions --------- */
  /* ------ Create new user ------ */

  static async create(ctx) {
    try {
      // validation
      const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
      });

      const { error, value } = schema.validate(ctx.request.body);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      // create new user
      const { username, email, password } = value;
      const hashPassword = await bcrypt.hash(password, 10); // saltRounds = 10

      let newUser;
      try {
        newUser = await UserModel.create({
          username,
          email,
          password: hashPassword,
        });
      } catch (e) {
        return response.error(ctx, e.message);
      }

      return response.ok(ctx, {
        id: newUser.id,
        msg: "User created successfully!",
      });
    } catch (err) {
      // 记录错误日志
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }
  /* ------ User Login ------ */

  static async login(ctx) {
    try {
      // validation
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
      });

      const { error, value } = schema.validate(ctx.request.body);
      if (error) {
        return response.error(ctx, error.details[0].message);
      }
      const { email, password } = value;

      // validate password
      const user = await UserModel.findOne({
        where: {
          email,
          enabled: true,
        },
      });
      if (!user) {
        return response.error(ctx, "Incorrect email or password", 401);
      }
      const hashPassword = user.password;
      const isTrue = bcrypt.compareSync(password, hashPassword);
      if (!isTrue) {
        return response.error(ctx, "Incorrect email or password", 401);
      }
      // 生成 JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return response.ok(ctx, {
        jwt: token,
        msg: `User ${user.username} log in successfully!`,
      });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }

  /* ------ Update on user ------ */

  static async update(ctx) {
    try {
      // validation
      const schema = Joi.object({
        password: Joi.string().min(6).max(20),
        newPassword: Joi.string().min(6).max(20),
        newUsername: Joi.string().min(3).max(20),
      });

      const { error, value } = schema.validate(ctx.request.body);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      // update user infomation
      const authorization = ctx.headers.authorization;
      const token = authorization.split(" ")[1];

      // 验证 JWT 并获取 payload
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { newUsername, password, newPassword } = value;
      // --- check user exists ---
      const user = await UserModel.findOne({
        where: {
          id: payload.id,
          enabled: true,
        },
      });
      if (!user) {
        return response.error(
          ctx,
          `User with id ${payload.id} does not exist or is banned`
        );
      }
      try {
        if (newUsername) {
          // --- update on username ---
          user.username = newUsername;
          user.save();
          return response.ok(ctx, {
            id: payload.id,
            username: newUsername,
            msg: "Username updated successfully!",
          });
        } else if (password && newPassword) {
          // --- update on password ---
          // 1. validate on old password
          const hashPassword = user.password;
          const isTrue = bcrypt.compareSync(password, hashPassword);
          if (!isTrue) {
            return response.error(ctx, "Incorrect old password");
          }
          // 2. update on password
          const newHashPassword = await bcrypt.hash(newPassword, 10);
          user.password = newHashPassword;
          user.save();
          response.ok(ctx, {
            id: payload.id,
            msg: "Password updated successfully",
          });
        }
      } catch (e) {
        response.error(ctx, e.message);
      }
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }

  /* ------ Query user information ------ */

  static async get(ctx) {
    try {
      const authorization = ctx.headers.authorization;
      const token = authorization.split(" ")[1];

      // 验证 JWT 并获取 payload
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // --- check user exists ---
      const user = await UserModel.findOne({
        where: {
          id: payload.id,
          enabled: true,
        },
        include: {
          model: TopicModel,
          as: "topics",
          where: { enabled: true },
          required: false,
        },
      });
      if (!user) {
        return response.error(
          ctx,
          `User with id ${payload.id} does not exist or is banned`
        );
      }
      const res = user.toJSON(); // 隐藏密码信息
      return response.ok(ctx, { user: res, msg: "Query user successfully!" });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }

  /* --------- Admin functions --------- */
  /* ------ Query all users information ------ */
  static async get_all(ctx) {
    try {
      const authorization = ctx.headers.authorization;
      const token = authorization.split(" ")[1];

      // 验证 JWT 并获取 payload
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload.isAdmin)
        return response.error(ctx, "You are not admin user", 403);
      try {
        const users = await UserModel.findAll({
          include: {
            model: TopicModel,
            as: "topics",
            include: {
              model: ConversationModel,
              as: "conversations",
            },
          },
        });
        const res = users.map((user) => user.toJSON());
        return response.ok(ctx, {
          users: res,
          msg: "Query all users successfully!",
        });
      } catch (e) {
        console.log("error", e.message);
      }
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }

  /* ------ Ban an account ------ */
  static async ban(ctx) {
    try {
      const authorization = ctx.headers.authorization;
      const token = authorization.split(" ")[1];

      // 验证 JWT 并获取 payload
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload.isAdmin)
        return response.error(ctx, "You are not admin user", 403);
      // validation
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error, value } = schema.validate(ctx.request.body);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      // ban user
      const { id } = value;
      // --- check user exists ---
      const user = await UserModel.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return response.error(ctx, `User with id ${id} does not exist.`);
      }
      if (!user.enabled) {
        return response.error(ctx, `User with id ${id} already banned.`);
      }
      user.enabled = false;
      user.save();
      return response.ok(ctx, {
        id,
        msg: `User with id ${id} banned successfully.`,
      });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }

  /* ------ Enable an account ------ */
  static async enable(ctx) {
    try {
      const authorization = ctx.headers.authorization;
      const token = authorization.split(" ")[1];

      // 验证 JWT 并获取 payload
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload.isAdmin)
        return response.error(ctx, "You are not admin user", 403);
      // validation
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error, value } = schema.validate(ctx.request.body);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      // enable user
      const { id } = value;
      // --- check user exists ---
      const user = await UserModel.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return response.error(ctx, `User with id ${id} does not exist.`);
      }
      if (user.enabled) {
        return response.error(ctx, `User with id ${id} already enabled.`);
      }
      user.enabled = true;
      user.save();
      return response.ok(ctx, {
        id,
        msg: `User with id ${id} enabled successfully.`,
      });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }
}
