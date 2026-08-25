import "dotenv/config";
import db from "../models/index.js";
import { createTag, findOneTag } from "../repository/tags.repository.js";
import { createUniqueTagSlug } from "../utils/slug.utils.js";

const { sequelize } = db;

// Tags are a fixed, admin-curated list — users pick from these, they never
// type in new ones (see tags.service.js#attachTagsToBlog). Add/remove
// categories here and re-run this script to update the set.
const PREDEFINED_TAGS = [
    "Technology",
    "Programming",
    "Career",
    "Design",
    "Personal",
];

const run = async () => {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    for (const name of PREDEFINED_TAGS) {
        const existing = await findOneTag({ name });

        if (existing) {
            console.log(`↷  Found tag: ${name}`);
            continue;
        }

        const slug = await createUniqueTagSlug(name);
        await createTag({ name, slug });
        console.log(`➕ Created tag: ${name} (${slug})`);
    }

    console.log("🌱 Done seeding tags.");
    process.exit(0);
};

run().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
