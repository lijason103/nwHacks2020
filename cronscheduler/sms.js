var twilio = require("twilio");
var client = new twilio(
  "ACb7c21becf895b1877a8c81ddb4bc4950",
  "6e2288d52601fae1df560237029b12b8"
);

// Send the text message.
function sendSMSMessage() {
  return client.messages.create({
    to: "+16043410008",
    from: "+17786554098",
    body: "Test cron message!"
  });
}

module.exports = {
  sendSMSMessage: sendSMSMessage
};
