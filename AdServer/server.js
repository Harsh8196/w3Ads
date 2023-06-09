"use strict";

const { AuthToken } = require("./utils/authToken");
const { getPaymentStatus } = require("./utils/updateStatus");
require("dotenv").config();

const fastifyServer = require("./app")({});

// MAKE IT LISTEN
const start = async () => {
  try {
    const address = await fastifyServer.listen(
      process.env.PORT || 8080,

      process.env.HOST || "0.0.0.0"
    );
    AuthToken()
    getPaymentStatus()
    console.log(`Test Adserver API is listening at ${address}`);
  } catch (err) {
    fastifyServer.log.error(err);
    process.exit(1);
  }
};
start();
