import React from "react";
import { Reveal, SectionHeading } from "../blog/blogUi.jsx";
import BlogCard from "../blog/BlogCard.jsx";

const RelatedBlogs = ({ blogs, onOpen }) => {
  if (!blogs?.length) return null;
  return (
    <section className="mt-16">
      <SectionHeading label="Keep reading" title="Related Articles" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, i) => (
          <Reveal key={blog?.id ?? i} delay={i * 80}>
            <BlogCard blog={blog} onOpen={onOpen} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogs;