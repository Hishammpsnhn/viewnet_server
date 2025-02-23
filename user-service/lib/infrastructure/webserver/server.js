const createServer = async (metricsService) => {
  const app = express();
  
  // Add request logging middleware at the top
  app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming request: ${req.method} ${req.path}`);
    next();
  });
  
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://viewnet.cfd"],
      methods: "GET,POST,PUT,DELETE,OPTIONS",
      credentials: true,
    })
  );
  
  app.use(morgan("combined"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Mount routes at root level for testing
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  app.use("/api/user", authRoutes);
  
  // Add catch-all route for debugging
  app.use('*', (req, res) => {
    console.log(`[DEBUG] No route matched: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method 
    });
  });
  
  return app;
};