require("dotenv").config();

module.exports = {
    dialect: "postgres",
    type: "postgres",
    //  url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    dialectOptions: {
        ssl: process.env.DATABASE_SSL
    },

    define: {
        timestamp: true,
        underscored: true
    }
};