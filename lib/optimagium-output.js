import { isReadableStream } from "is-stream";
import createError from "./create-error.js";
import { isBuffer } from "@sindresorhus/is";
import { Readable } from "node:stream";
import mimes from "mime-db";

/**
 * @property {Readable} stream
 * @property {String} mime
 */
class OptimagiumOutput {
  constructor(stream, mime) {
    this.stream = null;
    this.mime = null;

    if (stream) {
      this.setStream(stream);
    }

    if (mime) {
      this.setMime(mime);
    }
  }

  setStream(stream) {
    if (!isReadableStream(stream)) {
      throw createError("this method supports ReadableStream only");
    }
    this.stream = stream;
  }

  setBuffer(buffer) {
    if (!isBuffer(buffer)) {
      throw createError("this method supports Buffer only");
    }
    this.stream = Readable.from(buffer);
  }

  setMime(mime) {
    if (!mime) {
      return;
    }

    if (!Object.hasOwn(mimes, mime)) {
      throw createError("this method supports real MIME types only");
    }

    this.mime = mime;
  }
}

export default OptimagiumOutput;
