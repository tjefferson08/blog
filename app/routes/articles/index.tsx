import type { HeadersFunction, LoaderFunction } from "remix";
import { useRouteData, Link } from "remix";

type Article = {
  path: string;
  name: string;
};

export const loader: LoaderFunction = () => {
  return fetch(
    `https://api.github.com/repos/tjefferson08/blog/contents/articles`
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
};

const withoutExt = (name: string) => name.split(".").slice(0, -1).join(".");

export default function ArticlesList() {
  const articles = useRouteData<Article[]>();
  console.log(articles);
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.path}>
          <Link to={`/articles/${withoutExt(article.name)}`}>
            {article.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
