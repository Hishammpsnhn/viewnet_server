// services/metricsService.js
const client = require("prom-client");
const responseTime = require("response-time");

const metricsService = {
  setup: (app) => {
    const collectDefaultMetrics = client.collectDefaultMetrics;
    collectDefaultMetrics({ register: client.register });

    const reqResTime = new client.Histogram({
      name: "http_express_req_res_time",
      help: "Time taken to handle incoming requests",
      labelNames: ["method", "route", "status_code"],
      buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
    });

    const totalReqCount = new client.Counter({
      name: "total_req",
      help: "Total requests made",
    });

    app.use(
      responseTime((req, res, time) => {
        totalReqCount.inc();
        reqResTime
          .labels(req.method, req.url, res.statusCode.toString())
          .observe(time);
      })
    );

    app.get("/metrics", async (req, res) => {
      res.setHeader("Content-Type", client.register.contentType);
      const metrics = await client.register.metrics();
      res.send(metrics);
    });
  },
};

module.exports = metricsService;