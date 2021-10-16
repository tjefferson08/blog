import { Link, Outlet } from "remix";

export const handle = {
  breadcrumb: (match) => {
    return <Link to="/articles">Articles</Link>;
  },
};

export default function Index() {
  return <Outlet />;
}
