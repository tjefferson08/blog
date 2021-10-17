---
meta:
  title: Jest vs the Browser for Testing
  description: Why is this so hard
headers:
  Cache-Control: max-age=3600
---

# Intro

So I was (over-)thinking about testing my remix project...

I never liked how jest encouraged an "alternate universe" for testing.

In "real life", your code is bundled with webpack, compiled with babel, and run in a browser

In "jest life", you un-bundle (to test a unit), compile with babel (usually with an partial/custom config), and run in jsdom in node

:exploding_head:

So for this project, I was thinking it'd be cool to have a small browser-friendly test runner (mocha? QUnit?) that would load esbuild-built test bundles

So what I think I need is a way to turn:

```jsx
// add.test.js
import { add } from "add";

test("add works", () => {
  assert(add(1, 2) === 3, "addition!");
});
```

into its own static asset, and remix could handle it like a stylesheet:

```
// app/routes/test.js
import addTestUrl from './add.test.js'

export default function TestHarness() {
  return <div>
    <h1>Visit /test to run browser suite!</h1>
    <script src="https://unpkg.com/mocha/mocha.js" />
    <script src={addTestUrl} />
  </div>
}
```

# Browser concerns

- requires special bundling and loading of test files
- parallelization concerns? node + jsdom may have better perf characteristics than one browser? multiple tabs? IDK

# Discovery log

- solving a few things at once: common bundler config, node/browser showdown, multiple client entries for remix

- node solution:

```sh
npm i --save-dev esbuild-runner global-jsdom @testing-library/react

mocha -r esbuild-runner/register app/loading.test.tsx

# with jsdom involved, and importing react in component
mocha -r esbuild-runner/register -r global-jsdom/register app/loading.test.tsx
```

- can omit react imports by using [react-shim + inject from esbuild](https://esbuild.github.io/content-types/#auto-import-for-jsx), passing thru to the runner

- might be able to commandeer the entry.client.tsx to build the test bundle instead of the regular app bundle

Ideally this would be a development server addition, not a full on "mode", but that's fine

- OK so you can add a test route that uses esbuild as the Loader mechanism

- is this any better than letting cypress bundle specs with esbuild?
