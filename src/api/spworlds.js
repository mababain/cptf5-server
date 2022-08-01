const { SPWorlds } = require('spworlds')
require('dotenv').config()

module.exports = new SPWorlds(
  process.env.SPWORLDS_CARD_ID,
  process.env.SPWORLDS_CARD_TOKEN
)
