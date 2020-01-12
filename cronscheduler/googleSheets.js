const fetch = require("node-fetch");

const getData = () => {
  return fetch("http://localhost:3000/jobs");
};

module.exports = {
  getData: getData
};
