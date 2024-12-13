import { Outlet } from "react-router-dom";
import { Layout } from "../../components/layouts/layout";

export const AppRoot = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
