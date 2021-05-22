import { json } from "remix";
import { bundleMDX } from "mdx-bundler";
import highlight from "rehype-highlight";

const BASE_URL = `https://api.github.com/repos/tjefferson08/blog/contents/articles`;

export async function bundleMDXFor(slug: string) {
  const url = `${BASE_URL}/${slug}`;
  const [contentResponse, manifestResponse] = await Promise.all([
    fetch(`${url}.mdx`, {
      headers: { Accept: "application/vnd.github.v3.raw" },
    }),
    fetch(url),
  ]);

  if (contentResponse.status === 404) {
    return json({ status: "not-found" }, { status: 404 });
  }

  const additionalFiles = manifestResponse.ok
    ? await manifestResponse.json()
    : [];

  const additionalAssetsByFilename = Object.fromEntries(
    await Promise.all(
      additionalFiles.map(
        async (file: { name: string; download_url: string }) => {
          const resp = await fetch(file.download_url);
          const contents = await resp.text();
          return [`./${slug}/${file.name}`, contents];
        }
      )
    )
  );

  const mdxText = await contentResponse.text();
  const mdxData = await bundleMDX(mdxText, {
    files: additionalAssetsByFilename,
    xdmOptions(options) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [...(options.remarkPlugins ?? [])];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        highlight,
        () => transformCodeBlocks,
      ];

      return options;
    },
  });

  return json({
    status: "success",
    ...mdxData,
  });
}

function transformCodeBlocks(node: Node): Node {
  const { children } = node;

  if (node.tagName === "code" && node.children) {
    const wrapped = wrapLines(node.children);
    return { ...node, children: wrapped };
  }

  return {
    ...node,
    ...(children ? { children: children.map(transformCodeBlocks) } : {}),
  };
}

type Node = {
  type: string;
  tagName?: string;
  children?: Node[];
  value?: string;
};

// assumes newlines appear at tree depth of 1
function wrapLines(children: Node[]) {
  const partitionedChildren = partitionByLine(children);
  return partitionedChildren.map((lineOfChildren, n) => ({
    type: "element",
    tagName: "span",
    properties: { "data-line-number": n + 1 },
    children: lineOfChildren,
  }));

  // TODO write tests
  // example: [{ // comment }, { text: '\n\n' }]
  // example: [{ text: '\n'}]
  // example: [{ text: '{\n  '}]
  function partitionByLine(children: Node[]): Node[][] {
    const lines: Node[][] = [];
    let line: Node[] = [];
    for (const child of children) {
      if (child.type === "text" && child.value?.includes("\n")) {
        const [primaryLine, ...embeddedLines] =
          child.value.match(/(.*\n|.+)/g) || [];

        const nodeFor = (l: string) => ({ type: "text", value: l });

        // push primary line as part of line in progress
        line.push(nodeFor(primaryLine));
        lines.push(line);
        line = [];

        // push embedded lines as extras
        lines.push(...embeddedLines.slice(0, -1).map((l) => [nodeFor(l)]));

        // last line might be a complete line, or may have some trailing
        // characters to begin the next line (typically whitespace I guess)
        const [lastLine] = embeddedLines.slice(-1);

        if (lastLine.includes("\n")) {
          lines.push([nodeFor(lastLine)]);
        } else {
          line = [nodeFor(lastLine)];
        }
      } else {
        line.push(child);
      }
    }
    return lines.concat(line.length ? [line] : []);
  }
}
