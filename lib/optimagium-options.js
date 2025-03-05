import { isPlainObject, isString } from "@sindresorhus/is";

const RESIZE_REGEX = /^(?<w>\d+)x(?<h>\d+)$/;

/**
 * @property {string|Boolean} accept
 * @property {string} acceptHeader
 * @property {string} format
 * @property {Boolean} raw
 * @property {Boolean} minify
 * @property {Boolean} resize
 * @property {Number} width
 * @property {Number} maxWidth
 * @property {Number} height
 * @property {Number} maxHeight
 * @property {"contain" | "cover" | "fill" | "inside" | "outside"} fit
 */
class OptimagiumOptions {
  constructor(options) {
    this.raw = false;
    this.accept = false;
    this.acceptHeader = "";
    this.minify = false;
    this.resize = false;
    this.format = "";
    this.width = 0;
    this.height = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.fit = "inside";

    if (isString(options)) {
      this._parsePathOptions((options || "").trim());
    }

    if (isPlainObject(options)) {
      this._parseObjectOptions(options);
    }
  }

  setAcceptHeader(acceptHeader) {
    if (isString(acceptHeader)) {
      this.acceptHeader = acceptHeader;
    }
  }

  _parseObjectOptions(options) {
    for (const key in options) {
      if (Object.hasOwn(this, key)) {
        this[key] = options[key];
      }
    }
  }

  _parsePathOptions(str = "") {
    for (const option of str.split(/\s*,\s*/)) {
      if (["-", "_", "original"].includes(option)) {
        this.raw = true;
        break;
      }
      if (option === "minify") {
        this.minify = true;
      }
      if (option === "accept") {
        this.accept = true;
      }
      if (option.startsWith("accept:")) {
        this.accept = option.replace("accept:", "");
      }
      if (option.startsWith("f:")) {
        this.format = option.replace("f:", "");
      }
      if (option.startsWith("fit:")) {
        const fit = option.replace("fit:", "");
        if (["contain", "cover", "fill", "inside", "outside"].includes(fit)) {
          this.fit = fit;
        }
      }
      if (RESIZE_REGEX.test(option)) {
        const matches = RESIZE_REGEX.exec(option);
        if (matches) {
          this.resize = true;
          this.width = +matches.groups.w;
          this.height = +matches.groups.h;
        }
      }
      if (option.startsWith("w:")) {
        this.resize = true;
        this.width = +option.replace("w:", "");
      }
      if (option.startsWith("h:")) {
        this.resize = true;
        this.height = +option.replace("h:", "");
      }
      if (option.startsWith("max-w:")) {
        this.resize = true;
        this.maxWidth = +option.replace("max-w:", "");
      }
      if (option.startsWith("max-h:")) {
        this.resize = true;
        this.maxHeight = +option.replace("max-h:", "");
      }
    }
  }
}

export default OptimagiumOptions;
