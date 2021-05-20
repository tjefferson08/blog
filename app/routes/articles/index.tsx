import type { HeadersFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";

type Article = {
  path: string;
  name: string;
};

export const loader: LoaderFunction = () => {
  return fetch(
    `https://api.github.com/repos/tjefferson08/blog/contents/public/static/articles`
  );
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
};

export default function ArticlesList() {
  const articles = useRouteData<Article[]>();
  console.log(articles);
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.path}>{article.name}</li>
      ))}
    </ul>
  );
}
