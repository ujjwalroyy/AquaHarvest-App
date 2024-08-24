
export const successGoogleLogin = (req, res) => {
  if (!req.user) res.redirect("/failure");
  console.log("user data", req.user);
  const fullName = `${req.user.name.givenName} ${req.user.name.familyName}`;
  res.send(`Welcome ${fullName}`);
};
export const failureGoogleLogin = (req, res) => {
  res.send("Error");
};
