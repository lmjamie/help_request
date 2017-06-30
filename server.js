const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const controllerRequest = require('./controllers/request.js');
const controllerServe = require('./controllers/serve.js');
const controllerPage = require('./controllers/page.js');

app.set("port", (process.env.PORT || 5000));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.cookieParser("CAMSGLORY"));
app.use(express.cookieSession());
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(express.static(__dirname + "/public"));

// User viewing page
app.get("/", controllerPage.renderQueue);

// Request Routes
app.get("/requests", controllerRequest.handleCurrentRequests);
app.put("/request", controllerRequest.handleAddRequest);
app.post("/request", controllerRequest.handleEditRequest);
app.delete("/request/:id", controllerRequest.handleRemoveRequest);

// Serving Routes
app.get("/serving", controllerServe.handleServingRequest);
app.put("/serve", controllerServe.handleServeRequest);
app.delete("/serve/:id", controllerServe.handleCompleteServe);

// Listen up
app.listen(app.get("port"), function() {
  console.log("Server now listening on port", app.get("port"));
});
