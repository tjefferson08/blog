import { json, useRouteData } from "remix";
import type { LoaderFunction } from "remix";
import { bundleMDX, getContents } from "../../mdx.server";
import { Post } from "../../mdx";

export const loader: LoaderFunction = async (
  request
): Promise<{ code: string; frontmatter: { [key: string]: any } }> => {
  const mdxContents = await getContents(request.params.slug);
  console.log("ontents", mdxContents);
  if (!mdxContents) {
    return json({ notFound: true }, { status: 404 });
  }
  return bundleMDX(mdxContents, {});
};

export default function BlogPost() {
  const data = useRouteData();
  if (data.notFound) {
    return <div>not found</div>;
  }
  console.log(data, Post);
  return (
    <div>
      <Post code={data.code} frontmatter={data.frontmatter} />
    </div>
  );
}
