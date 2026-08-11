"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "failedLoginAttempts", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after:"refreshToken"
    });
    await queryInterface.addColumn("users", "lockUntil", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      after:"failedLoginAttempts"
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "failedLoginAttempts");
    await queryInterface.removeColumn("users", "lockUntil");
  },
};
