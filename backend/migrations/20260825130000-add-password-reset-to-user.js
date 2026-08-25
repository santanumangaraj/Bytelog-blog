"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "passwordResetToken", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
      after: "lockUntil"
    });
    await queryInterface.addColumn("users", "passwordResetExpires", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      after: "passwordResetToken"
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "passwordResetToken");
    await queryInterface.removeColumn("users", "passwordResetExpires");
  },
};
