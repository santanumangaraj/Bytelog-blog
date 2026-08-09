import dotenv from "dotenv";
dotenv.config();

export default {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",

        logging: false,
        timezone: "+00:00",

        pool: {
            max: 15,
            min: 1,
            acquire: 30000,
            idle: 10000,
        },

        retry: {
            max: 3,
        },

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },

        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        pool: {
            max: 15,
            min: 1,
            acquire: 30000,
            idle: 10000,
        },
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false,
        timezone: "+00:00",
        pool: {
            max: 15,
            min: 1,
            acquire: 30000,
            idle: 10000,
        },
        retry: {
            max: 3,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
        },
    }
};
