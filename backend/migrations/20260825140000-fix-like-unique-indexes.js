"use strict";

import { QueryTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
    // 20260702103356-create-like.js accidentally set `unique: true` on
    // blogId AND likedBy as independent column constraints, instead of only
    // as a composite pair. In MySQL that produced two single-column UNIQUE
    // indexes on top of the intended composite UNIQUE(blogId, likedBy)
    // added in 20260708080454-add-unique-const-like.js:
    //   - UNIQUE(blogId)  -> a blog could only ever be liked once, by anyone
    //   - UNIQUE(likedBy) -> a user could only ever like one blog, ever
    // Composite UNIQUE(blogId, likedBy) is the only constraint that should
    // exist; this migration removes the two broken single-column ones.

    // likedBy has a FK to users.id. Once we drop its single-column unique
    // index, MySQL needs *some* other index with likedBy as a leftmost
    // column to keep backing that FK (the composite index doesn't count —
    // likedBy isn't its leftmost column). Add a plain index first; this also
    // happens to be the right index for future "blogs liked by a user"
    // queries, which the composite index can't serve.
    await queryInterface.addIndex("likes", {
      fields: ["likedBy"],
      name: "likes_likedBy_idx",
    });

    // blogId doesn't need an equivalent standalone index: the composite
    // UNIQUE(blogId, likedBy) already has blogId as its leftmost column, so
    // it backs both the blogId FK and blogId-only lookups (e.g. COUNT(*)
    // WHERE blogId = ?) on its own.

    // Find the two broken single-column unique indexes by introspecting the
    // live table rather than assuming a name — MySQL auto-names an inline
    // `UNIQUE` column constraint, and that name isn't guaranteed.
    const indexRows = await queryInterface.sequelize.query(
      "SHOW INDEX FROM `likes`",
      { type: QueryTypes.SELECT }
    );

    const columnsByIndex = new Map();
    for (const row of indexRows) {
      if (Number(row.Non_unique) !== 0) continue; // only unique indexes
      if (row.Key_name === "PRIMARY") continue;
      if (!columnsByIndex.has(row.Key_name)) columnsByIndex.set(row.Key_name, []);
      columnsByIndex.get(row.Key_name).push(row.Column_name);
    }

    for (const [indexName, columns] of columnsByIndex) {
      const isBrokenSingleColumnUnique =
        columns.length === 1 && (columns[0] === "blogId" || columns[0] === "likedBy");

      if (isBrokenSingleColumnUnique) {
        await queryInterface.removeIndex("likes", indexName);
      }
    }
  },

  async down(queryInterface) {
    // Faithful inverse of `up`, for migration-tooling correctness only.
    // Do NOT actually run this rollback in production — it recreates the
    // exact bug this migration exists to fix.
    await queryInterface.addIndex("likes", {
      fields: ["blogId"],
      unique: true,
      name: "likes_blogId_unique",
    });
    await queryInterface.addIndex("likes", {
      fields: ["likedBy"],
      unique: true,
      name: "likes_likedBy_unique",
    });
    await queryInterface.removeIndex("likes", "likes_likedBy_idx");
  },
};
