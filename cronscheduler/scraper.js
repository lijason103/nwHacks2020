var webscraper = require("web-scraper-js");

async function scraper(url, selector) {
  let result = await webscraper.scrape({
    url: url,
    tags: {
      text: {
        element: selector
      }
    }
  });

  return result;
}

module.exports = {
  scraper: scraper
};
