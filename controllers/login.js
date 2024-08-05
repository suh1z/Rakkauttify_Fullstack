const loginRouter = require("express").Router();
const { request } = require("undici");

const REDIRECT_URI = process.env.REDIRECT_URI || `http://localhost:${process.env.PORT}/api/login`;

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

      if (tokenResponse.statusCode === 200) {
        const tokenData = await tokenResponse.body.json();
        const userResponse = await request(
          "https://discord.com/api/v10/users/@me",
          {
            headers: {
              Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
            },
          },
        );

        if (userResponse.statusCode === 200) {
          console.log(userResponse);
          const userData = await userResponse.body.json();
          res.redirect(
            `/?username=${encodeURIComponent(userData.username)}&id=${userData.id}&token=${encodeURIComponent(tokenData.access_token)}`,
          );
        } else {
          const errorData = await userResponse.body.json();
          console.error("Error fetching user data:", errorData);
          res
            .status(userResponse.statusCode)
            .json({ error: "Failed to fetch user data" });
        }
      } else {
        const errorData = await tokenResponse.body.json();
        console.error("Error fetching token:", errorData);
        res
          .status(tokenResponse.statusCode)
          .json({ error: "Failed to exchange code for token" });
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
