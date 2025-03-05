import { resolve } from "node:path";
import { isDirectorySync } from "path-type";
import createError from "./create-error.js";

class OptimagiumConfig {
  constructor() {
    this.setImagesRoot("./images");
    this.setAutoFormat(false);
    this.setAutoAccept(false);
  }

  setImagesRoot(path) {
    const root = resolve(process.cwd(), path);
    if (!isDirectorySync(root)) {
      throw createError("Directory not exists");
    }
    this.root = root;
  }

  setAutoFormat(autoFormat) {
    this.autoFormat = autoFormat;
  }

  setAutoAccept(autoAccept) {
    this.autoAccept = autoAccept;
  }
}

export default OptimagiumConfig;
