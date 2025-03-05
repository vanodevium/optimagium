import OptimagiumOptions from "../optimagium-options.js";

const parseOptions = (ctx) => {
  const options = new OptimagiumOptions(ctx.req.param("options"));
  options.setAcceptHeader(ctx.req.header("accept"));
  return options;
};

export default parseOptions;
