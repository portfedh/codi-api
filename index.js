// Imports
// =======
const result = require("dotenv").config({ path: ".env" });
const { sanitizeRequest } = require("./middleware/sanitizeRequest");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

// Express
// =======
// Import express
const express = require("express");
// Import cors
const cors = require("cors");
// Import helmet
const helmet = require("helmet");
// Use express
const app = express();

// Ensure log directory exists
const logDirectory = path.join(__dirname, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

// Setup morgan logging
// Use 'combined' format for production and 'dev' for development
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat, { stream: accessLogStream })); // Log to file
app.use(morgan(morganFormat)); // Also log to console

// Trust first proxy
app.set("trust proxy", 1);
// Use helmet for security headers
app.use(helmet());
// Apply sanitization middleware before routes
app.use(sanitizeRequest);
// Enable reading JSON data:
app.use(express.json());
// Enable reading from html elements:
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  // Development domains
  "http://localhost:5173",
  "http://localhost:2121",
  // Salsa Candela domains
  "https://codi.salsa-candela.com",
  "https://salsa-candela.com",
  "https://www.salsa-candela.com",
  "https://admin.salsa-candela.com",
  "https://www.admin.salsa-candela.com",
  "https://bar.salsa-candela.com",
  "https://www.bar.salsa-candela.com",
  // IP Banco de Mexico Beta
  "http://170.70.226.117",
  "http://170.70.226.118",
  "http://170.70.226.119",
  "http://170.70.226.120",
  // IP Banco de Mexico Prod
  "http://170.70.227.117",
  "http://170.70.227.118",
  "http://170.70.227.119",
  "http://170.70.227.120",
  // Assigned Digital Ocean IP address
  "http://164.90.245.198",
  "http://164.90.245.198:80",
];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // Cache preflight requests for 24 hours
};
app.use(cors(corsOptions));

// Middleware to block access to hidden files or directories like .git
app.use((req, res, next) => {
  if (req.url.match(/\/\..+/)) {
    return res.status(403).send("Access denied");
  }
  next();
});

// Block specific suspicious patterns
app.use((req, res, next) => {
  const blockedPaths = ["/.git/", "/.env", "/node_modules"];

  if (blockedPaths.some((path) => req.url.includes(path))) {
    console.warn(`Blocked attempt to access: ${req.url}`);
    return res.status(404).send("Not found");
  }
  next();
});

// Rate Limiter
const rateLimit = require("express-rate-limit");

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased to 200 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(globalLimiter);

// Routes:
// =======
const homeRoutes = require("./routes/home");
app.use("/", homeRoutes);

// Server Port
// ===========
const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
