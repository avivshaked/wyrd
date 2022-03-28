import { MeasureManagerOptions } from "./MeasureManagerOptions";
import { measureManagerDefaults } from "./measureManagerDefaults";
import { globalObj } from "./globalObj";

export class MeasureManager {
  private _globalName: string;
  get globalName(): string {
    return this._globalName;
  }

  private _shouldBeOnGlobal: boolean;

  constructor(options: MeasureManagerOptions = {}) {
    const { globalName, shouldBeOnGlobal } = options;

    this._globalName = globalName || measureManagerDefaults.globalName;
    if (this._globalName === "") {
      this._globalName = measureManagerDefaults.globalName;
    }
    this._shouldBeOnGlobal =
      shouldBeOnGlobal ?? measureManagerDefaults.shouldBeOnGlobal;

    if (this._shouldBeOnGlobal) {
      this._mountInstanceOnGlobal();
    }
  }

  private _mountInstanceOnGlobal() {
    let safeOnGlobal = false;
    // mounting the instance on the global should not override other objects on the global
    // this will check if the namespace is free. if not, it will add '_' to the start of the name
    // until it finds a free namespace
    while (!safeOnGlobal) {
      if (
        (globalObj as { [key: string]: any })[this._globalName] !== undefined
      ) {
        this._globalName = "_" + this._globalName;
      } else {
        safeOnGlobal = true;
        (globalObj as { [key: string]: any })[this._globalName] = this;
      }
    }
  }

  public removeFromGlobal() {
    delete (globalObj as { [key: string]: any })[this._globalName];
    this._shouldBeOnGlobal = false;
  }

  public isOnGlobal(): boolean {
    return (
      (globalObj as { [key: string]: any })[this._globalName] !== undefined
    );
  }
}
