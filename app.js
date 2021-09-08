const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const urlencode = require("urlencode");
const requests = require("request");
const app = express();
const fs = require("fs");

app.use(cors());
// Express EJS Template
app.set("view engine", "ejs");
app.set("views", "./views");

// Static foler
app.use(express.static(__dirname + "/public"));

// Express body-Parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(cors());

app.post("/api/keyword", (request, respose) => {
  return respose.status(200).json({message: 'This feature is pending'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
