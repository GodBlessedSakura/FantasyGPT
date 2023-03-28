import Joi from "joi";
import jwt from "jsonwebtoken";
import { UserModel, TopicModel, ConversationModel } from "@/models";
import response from "@/utils/response";
import logger from "@/utils/logger";

export default class Topic {
  static async create(ctx) {
    try {
      const authorization = ctx.headers.authorization;
      const token = authorization.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { id: userId } = payload;

      const newTopic = await TopicModel.create({
        userId,
      });
      return response.ok(ctx, {
        id: newTopic.id,
        topic: newTopic,
        msg: "New topic created! ",
      });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }
  static async get(ctx) {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });
      const { error, value } = schema.validate(ctx.params);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      const { id } = value;
      const topic = await TopicModel.findOne({
        where: {
          id,
          enabled: true,
        },
        include: {
          model: ConversationModel,
          as: "conversations",
          where: { enabled: true },
          required: false,
        },
      });
      return response.ok(ctx, { topic, msg: "Query topic successfully!" });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }
  static async edit(ctx) {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
        newName: Joi.string().required().min(1),
      });

      const { error, value } = schema.validate(ctx.request.body);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      const { id, newName } = value;
      const topic = await TopicModel.findOne({
        where: {
          id,
          enabled: true,
        },
      });

      if (!topic)
        return response.error(
          ctx,
          `Topic with id ${id}  not existed or banned!`
        );

      topic.name = newName;
      topic.save();
      response.ok(ctx, { id, newName, msg: "Topic name updated!" });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }
  static async delete(ctx) {
    try {
      const schema = Joi.object({
        id: Joi.string().required(),
      });

      const { error, value } = schema.validate(ctx.request.body);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      const { id } = value;
      const topic = await TopicModel.findOne({
        where: {
          id,
        },
      });
      topic.enabled = false;
      topic.save();
      response.ok(ctx, { id, msg: "Topic deleted!" });
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }
}
