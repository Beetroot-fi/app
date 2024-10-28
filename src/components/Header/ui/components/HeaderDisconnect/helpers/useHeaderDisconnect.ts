import { useTonConnectUI } from "@tonconnect/ui-react";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import HeaderStore from "../../../../store/HeaderStore";
import s from "../ui/HeaderDisconnect.module.scss";

interface Props {
  store: HeaderStore;
}

export const useHeaderDisconnect = ({ store }: Props) => {
  const [tonConnectUI] = useTonConnectUI();
  const [classes, setClasses] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const noClick = useCallback(() => {
    store.setDisconnectMenuStatus(false);
  }, [store]);

  const yesClick = () => {
    store.setDisconnectMenuStatus(false);
    tonConnectUI?.disconnect();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        noClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, noClick]);

  useEffect(() => {
    if (store.disconnectMenuStatus) {
      setClasses(clsx(s.db));
      setTimeout(() => {
        setClasses(clsx(s.db, s.vis));
      }, 10);
    } else {
      setClasses(clsx(s.db));
      setTimeout(() => {
        setClasses(clsx());
      }, 300);
    }
  }, [store.disconnectMenuStatus]);
  return { classes, yesClick, ref, noClick };
};
