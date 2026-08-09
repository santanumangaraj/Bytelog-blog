"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "role", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "READER",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "role");
  },
};
