const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  if (req.headers.authorization) {
    let decode = jwt.verify(req.headers.authorization, "anySecretKeyCanBeHere");
    if (decode) {
      next();
    } else {
      res.status(401).json({ error: "Authentication error - token is invalid" });
    }
  } else {
    res.status(401).json({ error:"Authentication error - header does not have a token" });
  }
}

module.exports = authenticate;