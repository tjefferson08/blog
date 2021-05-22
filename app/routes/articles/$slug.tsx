import { Headers, useRouteData } from "remix";
import type { HeadersFunction, LoaderFunction } from "remix";
import { bundleMDXFor } from "../../mdx.server";
import { Post } from "../../mdx";
import articleStyles from "../../styles/article.css";

export function links() {
  return [{ rel: "stylesheet", href: articleStyles }];
}

type MDXResponse =
  | {
      status: "success";
      code: string;
      frontmatter: { [key: string]: any };
    }
  | { status: "not-found" };

export const loader: LoaderFunction = async ({ params }) => {
  return bundleMDXFor(params.slug);
};

export const headers: HeadersFunction = () => {
  return { "Cache-Control": "max-age=1800" };
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
