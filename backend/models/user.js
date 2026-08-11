"use strict";

export default (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "username must be unique" },
        validate: {
          notNull: { msg: "username is required" },
          notEmpty: { msg: "username can't be empty" },
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "fullName is required" },
          notEmpty: { msg: "fullName can't be empty" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "email must be unique" },
        validate: {
          notNull: { msg: "email is required" },
          notEmpty: { msg: "email can't be empty" },
        },
      },
      avatarImageKey: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "avatarImageKey is required" },
          notEmpty: { msg: "avatarImageKey can't be empty" },
        },
      },
      avatarImageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "avatarImageUrl is required" },
          notEmpty: { msg: "avatarImageUrl can't be empty" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password is required" },
          notEmpty: { msg: "password can't be empty" },
        },
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "READER",
      },
      failedLoginAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lockUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      modelName: "user",
    }
  );

  user.associate = (models) => {
    user.belongsToMany(models.blog, {
      through: models.like,
      as: "likedBlogs",
      foreignKey: "likedBy",
      otherKey: "blogId",
    });

    user.hasMany(models.blog, {
      foreignKey: "author",
      as: "userBlogs",
    });
  };

  return user;
};
