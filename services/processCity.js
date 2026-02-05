const lawsChoosing = require("./lawsChoosing");

async function processCity() {
  lawsToContribute = await lawsChoosing();

  
}

module.exports = processCity;