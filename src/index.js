const cookieParser = require('cookie-parser')
const cors = require('cors')
const spworldsApi = require('./api/spworlds')
const discordApi = require('./api/discord')
const getRentPrice = require('./utils/getRentPrice')

const express = require('express')
const app = express()
const PORT = 8080

const dbUsers = {
  WaLcOujgUmrQd6x673SRFaj7NFXA9o: { nickname: 'makegirlsmile', streak: 4 },
}

const dbTents = [
  {
    id: 0,
    status: 'free',
  },
  {
    id: 1,
    status: { nickname: 'makegirlsmile', expirationDate: '1658756444381' },
  },
  {
    id: 2,
    status: { nickname: 'neksid_', expirationDate: '1658756444381' },
  },
]

app.use(express.json())
app.use(cookieParser())

const whitelist = ['http://localhost:3000']
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true)

    callback(new Error('Not allowed by CORS'))
  },
}
app.use(cors(corsOptions))

app.get('/authUser', (req, res) => {
  let userToken = ''
  discordApi
    .getToken(req.query.discordCode)
    .then((tokenRes) => {
      const userData = JSON.parse(tokenRes)
      const { access_token, expieres_in, refresh_token } = userData

      userToken = access_token

      res
        .cookie('discordToken', access_token, {
          maxAge: expieres_in,
          httpOnly: true,
        })
        .cookie('discordRefreshToken', refresh_token, {
          httpOnly: true,
        })
      return userData
    })
    .then((userData) =>
      discordApi.getUserByToken({
        tokenType: userData.token_type,
        accessToken: userData.access_token,
      })
    )
    .then((discordIdRes) => {
      const data = JSON.parse(discordIdRes)

      if (data.message) {
        throw 'Discord Unauthorized'
      }

      return spworldsApi.findUser(data.id)
    })
    .then((nickname) => {
      dbUsers[userToken] = { ...dbUsers[userToken], nickname }
      return res.send(JSON.stringify({ nickname: nickname }))
    })
    .catch((err) => res.status(400).send(err))
  //
})

app.get('/tryAuth', (req, res) => {
  const { discordToken, discordRefreshToken } = req.cookies
  // if (db[discordToken]) {
  res.send(JSON.stringify(dbUsers[discordToken]))
  // }
})

app.get('/allTents', (req, res) => {
  const { limit = 30, startFrom = 0 } = req.query

  res.send(JSON.stringify(dbTents.slice(startFrom, limit)))
})

app.post('/paymentLink', (req, res) => {
  // TODO: А если время токена закнчиться прям в этом моменте
  const { tentId, rentType, countDays } = req.query
  const { discordToken } = req.cookies

  const user = dbUsers[discordToken]
  const { streak } = user

  spworldsApi
    .initPayment(
      getRentPrice(+countDays, streak ? streak : 0),
      'http://localhost:3000'
    )
    .then((paymentUrl) => res.send(JSON.stringify(paymentUrl)))
})

app.post('/private/tentPaymentWebhook', (req, res) => {})

app.listen(PORT, () => console.log(`its alive on http://localhost:${PORT}`))
