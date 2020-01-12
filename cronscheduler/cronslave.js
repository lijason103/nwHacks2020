const cron = require("node-cron");
const webScraper = require("./scraper.js");
const smsMessage = require("./sms.js");
const googleSheets = require("./googleSheets");

(() => {
  const googleSheetData = googleSheets
    .getData()
    .then(res => res.json())
    .then(body => {
      body.rows.forEach(async job => {
        const fields = job.fields;
        // console.log(fields);
        const result = await webScraper.scraper(fields.url, fields.selector);
        console.log(result);
      });
    });
})();

// cron.schedule("* * * * *", async () => {
//   console.log("running a task every minute");
//   const googleSheetData = googleSheets.getData();
//   const rows = googleSheetData.rows;

//   console.log(rows);
//   const result = await webScraper.scraper();
//   console.log(result);
//   if (result != null) {
//     console.log("sending message");
//     smsMessage.sendSMSMessage().then(message => console.log(message));
//   }
// });
