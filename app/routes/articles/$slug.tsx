import { json, useRouteData } from "remix";
import type { LoaderFunction } from "remix";
import { bundleMDXFor } from "../../mdx.server";
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

  return bundleMDXFor(url.toString());
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
