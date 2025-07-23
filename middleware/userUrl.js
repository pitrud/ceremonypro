const User  = require('../models/User');

async function verifyUserUrl(req, res, next) {
  const randomUrl = req.url.startsWith('/') ? req.url.slice(1) : req.url;

  const user = await User.findOne({ randomUrl });

  if( !user ) {
    return res.status(404).json({ error: 'User with '+randomUrl+' url was not found.' });
  }
  req.user = user;
  next();
}

module.exports = verifyUserUrl;
