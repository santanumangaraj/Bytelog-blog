"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Rename avatar -> avatarImageKey
    await queryInterface.renameColumn(
      "users",
      "avatar",
      "avatarImageKey"
    );

    // Add avatarImageUrl after avatarImageKey
    await queryInterface.addColumn("users", "avatarImageUrl", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "avatarImageKey",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove avatarImageUrl
    await queryInterface.removeColumn("users", "avatarImageUrl");

    // Rename avatarImageKey -> avatar
    await queryInterface.renameColumn(
      "users",
      "avatarImageKey",
      "avatar"
    );
  },
};

