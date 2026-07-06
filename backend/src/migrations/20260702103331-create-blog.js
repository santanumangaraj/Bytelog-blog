'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      content: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      status: {
        type: Sequelize.JSON,
        allowNull:false,
        defaultValue:[]
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"users",
          key:"id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blogs');
  }
};