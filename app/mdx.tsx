import * as React from "react";
import { getMDXComponent } from "mdx-bundler/client";

type MDXContent = {
  code: string;
  frontmatter: { [key: string]: any };
};

export const Post = ({ code, frontmatter }: MDXContent) => {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <>
      <header>
        <h1>{frontmatter.title} </h1>
        <p>{frontmatter.description}</p>
      </header>
      <main>
        <Component />
      </main>
    </>
  );
};
