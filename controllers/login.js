const loginRouter = require("express").Router();
const { request } = require("undici");

const REDIRECT_URI =
  process.env.REDIRECT_URI || `http://localhost:${process.env.PORT}/api/login`;

loginRouter.get("/", async (req, res) => {
  const { code, state } = req.query;

  if (code && state) {
    try {
      const tokenResponse = await request(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: REDIRECT_URI,
            scope: "identify",
          }).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const tokenData = await tokenResponse.body.json();

      if (tokenResponse.statusCode === 200) {
        res.redirect(
          `/?accessToken=${encodeURIComponent(tokenData.access_token)}&tokenType=${encodeURIComponent(tokenData.token_type)}&state=${encodeURIComponent(state)}`,
        );
      } else {
        res.status(500).json({ error: "Failed to fetch user data." });
      }
    } catch (error) {
      console.error("Error during token exchange:", error);
      res.status(500).json({ error: "Server error during token exchange" });
    }
  } else {
    res.status(400).json({ error: "Code or state query parameter is missing" });
  }
});

module.exports = loginRouter;
