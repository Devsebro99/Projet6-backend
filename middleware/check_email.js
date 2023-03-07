var validator = require("email-validator");
  
module.exports = (req, res, next) => {
  if (!validator.validate(req.body.email)) {
    res.status(400).json({ message: 'Email non valide.' })
  } else {
    next();
  }
};
