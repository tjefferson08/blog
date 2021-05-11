import { json, useRouteData } from "remix";
import type { LoaderFunction } from "remix";
import { bundleMDX, getLocalContents } from "../../mdx.server";
import { Post } from "../../mdx";

type MDXResponse =
  | {
      status: "success";
      code: string;
      frontmatter: { [key: string]: any };
    }
  | { status: "not-found" };

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log("request", request);
  console.log("params", params);

  const { protocol, host } = new URL(request.url);
  const url = new URL(
    `${protocol}//${host}:3000/static/articles/${params.slug}/index.mdx`
  );
  const contentRequest = new Request(url.toString());
  console.log("contentrequest", contentRequest);
  const contentResponse = await fetch(contentRequest);
  if (contentResponse.status === 404) {
    return json({ status: "not-found" }, { status: 404 });
  }

  const mdxText = await contentResponse.text();
  const mdxData = await bundleMDX(mdxText, {});

  return json({
    status: "success",
    ...mdxData,
  });
};

export default function BlogPost() {
  const data = useRouteData<MDXResponse>();

  if (data.status === "not-found") {
    return <div> not found I guess</div>;
  }

  return (
    <div>
      <Post code={data.code} frontmatter={data.frontmatter} />
    </div>
  );
}
