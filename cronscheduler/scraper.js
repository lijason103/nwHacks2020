var webscraper = require("web-scraper-js");

async function scraper() {
  let result = await webscraper.scrape({
    url: "https://www.imdb.com/title/tt0110912/",
    tags: {
      text: {
        "movie-rating-value": 'span[itemprop="ratingValue"]',
        "movie-character": ".character a"
      },
      attribute: {
        "movie-title": ["meta[property='og:title']", "content"],
        "movie-actor": [".primary_photo > a > img", "alt"]
      }
    }
  });

  return result;
}

module.exports = {
  scraper: scraper
};
