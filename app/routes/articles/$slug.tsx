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
  const { protocol, host } = new URL(request.url);
  const url = new URL(
    `${protocol}//${host}:3000/static/articles/${params.slug}`
  );

  const [contentResponse, manifestResponse] = await Promise.all([
    fetch(`${url}/index.mdx`),
    fetch(`${url}/manifest.json`),
  ]);

  if (contentResponse.status === 404) {
    return json({ status: "not-found" }, { status: 404 });
  }

  const additionalFiles = manifestResponse.ok
    ? (await manifestResponse.json()).assets
    : [];

  const additionalAssetsByFilename = Object.fromEntries(
    await Promise.all(
      additionalFiles.map(async (filename: string) => {
        const resp = await fetch(`${url}/${filename}`);
        const contents = await resp.text();
        return [filename, contents];
      })
    )
  );

  const mdxText = await contentResponse.text();
  const mdxData = await bundleMDX(mdxText, {
    files: additionalAssetsByFilename,
  });

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
