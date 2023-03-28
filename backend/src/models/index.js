import bcrypt from "bcrypt";
import sequelize from "./sequelize";
import User from "./user";
import Topic from "./topic";
import Conversation from "./conversation";

// 定义表格之间的关联关系
User.hasMany(Topic, { as: "topics", foreignKey: "userId" });
Topic.belongsTo(User, { as: "user" });

Topic.hasMany(Conversation, { as: "conversations", foreignKey: "topicId" });
Conversation.belongsTo(Topic, { as: "topic" });

// sequelize.queryInterface.dropAllTables(); // 删除所有表
// 同步数据库模型和表格;
sequelize.sync().then(async () => {
  const adminUser = await User.findOne({
    where: { email: process.env.ADMIN_EMAIL },
  });

  if (!adminUser) {
    // 如果不存在超级管理员账户，则创建一个账户并添加到数据库中
    const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      email: process.env.ADMIN_EMAIL,
      username: process.env.ADMIN_USERNAME,
      password: hashPassword,
      isAdmin: true,
    });
  }

  const vipUser = await User.findOne({
    where: { email: process.env.VIP_EMAIL },
  });

  if (!vipUser) {
    // 如果不存在VIP账户，则创建一个账户并添加到数据库中
    const hashPassword = await bcrypt.hash(process.env.VIP_PASSWORD, 10);
    await User.create({
      email: process.env.VIP_EMAIL,
      username: process.env.VIP_USERNAME,
      password: hashPassword,
      isAdmin: false,
    });
  }
});

export {
  User as UserModel,
  Topic as TopicModel,
  Conversation as ConversationModel,
  sequelize,
};
