import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { HomePage } from "./pages/HomePage";

const App: React.FC = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/Beetroot-fi/app/refs/heads/main/tonconnect-manifest.json">
      <HomePage />
    </TonConnectUIProvider>
  );
};

export default App;
