import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { buffer } from "node:stream/consumers";
import { isFunction, isString } from "@sindresorhus/is";
import { fileTypeFromBuffer, fileTypeFromFile } from "file-type";
import { isFile } from "path-type";
import sharp from "sharp";
import OptimagiumConfig from "./optimagium-config.js";
import OptimagiumOutput from "./optimagium-output.js";
import minify from "./optimagium-minify.js";

class Optimagium {
  constructor(config = {}) {
    this.config = Object.assign({}, new OptimagiumConfig(), config);
  }

  /**
   * @returns {Promise<OptimagiumOutput|null>}
   */
  async handlePath(path, options) {
    const absolutePath = resolve(this.config.root, path);
    const available = await isFile(absolutePath);
    if (!available) {
      return null;
    }

    const output = new OptimagiumOutput(
      createReadStream(absolutePath),
      (await fileTypeFromFile(absolutePath))?.mime,
    );

    if (options.raw || !output.mime || !output.mime.startsWith("image/")) {
      return output;
    }

    let buf = await buffer(output.stream);

    const razor = sharp(buf);

    if (options.format && isFunction(razor[options.format])) {
      razor[options.format]();
    }

    if (options.format === "auto" || this.config.autoFormat) {
      const format = output.mime.replace("image/", "");
      if (isFunction(razor[format])) {
        razor[format]();
      }
    }

    if (options.accept || this.config.autoAccept) {
      const preferred = isString(options.accept) ? options.accept : "";
      for (const format of [preferred, "avif", "webp"].filter(Boolean)) {
        if (
          isFunction(razor[format]) &&
          options.acceptHeader.includes(`image/${format}`)
        ) {
          razor[format]();
          break;
        }
      }
    }

    if (options.resize) {
      razor.resize(
        options.width || options.maxWidth || null,
        options.height || options.maxHeight || null,
        {
          fit: options.fit || "inside",
          withoutEnlargement: true,
        },
      );
    }

    buf = await razor.toBuffer();

    if (options.minify) {
      buf = await minify(buf);
    }

    output.setBuffer(buf);
    output.setMime((await fileTypeFromBuffer(buf))?.mime);

    return output;
  }
}

export default Optimagium;
