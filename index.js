// Imports
// =======
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");
const result = require("dotenv").config({ path: ".env" });
const { sanitizeRequest } = require("./middleware/sanitizeRequest");

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
  "https://salsa-candela.com",
  "https://www.salsa-candela.com",
  "https://admin.salsa-candela.com",
  "https://www.admin.salsa-candela.com",
  "https://bar.salsa-candela.com",
  "https://www.bar.salsa-candela.com",
  // IP Banxico Beta
  "http://170.70.226.117",
  "http://170.70.226.118",
  "http://170.70.226.119",
  "http://170.70.226.120",
  // IP Banxico Prod
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
  allowedHeaders: ["Content-Type", "Authorization"],
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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes:
// =======
const homeRoutes = require("./routes/home");
app.use("/", homeRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Server Port
// ===========
const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
