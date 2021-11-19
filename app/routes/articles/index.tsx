import { Link, useLoaderData } from "remix";
import * as npmNpxMagic from "./npm-npx-magic.md";
import * as flashCards from "./flash-cards.mdx";
import * as jestVsBrowser from "./jest-vs-browser.md";
import * as privateSubnets from "./private-subnet-access.md";
import * as terraformRepo from "./terraform-repo-structure.md";
import * as toolchain from "./toolchain.md";

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
    toolchain,
  ].map(articleInfoFor);
};

export default function ArticlesList() {
  const articleInfos = useLoaderData();
  return (
    <section className="max-w-xl mx-auto">
      <ul>
        {articleInfos.map((info) => (
          <li key={info.slug} className="p-4">
            <article>
              <header>
                <Link to={info.slug}>
                  <h2 className="text-xl text-green-600 font-medium">
                    {info.title}
                  </h2>
                </Link>
              </header>
              <small>
                <time dateTime="2020-04-10">April 10, 2020</time>
              </small>
              <p>{info.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
