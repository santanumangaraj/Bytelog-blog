import slugify from "slugify";
import { findOneBlog } from "../repository/blog.repository.js";

const createUniqueSlug = async (title) => {
    let slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    let counter = 1;

    while (await findOneBlog({ slug })) {
        slug = `${slug}-${counter}`;
        counter++;
    }

    return slug;
};

export default createUniqueSlug