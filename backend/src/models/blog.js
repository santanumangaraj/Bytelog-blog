'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      blog.belongsToMany(models.user,{
        through: models.like,
        as:"likedByUsers",
        foreignKey:"blogId",
        otherKey:"likedBy"
      })
    }
  }
  blog.init({
    title: {
      type:DataTypes.STRING(200),
      allowNull:false,
      unique:{msg:"title must be unique"},
      validate:{
        notNull:{msg:"title is required"},
        notEmpty:{msg:"title can't be empty"}
      }
    },
    slug:{
      type:DataTypes.STRING(220),
      allowNull:false,
      unique:{msg:"slug must be unique"},
      validate:{
        notNull:{msg:"slug is required"},
        notEmpty:{msg:"slug can't be empty"}
      }
    },
    excerpt:{
      type:DataTypes.STRING(300),
      allowNull:false,
      validate:{
        notNull:{msg:"excerpt is required"},
        notEmpty:{msg:"excerpt can't be empty"}
      }
    },
    content:{
      type:DataTypes.TEXT('long'),
      allowNull:false,
      validate:{
        notNull:{msg:"content is required"},
        notEmpty:{msg:"content can't be empty"}
      }
    },
    coverImageUrl: {
      type:DataTypes.STRING(500),
    },
    coverImageKey: {
      type:DataTypes.STRING(500),
    },
    status: {
      type:DataTypes.ENUM("draft", "published", "archived"),
      defaultValue:"draft",
    },
    views: {
      type:DataTypes.INTEGER.UNSIGNED,
      defaultValue:0,
    },
    publishedAt:{
      type:DataTypes.DATE,
    },
    author:{
      type:DataTypes.INTEGER,
      allowNull:false,
    }
  }, {
    sequelize,
    modelName: 'blog',
    paranoid: true
  });
  return blog;
};