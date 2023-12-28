const config = require("../config/auth.config.js");

authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

  const [username, password] = credentials.split(':');

  if (username === config.userName && password === config.password) {
    // Authentication successful
    next();
  } else {
    // Authentication failed
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const basicAuth = {
  authenticate
};

module.exports = basicAuth;
