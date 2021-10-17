import { Link, useLoaderData } from "remix";
import * as npmNpxMagic from "./npm-npx-magic.md";
import * as flashCards from "./flash-cards.mdx";
import * as jestVsBrowser from "./jest-vs-browser.md";
import * as privateSubnets from "./private-subnet-access.md";
import * as terraformRepo from "./terraform-repo-structure.md";

const articleInfoFor = (mod: typeof npmNpxMagic) => ({
  slug: mod.filename.replace(/\.mdx?$/, ""),
  ...mod.attributes.meta,
});

export const loader = () => {
  return [
    npmNpxMagic,
    flashCards,
    jestVsBrowser,
    privateSubnets,
    terraformRepo,
  ].map(articleInfoFor);
};

export default function ArticlesList() {
  const articleInfos = useLoaderData();
  return (
    <section>
      <ul className="space-y-4">
        {articleInfos.map((info) => (
          <li
            key={info.slug}
            className="w-64 h-3 text-blue-500 bg-gradient-to-br from-fuchsia-500 to-purple-600"
          >
            <Link to={info.slug}>{info.title}</Link>
            {info.descripion ? info.description : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
