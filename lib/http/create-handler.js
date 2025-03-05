import parseOptions from "./parse-options.js";
import returnStream from "./return-stream.js";

const createHandler = (optimagium) => async (ctx) => {
  const path = ctx.req.param("path");
  const options = parseOptions(ctx);

  const output = await optimagium.handlePath(path, options);
  if (!output) {
    return ctx.notFound();
  }

  if (output.mime) {
    ctx.res.headers.set("Content-Type", output.mime);
  }

  return returnStream(ctx, output.stream);
};

export default createHandler;
