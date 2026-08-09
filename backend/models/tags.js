"use strict";

export default (sequelize, DataTypes) => {
  const tags = sequelize.define(
    "tags",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "name must be unique" },
        validate: {
          notNull: { msg: "name is required" },
          notEmpty: { msg: "name can't be empty" },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "slug must be unique" },
        validate: {
          notNull: { msg: "slug is required" },
          notEmpty: { msg: "slug can't be empty" },
        },
      },
    },
    {
      modelName: "tags",
    }
  );

  tags.associate = (models) => {
    // define association here
  };

  return tags;
};
