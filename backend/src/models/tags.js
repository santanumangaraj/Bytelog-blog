'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tags.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:{msg:"name must be unique"},
      validate:{
        notNull:{msg:"name is required"},
        notEmpty:{msg:"name can't be empty"}
      }
    },
    slug: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:{msg:"slug must be unique"},
      validate:{
        notNull:{msg:"slug is required"},
        notEmpty:{msg:"slug can't be empty"}
      }
    }
  }, {
    sequelize,
    modelName: 'tags',
  });
  return tags;
};