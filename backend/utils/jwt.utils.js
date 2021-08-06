const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SIGN_SECRET = process.env.TOKEN;

module.exports = {
    generateTokenForUser: userData => {
      // creates a token with the jwt method sign
        return jwt.sign({
            userId: userData.id,
        },
        JWT_SIGN_SECRET,
        // make the token expires after 8h
        { expiresIn: '8h' })
    },
    getUserId: function (data) {
        if (data.length > 1) {
          const token = data.split(' ')[1];
          try {
            const decodedToken = jwt.verify(token, JWT_SIGN_SECRET)
            const userId = decodedToken.userId
            return userId
          }
          catch (err) {
            return err
          }
        };
    }
}