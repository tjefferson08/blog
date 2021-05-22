import { HeadersFunction, LoaderFunction } from "remix";
import { useRouteData, Link } from "remix";

type Article = {
  type: string;
  path: string;
  name: string;
};

export const loader: LoaderFunction = () => {
  return fetch(
    `https://api.github.com/repos/tjefferson08/blog/contents/articles`
  );
};

export const headers: HeadersFunction = () => {
  return { "Cache-Control": "max-age=1800" };
};

const withoutExt = (name: string) => name.split(".").slice(0, -1).join(".");

export default function ArticlesList() {
  const articlesAndSubfolders = useRouteData<Article[]>();
  const articles = articlesAndSubfolders.filter((item) => item.type == "file");

  return (
    <ul>
      {articles.map((article) => (
        <li key={article.path}>
          <Link to={`/articles/${withoutExt(article.name)}`}>
            {withoutExt(article.name)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
