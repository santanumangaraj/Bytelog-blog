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
    }
  }
  blog.init({
    title: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:{msg:"title must be unique"},
      validate:{
        notNull:{msg:"title is required"},
        notEmpty:{msg:"title can't be empty"}
      }
    },
    content:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:"content is required"},
        notEmpty:{msg:"content can't be empty"}
      }
    },
    image: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:"image is required"},
        notEmpty:{msg:"image can't be empty"}
      }
    },
    status: {
      type:DataTypes.JSON,
      allowNull:false,
      defaultValue:[],
      validate:{
        notNull:{msg:"status is required"},
        notEmpty:{msg:"status can't be empty"}
      }
    },
    isPublished:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false,
      validate:{
        notNull:{msg:"isPublished is required"},
        notEmpty:{msg:"isPublished can't be empty"}
      }
    },
    author:{
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:"author is required"},
        notEmpty:{msg:"author can't be empty"}
      }
    }
  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};