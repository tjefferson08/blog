import { bundleMDX } from "../../mdx.server";
import { Post } from "../../mdx";
import { useRouteData } from "remix";

export const loader = () => {
  const mdxSource = `
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Wahoo

Here's a **neat** demo:

`.trim();

  return bundleMDX(mdxSource, {});
};

export default function BlogPost() {
  const data = useRouteData();
  console.log(data, Post);
  return (
    <div>
      <pre>{JSON.stringify(data)}</pre>
      <Post code={data.code} frontmatter={data.frontmatter} />
    </div>
  );
}
