## The Problem Indexes Solve

Without an index, MySQL has to scan every row in a table to find the ones that match a query — this is called a full table scan. On a small table this is fine. On a table with millions of rows, it can turn a fast query into a slow one.

An index is a separate data structure that lets MySQL find matching rows without scanning the whole table, similar to the index at the back of a book.

## A Simple Example

```
SELECT * FROM blogs WHERE slug = "understanding-redis-caching-in-nodejs";
```

Without an index on `slug`, MySQL scans every row in `blogs` and checks each one. With an index on `slug`, it can jump almost directly to the matching row.

```
CREATE INDEX idx_blogs_slug ON blogs (slug);
```

## How B-Tree Indexes Work

Most MySQL indexes use a B-Tree structure, which keeps data sorted and lets lookups, range scans, and sorted results all use the same structure efficiently.

```
Query
   ↓
Walk the B-Tree
   ↓
Find matching leaf node(s)
   ↓
Return row pointers
   ↓
Fetch actual rows
```

## Composite Indexes

An index can span multiple columns. Column order matters — a composite index on `(status, publishedAt)` speeds up queries that filter by `status` and sort by `publishedAt`, but doesn't help much if a query only filters by `publishedAt` alone.

```
CREATE INDEX idx_blogs_status_published_at
ON blogs (status, publishedAt);
```

## The Trade-off

Indexes aren't free. Every index:

- Speeds up reads that use it
- Slows down writes slightly, since the index has to be updated too
- Takes up additional disk space

This is why you shouldn't index every column "just in case" — index the columns your actual queries filter, join, or sort by.

## Important Considerations

- Use `EXPLAIN` to check whether a query is actually using an index
- Composite index column order should match how your queries filter and sort
- Unique constraints (like `blogs.slug`) create an index as a side effect
- Too many indexes on a write-heavy table can hurt insert and update performance

## Conclusion

Indexing is one of the highest-leverage things you can do for database performance, but it requires understanding your actual query patterns first. Start by looking at your slowest queries with `EXPLAIN`, then index accordingly — not the other way around.
