import { useRoutes } from "react-router-dom";
import routesConfig from "./routesConfig";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const AppRoutes = () => {
  const routes = useRoutes(routesConfig);
  return routes;
};

const App = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://ton.vote/tonconnect-manifest.json">
      <AppRoutes />
    </TonConnectUIProvider>
  );
};

export default App;
