import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import db from "../models/index.js";
import createUniqueSlug from "../utils/slug.utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const contentDir = path.join(dataDir, "content");

const { user: User, blog: Blog, sequelize } = db;

const authors = JSON.parse(fs.readFileSync(path.join(dataDir, "authors.json"), "utf-8"));
const blogsSeed = JSON.parse(fs.readFileSync(path.join(dataDir, "blogs.json"), "utf-8"));

const run = async () => {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    const authorIdByEmail = {};

    for (const author of authors) {
        const [user, created] = await User.findOrCreate({
            where: { email: author.email },
            defaults: {
                username: author.username,
                fullName: author.fullName,
                email: author.email,
                avatarImageKey: author.avatarImageKey,
                avatarImageUrl: author.avatarImageUrl,
                password: await bcrypt.hash(author.password, 10),
            },
        });

        authorIdByEmail[author.email] = user.id;
        console.log(`${created ? "➕ Created" : "↷  Found"} author: ${author.fullName} (#${user.id})`);
    }

    for (const entry of blogsSeed) {
        const existing = await Blog.findOne({ where: { title: entry.title } });

        if (existing) {
            console.log(`↷  Skipped (already exists): ${entry.title}`);
            continue;
        }

        const content = fs.readFileSync(path.join(contentDir, entry.contentFile), "utf-8").trim();
        const slug = await createUniqueSlug(entry.title);
        const authorId = authorIdByEmail[entry.authorEmail];

        if (!authorId) {
            console.warn(`⚠️  No seeded author found for ${entry.authorEmail}, skipping "${entry.title}"`);
            continue;
        }

        await Blog.create({
            title: entry.title,
            slug,
            excerpt: entry.excerpt,
            content,
            coverImageUrl: entry.coverImageUrl,
            coverImageKey: entry.coverImageKey,
            status: entry.status,
            views: entry.views ?? 0,
            publishedAt: entry.status === "published" ? new Date() : null,
            author: authorId,
        });

        console.log(`➕ Created blog: ${entry.title} (${entry.status})`);
    }

    console.log("🌱 Done seeding sample blogs.");
    process.exit(0);
};

run().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
