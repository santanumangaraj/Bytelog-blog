

export const cacheKey = {
    idempotency: (key) => `idempotency:${key}`,
    getAllBlogs: (filters)=> `cache:blogs:${JSON.stringify(filters)}`,
    blogImageLock: (blogId)=> `lock:blog-image:${blogId}`,
}