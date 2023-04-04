import Joi from "joi";
import jwt from "jsonwebtoken";
import { UserModel, TopicModel, ConversationModel } from "@/models";
import response from "@/utils/response";
import logger from "@/utils/logger";
import { getRelatedConversations } from "@/utils/tenserflow";
import { generateResponse } from "@/service/gpt";

export default class Conversation {
  static async generate(ctx) {
    try {
      const schema = Joi.object({
        topicId: Joi.string().required(),
        role: Joi.string().required(),
        text: Joi.string().required().min(1),
        mode: Joi.string().required().min(1),
      });

      const { error, value } = schema.validate(ctx.request.body);

      if (error) {
        return response.error(ctx, error.details[0].message);
      }

      const authorization = ctx.headers.authorization;
      const token = authorization.split(" ")[1];

      // 验证 JWT 并获取 payload
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const isAdmin = { payload };

      const { topicId, role, text, mode } = value;
      const userConversation = await ConversationModel.create({
        topicId,
        role: "user",
        text,
      });
      if (role !== "user") return response.error(ctx, "Invalid role!");
      const topic = await TopicModel.findOne({
        where: {
          id: topicId,
          enabled: true,
        },
        include: {
          model: ConversationModel,
          as: "conversations",
          where: { enabled: true },
          required: false,
        },
      });

      if (!topic)
        return response.error(
          ctx,
          `Topic with id ${topicId}  not existed or banned!`
        );

      const contextFrom = isAdmin === true ? -40 : -10;
      let conversations;
      if (mode === "Classic") {
        conversations = topic.conversations
          .slice(contextFrom)
          .map(({ role, text }) => {
            return {
              role,
              content: text,
            };
          });
      } else if (mode === "Smart") {
        conversations = await getRelatedConversations(
          topic.conversations,
          0.45
        );
        conversations = conversations.map(({ role, text }) => {
          return {
            role,
            content: text,
          };
        });
      } else if (mode === "Customize") {
      } else {
        return response.error(ctx, "Invalid Mode.");
      }

      // Todo:Context, token-limit
      const maxTokens = isAdmin === true ? 5000 : 1000;
      const { responseText, consumedTokens } = await generateResponse(
        conversations,
        maxTokens
      );
      const gptConversation = await ConversationModel.create({
        topicId,
        role: "assistant",
        text: responseText,
      });

      response.ok(ctx, {
        id: gptConversation.id,
        text: responseText,
        msg: "Receive message from gpt",
      });
      // tokens limit
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
      const conversation = await ConversationModel.findOne({
        where: {
          id,
        },
      });
      conversation.enabled = false;
      conversation.save();
    } catch (err) {
      logger.error(`Error: ${err.message}`, { stack: err.stack });
      return response.error(ctx, "Internal server error.", 500);
    }
  }
}
