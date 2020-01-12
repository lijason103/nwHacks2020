const express = require("express");
const bodyParser = require("body-parser");
const uuidv1 = require("uuid/v1");
var twilio = require("twilio");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const port = 5000;

const standard_lib_token =
  "tok_dev_eVoWNiq7rJ7u7H1vwYRa78ZytVfDWmrHhfS98NkWvmEag7qGgTbozEWUujtevB6T";
const lib = require("lib")({ token: standard_lib_token });
const query = lib.googlesheets.query["@0.3.0"];
const channels = lib.slack.channels["@0.6.4"];

const jobRange = "jobs!A1:I999";
const userRange = "users!A1:B100";

var twilio_client = new twilio(
  "ACb7c21becf895b1877a8c81ddb4bc4950",
  "6e2288d52601fae1df560237029b12b8"
);

app.post("/login", async (req, res) => {
  const { user_id } = req.body;

  if (user_id === "DELETED") {
    res.sendStatus(400);
    return;
  }

  const result = await query.count({
    range: userRange,
    where: [
      {
        user_id: user_id
      }
    ]
  });
  if (result.count === 1) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.get("/all-jobs", async (req, res) => {
  let result = await query.select({
    range: jobRange
  });
  res.send(result.rows);
});

app.get("/jobs", async (req, res) => {
  const { user_id } = req.query;

  // TODO: only send if it matches the user_id
  let result = await query.select({
    range: jobRange,
    where: [
      {
        user_id: user_id
      }
    ]
  });
  res.send(result.rows);
});

app.post("/jobs", async (req, res) => {
  const { user_id, url, selector, condition, value } = req.body;
  const id = uuidv1();
  await query.insert({
    range: jobRange,
    fieldsets: [
      {
        id: id,
        user_id: user_id,
        url: url,
        selector: selector,
        condition: condition,
        value: value
      }
    ]
  });
  res.sendStatus(200)
});

app.post("/jobs", async (req, res) => {
  const { user_id, url, selector, condition, value } = req.body;
  const id = 100;

  await query.insert({
    range: jobRange,
    fieldsets: [
      {
        id: id,
        user_id: user_id,
        url: url,
        selector: selector,
        condition: condition,
        value: value
      }
    ]
  });
  res.sendStatus(200);
});

app.put("/jobs", async (req, res) => {
  const { id, initial_value, error } = req.body;

  await query.update({
    range: jobRange, // (required)
    where: [
      {
        id: id
      }
    ],
    fields: {
      initial_value: initial_value,
      error: error
    }
  });
  res.sendStatus(200);
});

app.delete("/jobs", async (req, res) => {
  const { user_id, id } = req.body;

  await query.update({
    range: jobRange, // (required)
    where: [
      {
        id: id
      }
    ],
    fields: {
      id: "DELETED"
    }
  });
  res.sendStatus(200);
});

app.post("/send-sms", async (req, res) => {
  const { user_id, id } = req.body;

  const result = await query.select({
    range: jobRange,
    where: [
      {
        id
      }
    ]
  });
  const row = result.rows[0];
  const fields = row["fields"];
  const url = fields["url"];
  const userResult = await query.select({
    range: userRange,
    where: [
      {
        user_id
      }
    ]
  });
  const phoneNum = userResult.rows[0]["fields"]["phone_number"].substr(1);

  let message = `The targetted value on ${url} is now `;
  if (fields["condition"] === '"="') {
    message += `equals to ${fields["value"]}.`;
  } else if (fields["condition"] === '">"') {
    message += `greater than ${fields["value"]}.`;
  } else if (fields["condition"] === '"<"') {
    message += `smaller than ${fields["value"]}.`;
  } else {
    message = `The targetted value on ${url} has been updated.`;
  }
  const appName = `WatchDoge: [${user_id}]`;
  const finalMessage = `${appName} - ${message}`;

  await channels.messages.create({
    channel: "#team-watchdoge",
    text: finalMessage
  });

  if (phoneNum.length > 0) {
    await twilio_client.messages.create({
      to: phoneNum,
      from: "+17786554098",
      body: finalMessage
    });
  } else {
    console.log("Phone number is not there")
  }

  res.send("Sent");
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
