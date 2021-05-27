import { createCookieSessionStorage } from "remix";

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",

    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: true,
  },
});

export { getSession, commitSession, destroySession };
