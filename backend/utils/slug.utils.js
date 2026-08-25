import slugify from "slugify";
import { findOneBlog } from "../repository/blog.repository.js";
import { findOneTag } from "../repository/tags.repository.js";

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

const createUniqueTagSlug = async (name) => {
    let slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
    });

    let counter = 1;

    while (await findOneTag({ slug })) {
        slug = `${slug}-${counter}`;
        counter++;
    }

    return slug;
};

export default createUniqueSlug
export { createUniqueTagSlug }