import { Layout } from "./components/Layout";
import { Invite } from "./pages/Invite";
import { MainPage } from "./pages/MainPage";
import { Tasks } from "./pages/Tasks";

const routesConfig = [
  {
    path: "/",
    element: (
      <Layout>
        <MainPage />
      </Layout>
    ),
    exact: true,
  },
  {
    path: "/tasks",
    element: (
      <Layout>
        <Tasks />
      </Layout>
    ),
    exact: true,
  },
  {
    path: "/invite",
    element: (
      <Layout>
        <Invite />
      </Layout>
    ),
    exact: true,
  },
];

export default routesConfig;
