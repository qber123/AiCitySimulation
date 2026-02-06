const processCity = require('./services/processCity');

const TIME_GAP = 24 * 60 * 60 * 1000;

function startTick() {
  console.log("City tick started");

  setInterval(async () => {
    try {
      await processCity();
      console.log("Tick processed");
    } catch (e) {
      console.error("Tick error", e);
    }
  }, TIME_GAP);
}

module.exports = startTick;