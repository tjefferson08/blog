import { Link } from "remix";

export default function ArticlesList() {
  return (
    <div>
      <section>
        <ul>
          <li>
            <Link to={`/articles/npm-npx-magic`}>NPM / NPX magic</Link>
            <Link to={`/articles/jest-vs-browser`}>NPM / NPX magic</Link>
            <Link to={`/articles/terraform-repo-structure`}>
              NPM / NPX magic
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
