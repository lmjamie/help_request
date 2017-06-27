const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const controllerRequest = require('./controllers/request.js');
const controllerServe = require('./controllers/serve.js');

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/requests", controllerRequest.handleCurrentRequests);
app.put("/request", controllerRequest.handleAddRequest);
app.post("/request", controllerRequest.handleEditRequest);
app.delete("/request/:id", controllerRequest.handleRemoveRequest);

app.get("/serving", controllerServe.handleServingRequest);
app.put("/serve", controllerServe.handleServeRequest);
app.delete("/serve/:id", controllerServe.handleCompleteServe);


app.listen(app.get("port"), function() {
  console.log("Server now listening on port", app.get("port"));
});
