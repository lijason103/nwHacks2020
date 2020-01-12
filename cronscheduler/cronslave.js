var cron = require("node-cron");
var webScraper = require("./scraper.js");
var smsMessage = require("./sms.js");
cron.schedule("* * * * *", async () => {
  console.log("running a task every minute");
  const result = await webScraper.scraper();
  console.log(result);
  if (result != null) {
    console.log("sending message");
    smsMessage.sendSMSMessage().then(message => console.log(message));
  }
});
