import path from "path";

export const env = {
  host: {
    path: path.resolve(),
  },
  schedule: {
    cron: "* * * * *", // Every 1 minute
    runOnInit: true, // Run as soon as it is scheduled
  },
  api: {
    // https://api-ninjas.com/api/quotes
    ninjaQuotes: {
      url: "https://api.api-ninjas.com/v1/quotes",
      apiKey: "Fp3J+JJcn3AUnapRuC0nQg==jH0IJYvIVHCXkW94",
    },

    // https://paperquotes.com/api-docs/
    paperQuotes: {
      url: "https://api.paperquotes.com/apiv1/quotes",
      apiKey: "afe068faf3e2c909c221b13ea59ca110561a535a",
    },

    // https://github.com/lukePeavey/quotable
    quotable: {},

    // https://theysaidso.com/api
    theySaidSo: {},

    // https://zenquotes.io/
    zenQuotes: {},
  },
  wpp: {
    // chatId: "5218311027292@c.us", // My Love
    chatId: "5218311209294-1484455036@g.us", // Pikachus
  },
} as const;
