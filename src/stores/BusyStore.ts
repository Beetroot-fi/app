import { action, makeObservable, observable } from "mobx";

class BusyStore {
  isLoading = false;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      onLoadingStart: action,
      onLoadingFinished: action,
    });
  }

  onLoadingStart(): void {
    this.isLoading = true;
  }

  onLoadingFinished(): void {
    this.isLoading = false;
  }
}

export default BusyStore;
