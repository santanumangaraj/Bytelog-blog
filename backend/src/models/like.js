'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      like.belongsToMany(models.blog,{
        through: "blogLikes",
        as:"likedBlogs",
        foreignKey:"LikeId"
      })
    }
  }
  like.init({
    blogId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{msg:"blogId is required"},
        notEmpty:{msg:"blogId can't be empty"}
      }
    },
    likedBy: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{        
        notNull:{msg:"likedBy is required"},
        notEmpty:{msg:"likedBy can't be empty"}
      }
    }
  }, {
    sequelize,
    modelName: 'like',
    indexes: [
      {
          unique: true,
          fields: ["blogId", "likedBy"]
      }
    ]
  });
  return like;
};