'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

      await queryInterface.changeColumn("blogs","views",{
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue:0
      })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("blogs","views",{
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull:false,
        defaultValue:0
      })
  }
};
