import { serve } from "@hono/node-server";
import { Hono } from "hono";
import createHandler from "./create-handler.js";
import logger from "../logger.js";

const createService = (optimagium, options) => {
  const optimagiumHTTP = new Hono({
    strict: false,
  });

  optimagiumHTTP.get("/:options/:path{.*}", createHandler(optimagium));

  const server = serve(
    {
      hostname: options.host || "0.0.0.0",
      port: options.port || 3000,
      fetch: optimagiumHTTP.fetch,
    },
    (info) => {
      logger.start(`Optimagium is listening on ${info.address}:${info.port}`);
    },
  );

  const signalHandler = async () => {
    await Promise.all([server.close()])
      .then(() => logger.info("Optimagium is stopped"))
      .then(() => process.exit());
  };

  process.once("SIGINT", signalHandler);
  process.once("SIGTERM", signalHandler);
};

export default createService;
