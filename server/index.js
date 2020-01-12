const express = require("express");
const bodyParser = require("body-parser");
const uuidv1 = require("uuid/v1");

const app = express();
app.use(bodyParser.json());

const port = 5000;

const standard_lib_token =
  "tok_dev_eVoWNiq7rJ7u7H1vwYRa78ZytVfDWmrHhfS98NkWvmEag7qGgTbozEWUujtevB6T";
const lib = require("lib")({ token: standard_lib_token });
const query = lib.googlesheets.query["@0.3.0"];

const jobRange = "jobs!A1:I999";
const userRange = "users!A1:B100";

app.post("/login", (req, res) => {
  const { user_id } = req.body;

  if (user_id === "DELETED") {
    res.sendStatus(400);
    return;
  }

  // Check if user exists
  const getUser = async () => {
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
  };
  getUser();
});

app.get("/all-jobs", (req, res) => {
  const getJobs = async () => {
    let result = await query.select({
      range: jobRange
    });
    res.send(result.rows);
  };
  getJobs();
});

app.get("/jobs", (req, res) => {
  const { user_id } = req.query;

  // TODO: only send if it matches the user_id
  const getJobs = async () => {
    let result = await query.select({
      range: jobRange,
      where: [
        {
          user_id: user_id
        }
      ]
    });
    res.send(result.rows);
  };
  getJobs();
});

app.post("/jobs", (req, res) => {
  const { user_id, url, selector, condition, value } = req.body;
  const id = uuidv1();
  const addJob = async () => {
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
  };
  addJob();
});

app.post("/jobs", (req, res) => {
  const { user_id, url, selector, condition, value } = req.body;
  const id = 100;

  const addJob = async () => {
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
  };
  addJob();
});

app.put("/jobs", (req, res) => {
  const { id, initial_value, error } = req.body;

  const updateJob = async () => {
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
  };
  updateJob();
});

app.delete("/jobs", (req, res) => {
  const { user_id, id } = req.body;

  const deleteJob = async () => {
    await query.update({
      range: jobRange, // (required)
      where: [
        {
          id: id
        }
      ],
      fields: {
        id: "DELETED",
        user_id: "DELETED"
      }
    });
    res.sendStatus(200);
  };
  deleteJob();
});

app.post("/send-sms", (req, res) => {
  const { user_id, id } = req.body;

  console.log("Sent");
  res.send("Sent");
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
