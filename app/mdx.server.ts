import { promises as fsp } from "fs";
import path from "path";

export { bundleMDX } from "mdx-bundler";

export async function getLocalContents(relativeFilename: string) {
  const filename = path.join(
    process.cwd(),
    "articles",
    `${relativeFilename}.mdx`
  );
  console.log("filename", filename);
  try {
    return await fsp.readFile(filename, { encoding: "utf8" });
  } catch (err) {
    console.error(err);
    if (err.code === "ENOENT") {
      return null;
    } else {
      throw err;
    }
  }
}
