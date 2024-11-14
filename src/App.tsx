import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useRoutes } from "react-router-dom";
import routesConfig from "./routesConfig";

const AppRoutes: React.FC = () => {
  const routes = useRoutes(routesConfig);
  return routes;
};

const App: React.FC = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/Beetroot-fi/app/refs/heads/main/tonconnect-manifest.json">
      <AppRoutes />
    </TonConnectUIProvider>
  );
};

export default App;
