import path from "path";

export const env = {
  host: {
    path: path.resolve(),
  },
  entryPoint: <"schedule" | "wpp">"wpp",
  schedule: {
    cron: "* * * * *", // Every 1 minute
    runOnInit: true, // Run as soon as it is scheduled
  },
  api: {
    ninjaQuotes: {
      url: "https://api.api-ninjas.com/v1/quotes",
      apiKey: "Fp3J+JJcn3AUnapRuC0nQg==jH0IJYvIVHCXkW94",
    },
    paperQuotes: {
      url: "https://api.paperquotes.com/apiv1/quotes",
      apiKey: "afe068faf3e2c909c221b13ea59ca110561a535a",
    },
    quotable: {
      url: "https://api.quotable.io",
    },
    theySaidSo: {
      url: "http://quotes.rest",
      apiKey: "70QqqiQfEMmJY53IRdh4nUwr0RTaJzh9ZbuQYuDZ",
    },
  },
  wpp: {
    // chatId: "5218311027292@c.us", // My Love
    // chatId: "5218311209294-1484455036@g.us", // Pikachus
    chatId: "5218311146563@c.us", // Me POCO F2 PRO
  },
} as const;
