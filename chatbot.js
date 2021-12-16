const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuid } = require("uuid");

require("dotenv").config();

const projectId = process.env.PROJECT_ID;
const configuration = {
  credentials: {
    private_key: Buffer.from(process.env.PRIVATE_KEY, "base64").toString(
      "ascii"
    ),
    client_email: process.env.CLIENT_EMAIL,
  },
};

const sessionClient = new dialogflow.SessionsClient(configuration);

const sessionPath = sessionClient.projectAgentSessionPath(projectId, uuid());

async function talkToChatbot(message) {
  const languageCode = "en-US";

  const botRequest = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode,
      },
    },
  };

  const response = await sessionClient
    .detectIntent(botRequest)
    .then((responses) => {
      const requiredResponse =
        responses[0].queryResult.fulfillmentMessages[0].payload.fields;
      console.log(responses[0].queryResult.fulfillmentMessages[0].payload);
      return requiredResponse;
    })
    .catch((error) => {
      console.log("ERROR: " + error);
    });

  return response;
}

module.exports = { talkToChatbot };
