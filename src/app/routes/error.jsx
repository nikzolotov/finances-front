import { useRouteError } from "react-router-dom";
import { Layout } from "../../components/layouts/layout";

export function ErrorRoute() {
  const error = useRouteError();
  console.error(error);

  return (
    <Layout>
      <h1>Всё сломалось</h1>
      <p>Не факт, что скоро починится, но вот что произошло:</p>
      <p className="error-text">{error.statusText || error.message}</p>
    </Layout>
  );
}
