// Modules
const express = require('express');
const app = express();
const http = require('http').Server(app); // Required for sockect.io apparently
const io = require("socket.io")(http);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const favicon = require('serve-favicon');

// Controllers
const controllerRequest = require('./controllers/request.js');
const controllerServe = require('./controllers/serve.js');
const controllerHelper = require('./controllers/helper.js');
const controllerPage = require('./controllers/page.js');
const controllerSocket = require('./controllers/socket.js');

// Constant
const secret = "CAMSGLORY";

app.set("port", (process.env.PORT || 5000));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(secret));
app.use(cookieSession({
  name: "Session",
  keys: [secret]
}));
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(express.static(__dirname + "/public"));

// User viewing page
app.get("/", controllerPage.renderQueue);

// Request Routes
app.get("/requests", controllerRequest.handleCurrentRequests);
app.put("/request", controllerRequest.handleAddRequest);
app.post("/request", controllerRequest.handleEditRequest);
app.delete("/request/session", controllerRequest.handleCleanUp);
app.delete("/request/:id", controllerRequest.handleRemoveRequest);

// Serving Routes
app.get("/serving", controllerServe.handleServingRequest);
app.put("/serve", controllerServe.handleServeRequest);
app.delete("/serve/:id", controllerServe.handleCompleteServe);

// Helper Routes
app.post("/login", controllerHelper.handleLogin);
app.post("/logout", controllerHelper.handleLogout);

// Socket.io Events
io.on("connection", controllerSocket.handleConnection);

// Listen up, listening with http server for socket.io
http.listen(app.get("port"), function() {
  console.log("Server now listening on port", app.get("port"));
});
