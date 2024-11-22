import { useEffect } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { apiService } from "./api";
import { useRoutes } from "react-router-dom";
import routesConfig from "./routesConfig";

interface AuthWrapperProps {
  children: React.ReactNode;
}

interface WebAppTelegramInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: WebAppTelegramInitData;
      };
    };
  }
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  useEffect(() => {
    const handleLogin = async () => {
      try {
        const initData = window.Telegram?.WebApp?.initData;

        if (!initData) {
          return;
        }

        await apiService.login(initData);
      } catch (error) {
        console.error("Login error:", error);
      }
    };

    handleLogin();
  }, []);

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const routes = useRoutes(routesConfig);
  return routes;
};

const App: React.FC = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/Beetroot-fi/app/refs/heads/main/tonconnect-manifest.json">
      <AuthWrapper>
        <AppRoutes />
      </AuthWrapper>
    </TonConnectUIProvider>
  );
};

export default App;
