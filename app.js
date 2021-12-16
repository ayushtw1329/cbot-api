const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { talkToChatbot } = require("./chatbot");

const Gtts = require("gtts");

var jsonParser = bodyParser.json();
var urlEncoded = bodyParser.urlencoded({ extended: true });

// const VALID_ORIGINS = [/cbot-app\.com$/, /herokuapp\.com$/, /cbot1-api\.com$/];
// const corsOptions = {
//   origin: VALID_ORIGINS,
//   credentials: true,
// };

app.use(cors());
app.use(morgan("dev"));

app.post("/chatbot", jsonParser, urlEncoded, function (req, res, next) {
  const message = req.body.message;
  talkToChatbot(message)
    .then((response) => {
      res.send({ message: response });
    })
    .catch((error) => {
      console.log("Something went wrong: " + error);
      res.send({
        error: "Error occured here",
      });
    });
});

app.get("/hear", function (req, res) {
  const gtts = new Gtts(req.query.text, req.query.lang, req.query.tld);
  gtts.stream().pipe(res);
});

app.get("/offer/:day", function (req, res) {
  const day = req.params.day;
  res.sendFile(__dirname + `/images/${day}_thumbnail.png`);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
