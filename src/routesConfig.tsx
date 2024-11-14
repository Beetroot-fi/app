import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";

const routesConfig = [
  {
    path: "/",
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
    exact: true,
  },
];

export default routesConfig;
