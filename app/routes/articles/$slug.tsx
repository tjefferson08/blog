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
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://blog.travisjefferson.com"
      : `http://127.0.0.1:${process.env.PORT || 3000}`;

  return bundleMDXFor(`${baseURL}/static/articles/${params.slug}`);
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
