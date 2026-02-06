const City = require('../models/City');

async function ensureCityExists() {
  const city = await City.findOne();
  if (!city) {
    await City.create({});
    console.log("City created");
  }
}

module.exports = ensureCityExists;