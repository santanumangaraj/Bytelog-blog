import { ApiError } from "../utils/ApiError.js"
import { findAllTags, findTagsBySlugs } from "../repository/tags.repository.js"
import { cacheAside } from "../cache/cacheAside.js"
import { cacheKey } from "../cache/cacheKey.js"
import { deleteCache } from "./redisCache.js"

const MAX_TAGS_PER_BLOG = 5

// Tags are a fixed, admin-curated list (see seeders/seedTags.js) — users
// pick from what already exists, they can never create a tag by typing one
// in. This just trims/lowercases/dedupes the incoming slugs and enforces
// the per-blog cap; whether each slug actually exists is checked in
// attachTagsToBlog against the DB. Returns undefined when `tags` itself
// wasn't provided, so callers can tell "no change requested" apart from
// "clear all tags" (an empty array).
const normalizeTagSlugs = (tags) => {
    if (tags === undefined) return undefined

    if (!Array.isArray(tags)) {
        throw new ApiError(400, "Tags must be an array of tag slugs")
    }

    const seen = new Set()
    const normalized = []

    for (const raw of tags) {
        if (typeof raw !== "string") continue

        const slug = raw.trim().toLowerCase()

        if (!slug || seen.has(slug)) continue

        seen.add(slug)
        normalized.push(slug)
    }

    if (normalized.length > MAX_TAGS_PER_BLOG) {
        throw new ApiError(400, `A blog can have at most ${MAX_TAGS_PER_BLOG} tags`)
    }

    return normalized
}

const attachTagsToBlog = async (blog, tagSlugs) => {
    const normalized = normalizeTagSlugs(tagSlugs)
    if (normalized === undefined) return

    if (normalized.length === 0) {
        await blog.setTags([])
        return
    }

    const tagRecords = await findTagsBySlugs(normalized)

    if (tagRecords.length !== normalized.length) {
        const foundSlugs = new Set(tagRecords.map((t) => t.slug))
        const unknown = normalized.filter((slug) => !foundSlugs.has(slug))
        throw new ApiError(400, `Unknown tag(s): ${unknown.join(", ")}`)
    }

    await blog.setTags(tagRecords)
    await deleteCache(cacheKey.getAllTags())
}

const getAllTags = async () => {
    return await cacheAside({
        key: cacheKey.getAllTags(),
        ttl: 60 * 10,
        loader: async () => await findAllTags(),
    })
}

export {
    normalizeTagSlugs,
    attachTagsToBlog,
    getAllTags
}
