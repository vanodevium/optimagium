#!/usr/bin/env node

import "dotenv/config";

import { Command } from "commander";
import { readPackageSync } from "read-pkg";
import OptimagiumConfig from "../lib/optimagium-config.js";
import createHttpService from "../lib/http/create-service.js";
import Optimagium from "../lib/optimagium.js";

const program = new Command();

program.version(readPackageSync({}).version).usage("server [options]");

program
  .command("server")
  .option("-p, --port <port>", "HTTP port, default: 3000")
  .option("-h, --host <host>", "HTTP host, default: 0.0.0.0")
  .option("-i, --images <directory>", "path to images directory")
  .option("-a, --accept", "enables auto-format based on the Accept header")
  .action((opts) => {
    const config = new OptimagiumConfig();
    if (opts.images) {
      config.setImagesRoot(opts.images);
    }
    if (opts.autoFormat) {
      config.setAutoFormat(opts.autoFormat);
    }
    const optimagium = new Optimagium(opts);
    createHttpService(optimagium, opts);
  });

program.parse();
