import { Sequelize } from "sequelize";
const sequelize = new Sequelize({ dialect: 'sqlite',
// logging: console.log, // 启用 Debug 功能
storage: 'app.db'});

export default sequelize
