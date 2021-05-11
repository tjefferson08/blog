import { json } from "remix";
import { bundleMDX } from "mdx-bundler";

export async function bundleMDXFor(baseURL: string) {
  const [contentResponse, manifestResponse] = await Promise.all([
    fetch(`${baseURL}/index.mdx`),
    fetch(`${baseURL}/manifest.json`),
  ]);

  if (contentResponse.status === 404) {
    return json({ status: "not-found" }, { status: 404 });
  }

  const additionalFiles = manifestResponse.ok
    ? (await manifestResponse.json()).assets
    : [];

  const additionalAssetsByFilename = Object.fromEntries(
    await Promise.all(
      additionalFiles.map(async (filename: string) => {
        const resp = await fetch(`${baseURL}/${filename}`);
        const contents = await resp.text();
        return [filename, contents];
      })
    )
  );

  const mdxText = await contentResponse.text();
  const mdxData = await bundleMDX(mdxText, {
    files: additionalAssetsByFilename,
  });

  return json({
    status: "success",
    ...mdxData,
  });
}
