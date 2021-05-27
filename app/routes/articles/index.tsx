import { HeadersFunction, LoaderFunction } from "remix";
import { useRouteData, Link } from "remix";
import { getSession } from "../../sessions";

type Article = {
  type: string;
  path: string;
  name: string;
};
type RouteData = {
  articles: Array<Article>;
  recentlyViewed: Array<string>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const recentlyViewed = session.get("recentlyViewed") || [];

  const articles = await (
    await fetch(
      `https://api.github.com/repos/tjefferson08/blog/contents/articles`
    )
  ).json();

  return {
    articles,
    recentlyViewed,
  };
};

export const headers: HeadersFunction = () => {
  return { "Cache-Control": "max-age=1800" };
};

const withoutExt = (name: string) => name.split(".").slice(0, -1).join(".");

export default function ArticlesList() {
  const { articles: articlesAndSubfolders, recentlyViewed } = useRouteData<
    RouteData
  >();
  const articles = articlesAndSubfolders.filter((item) => item.type == "file");

  return (
    <div>
      <section>
        <ul>
          {articles.map((article) => (
            <li key={article.path}>
              <Link to={`/articles/${withoutExt(article.name)}`}>
                {withoutExt(article.name)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {recentlyViewed.length > 0 ? (
        <section>
          {recentlyViewed.map((recent) => (
            <div>{recent}</div>
          ))}
        </section>
      ) : null}
    </div>
  );
}
