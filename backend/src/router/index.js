import Router from "koa-router";
import User from "@/controller/user";
import Topic from "@/controller/topic";
import Conversation from "@/controller/conversation";

const router = new Router();

router.prefix("/api");
const USER_BASE_URL = "/user";
const TOPIC_BASE_URL = "/topic";
const CONVERSATION_BASE_URL = "/conversation";

// User
router
  .post(USER_BASE_URL + "/create", User.create)
  .post(USER_BASE_URL + "/login", User.login)
  .post(USER_BASE_URL + "/update", User.update)
  .get(USER_BASE_URL + "/get", User.get)
  .get(USER_BASE_URL + "/get_all", User.get_all)
  .post(USER_BASE_URL + "/ban", User.ban)
  .post(USER_BASE_URL + "/enable", User.enable)

  // Topic
  // router
  .post(TOPIC_BASE_URL + "/create", Topic.create)
  .get(TOPIC_BASE_URL + "/get/:id", Topic.get)
  .post(TOPIC_BASE_URL + "/edit", Topic.edit)
  .post(TOPIC_BASE_URL + "/delete", Topic.delete)

  // Conversation
  // router
  .post(CONVERSATION_BASE_URL + "/generate", Conversation.generate)
  .post(CONVERSATION_BASE_URL + "/delete", Conversation.delete);

export default router;
