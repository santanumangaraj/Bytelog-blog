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
        type: Sequelize.STRING(200),
        allowNull:false,
        unique:true
      },
      slug: {
        type: Sequelize.STRING(220),
        allowNull:false,
        unique:true
      },
      excerpt: {
        type: Sequelize.STRING(300),
        allowNull:false,
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull:false,
      },
      coverImageUrl: {
        type: Sequelize.STRING(500),
      },
      coverImageKey: {
        type: Sequelize.STRING(500),
      },
      status: {
        type: Sequelize.ENUM("draft", "published", "archived"),
        defaultValue: "draft",
      },
      views:{
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue:0
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
      publishedAt: {
        type: Sequelize.DATE,
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