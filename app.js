const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*', // Allow all origins (you can specify specific origins like ['http://localhost:3000', 'http://192.168.1.15:3000'])
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
const swaggerFilePath = path.join(__dirname, 'swagger-output.json');
if (fs.existsSync(swaggerFilePath)) {
  const swaggerFile = require('./swagger-output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
} else {
  console.warn('⚠ Swagger documentation not found. Run "npm run swagger-autogen" to generate it.');
}

// Routes
/**
 * @route GET /
 * @desc Home route
 * @access Public
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// User Information Routes
const userInformationRoutes = require('./route/userInformationRoutes');
app.use('/api/users', userInformationRoutes);

// Assignment Routes
const assignmentRoutes = require('./route/assignmentRoutes');
app.use('/api/assignments', assignmentRoutes);

// Quiz Routes
const quizeRoutes = require('./route/quizeRoutes');
app.use('/api/quizes', quizeRoutes);

app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>

<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>

<script>
window.onload = function () {
  SwaggerUIBundle({
    url: "/swagger.json",
    dom_id: "#swagger-ui",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    layout: "StandaloneLayout"
  });
};
</script>
</body>
</html>
`);
});

module.exports = app;