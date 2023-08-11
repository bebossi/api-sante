import * as auth0 from "auth0";

const auth0Client = new auth0.AuthenticationClient({
  domain: "Auth0 Management API",
  clientId: "64d5e9bd88bf3cc911a4bde7",
  clientSecret: process.env.TOKEN_SIGN_SECRET,
});
export default auth0Client;
