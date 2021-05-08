import { Outlet } from "react-router-dom";

export default function ArticleIndex() {
  return (
    <div>
      <h2>Article Index</h2>
      <Outlet />
    </div>
  );
}
