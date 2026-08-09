"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    await queryInterface.addConstraint("likes", {
      fields: ["blogId", "likedBy"],
      type: "unique",
      name: "unique_blog_like",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint("likes", "unique_blog_like");
  },
};
