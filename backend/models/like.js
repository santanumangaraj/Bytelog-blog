"use strict";

export default (sequelize, DataTypes) => {
  const like = sequelize.define(
    "like",
    {
      blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "blogId is required" },
          notEmpty: { msg: "blogId can't be empty" },
        },
      },
      likedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "likedBy is required" },
          notEmpty: { msg: "likedBy can't be empty" },
        },
      },
    },
    {
      modelName: "like",
      indexes: [
        {
          unique: true,
          fields: ["blogId", "likedBy"],
        },
      ],
    }
  );

  like.associate = (models) => {
    like.belongsTo(models.blog, {
      foreignKey: "blogId",
      as: "blog",
    });

    like.belongsTo(models.user, {
      foreignKey: "likedBy",
      as: "user",
    });
  };

  return like;
};
