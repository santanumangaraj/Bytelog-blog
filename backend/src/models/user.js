'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsToMany(models.blog,{
        through: models.like,
        as: "likedBlogs",
        foreignKey: "likedBy",
        otherKey: "blogId"
      })
    }
  }
  user.init({
    username:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:{msg:"username must be unique"},
      validate:{
        notNull:{msg:"username is required"},
        notEmpty:{msg:"username can't be empty"}
      }
    },
    fullName: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:"fullName is required"},
        notEmpty:{msg:"fullName can't be empty"}
      }
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:{msg:"email must be unique"},
      validate:{
        notNull:{msg:"email is required"},
        notEmpty:{msg:"email can't be empty"}
      }
    },
    avatar:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:"avatar is required"},
        notEmpty:{msg:"avatar can't be empty"}
      }
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{msg:"password is required"},
        notEmpty:{msg:"password can't be empty"}
      }
    },
    refreshToken:{
      type:DataTypes.STRING,
      allowNull:true,
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};