import { action, makeObservable, observable } from "mobx";
import BusyStore from "../../../stores/BusyStore";

class HeaderStore extends BusyStore {
  disconnectMenuStatus = false;
  constructor() {
    super();
    makeObservable<HeaderStore>(this, {
      disconnectMenuStatus: observable,
      setDisconnectMenuStatus: action,
    });
  }

  setDisconnectMenuStatus = (status: boolean) => {
    this.disconnectMenuStatus = status;
  };
}

export default HeaderStore;
