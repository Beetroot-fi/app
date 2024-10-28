import { createContext, useContext } from "react";
import HeaderStore from "./HeaderStore";

const HeaderStoreContext = createContext<HeaderStore | undefined>(undefined);

interface HeaderStoreProviderProps {
  children: React.ReactNode;
  store: HeaderStore;
}

export const HeaderStoreProvider = ({
  children,
  store,
}: HeaderStoreProviderProps): JSX.Element => {
  return (
    <HeaderStoreContext.Provider value={store}>
      {children}
    </HeaderStoreContext.Provider>
  );
};

export const useHeaderStore = (): HeaderStore => {
  const store = useContext(HeaderStoreContext);

  if (!store) {
    throw new Error(
      "useHeaderStore should be called inside HeaderStoreProvider"
    );
  }

  return store;
};
