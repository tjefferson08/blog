import { Headers, useRouteData } from "remix";
import type { HeadersFunction, LoaderFunction } from "remix";
import { commitSession, getSession } from "../../sessions";
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

export const loader: LoaderFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const recents = [...(session.get("recentlyViewed") || []), params.slug];
  session.set("recentlyViewed", [...new Set(recents)]);
  const response = (await bundleMDXFor(params.slug)).clone();

  response.headers.set("Cache-Control", "max-age=1800");
  response.headers.set("Set-Cookie", await commitSession(session));
  return response;
};

export const handle = {
  breadcrumb: (match) => {
    return <span>{match.data.frontmatter.title}</span>;
  },
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
