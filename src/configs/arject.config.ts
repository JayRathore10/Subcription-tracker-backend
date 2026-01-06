import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJECT_KEY } from "./env.config";

const aj = arcjet({
  key: ARCJECT_KEY as string,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
      ],
    }),

    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;
