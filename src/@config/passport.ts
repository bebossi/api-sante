const GoogleStrategy = require("passport-google-oauth20").Strategy;
import passport from "passport";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      callback: (error: any, user?: any) => void
    ) {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});
