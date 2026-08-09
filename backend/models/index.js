"use strict";

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize } from "sequelize";

import config from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

const db = {};

const dbConfig = config[env];

if (!dbConfig) {
    throw new Error(
        `❌ Sequelize configuration not found for NODE_ENV="${env}"`
    );
}

let sequelize;

if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(
        process.env[dbConfig.use_env_variable],
        dbConfig
    );
} else {
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig
    );
}

// Find all model files
const modelFiles = fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.endsWith(".js") &&
            !file.endsWith(".test.js")
        );
    });

// Load ESM models
for (const file of modelFiles) {
    const filePath = path.join(__dirname, file);

    const module = await import(pathToFileURL(filePath).href);

    const model = module.default(sequelize, Sequelize.DataTypes);

    db[model.name] = model;
}

// Initialize associations
Object.keys(db).forEach((modelName) => {
    if (typeof db[modelName].associate === "function") {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
