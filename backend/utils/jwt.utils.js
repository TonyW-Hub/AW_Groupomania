const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = process.env.TOKEN;

module.exports = {
    generateTokenForUser: userData => {
        return jwt.sign({
            userId: userData.id,
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '24h'
        })
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