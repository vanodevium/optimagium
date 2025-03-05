import { Readable } from "node:stream";
import { stream } from "hono/streaming";
import logger from "../logger.js";

const returnStream = async (ctx, content) => {
  return stream(ctx, async (stream) => {
    stream.onAbort(() => {
      logger.debug("stream is aborted");
    });

    await stream.pipe(Readable.toWeb(content));
  });
};

export default returnStream;
