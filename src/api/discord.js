const { BaseApi, HttpMethod } = require('./BaseApi')
require('dotenv').config()

class DiscordApi extends BaseApi {
  constructor(cliendId, clientSecret) {
    super('https://discord.com/api/v10/')

    this.clientId = cliendId
    this.clientSecret = clientSecret
  }

  getUserIdByCode(code) {
    return this.getToken(code).then((res) => {
      const userData = JSON.parse(res)

      return this.getUserByToken({
        tokenType: userData.token_type,
        accessToken: userData.access_token,
      })
    })
  }

  getToken(code) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `http://localhost:3000`,
      scope: 'identify',
    })

    return this.request(HttpMethod.POST, `oauth2/token`, {
      body: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((res) => res.text())
  }

  getUserByToken({ tokenType, accessToken }) {
    return this.request(HttpMethod.GET, 'users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    }).then((res) => res.text())
  }
}

module.exports = new DiscordApi(
  process.env.DISCORD_CLIENT_ID,
  process.env.DISCORD_CLIENT_SECRET
)
