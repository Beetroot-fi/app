import React, { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { apiService } from "./api";
import routesConfig from "./routesConfig";

interface TelegramAuthProps {
  onAuthComplete: (success: boolean) => void;
}

declare global {
  interface Window {
    Telegram: any;
  }
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuthComplete }) => {
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const tg = window.Telegram.WebApp;
        const initData = tg.initData;

        if (!initData) {
          onAuthComplete(false);
          return;
        }

        await apiService.login(initData);
        onAuthComplete(true);
      } catch (error) {
        onAuthComplete(false);
      }
    };

    if (window.Telegram?.WebApp) {
      handleAuth();
    } else {
      onAuthComplete(false);
    }
  }, [onAuthComplete]);

  return null;
};

const AppRoutes: React.FC = () => {
  const routes = useRoutes(routesConfig);
  return routes;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  const handleAuthComplete = (success: boolean): void => {
    setIsAuthenticated(success);
    setAuthChecked(true);
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/Beetroot-fi/app/refs/heads/main/tonconnect-manifest.json">
      {!isAuthenticated ? (
        <TelegramAuth onAuthComplete={handleAuthComplete} />
      ) : (
        <AppRoutes />
      )}
    </TonConnectUIProvider>
  );
};

export default App;
