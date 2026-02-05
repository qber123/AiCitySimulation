const processCity = require('./services/processCity');

const HOUR = 60 * 1000;

function startTick() {
  console.log("City tick started");

  setInterval(async () => {
    try {
      await processCity();
      console.log("Tick processed");
    } catch (e) {
      console.error("Tick error", e);
    }
  }, HOUR);
}

module.exports = startTick;