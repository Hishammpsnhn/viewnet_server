const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();
const authenticate = require("./authenticateMiddleware");
const metricsService = require("./monitor/metricsService.js")
const morgan = require('morgan')

const app = express();
app.use(morgan('combined')); 
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

metricsService.setup(app);
const services = {
  user: process.env.USER_SERVICE_URL,
  subscription: process.env.SUBSCRIPTION_SERVICE_URL,
  uploading: process.env.UPLOADING_SERVICE_URL,
  content: process.env.CONTENT_SERVICE_URL,
  liveStreaming: process.env.LIVE_STREAMING_SERVICE_URL,
  notification: process.env.NOTIFICATION_SERVICE_URL
};

// Public routes (no auth required)
const publicRoutes = [
  {
    context: "/api/user/public",
    target: services.user,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
  },
  {
    context: "/api/subscription/public",
    target: services.subscription,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
  },
  {
    context: "/api/content/public",
    target: services.content,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
  },
  {
    context: "/api/live/public",
    target: services.liveStreaming,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
  },
 
];

// Protected routes (authentication required)
const protectedRoutes = [
  {
    context: "/api/user/admin",
    target: services.user,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    auth: true,
    isAdmin: true,
  },
  {
    context: "/api/user",
    target: services.user,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    auth: true,
  },
  {
    context: "/api/subscription/admin",
    target: services.subscription,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    auth: true,
    isAdmin: true,
  },
  {
    context: "/api/live/user",
    target: services.liveStreaming,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    auth: true,
  },
  {
    context: "/api/live",
    target: services.liveStreaming,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    auth: true,
    isAdmin: true,
  },
  {
    context: "/api/notification",
    target: services.notification,
    changeOrigin: true,
    cookieDomainRewrite: "localhost",
    auth: true,
  },
  {
    context: "/api/subscription",
    target: services.subscription,
    changeOrigin: true,
    auth: true,
    cookieDomainRewrite: "localhost",
  },
  {
    context: "/api/uploading",
    target: services.uploading,
    changeOrigin: true,
    auth: true,
    isAdmin: true,
    cookieDomainRewrite: "localhost",
  },

];

// public
publicRoutes.forEach((route) => {
  app.use(
    route.context,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: route.changeOrigin,
      pathRewrite: (path, req) => path.replace(route.context, ""),
    })
  );
});

//protect
protectedRoutes.forEach((route) => {
  app.use(
    route.context,
    authenticate, 
    (req, res, next) => {
      if (route.auth) {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        if (route.isAdmin && !req.user.isAdmin) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      next();
    },
    createProxyMiddleware({
      target: route.target,
      changeOrigin: route.changeOrigin,
      pathRewrite: (path, req) => path.replace(route.context, ""),
    })
  );
});

app.get("/test", (req, res) => {
  res.send("API Gateway is running");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
