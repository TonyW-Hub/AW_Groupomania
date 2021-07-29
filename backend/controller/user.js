// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const asyncLib = require('async');

const jwtUtils = require('../utils/jwt.utils');
const validInput = require('../utils/valid-input');
const models = require('../models');

// Inscription d'un user
exports.signup = (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;

    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'messing parameters' })
    }

    const emailValid = validInput.validEmail(email);
    const passwordValid = validInput.validPassword(password);
    const usernameValid = validInput.validUsername(username);
    if (emailValid == true && passwordValid == true && usernameValid == true) {
      models.User.findOne({
        attributes: ['email'],
        where: { email: email }
      })
      .then(userFound => {
        if (!userFound) {
          bcrypt.hash(password, 10, function(err, bcryptedPassword) {
            const newUser = models.User.create({
              email: cryptoJs.HmacSHA256(req.body.email, process.env.EMAIL).toString(),
              username: username,
              password: bcryptedPassword,
              bio: bio,
              isAdmin: false
            })
            .then(newUser => {
              return res.status(201).json({
                'userId': newUser.id
              })
            })
            .catch(err => {
              return res.status(500).json({ 'error': 'cannot add user' });
            });
          });
        } else {
          return res.status(409).json({ 'error': 'this user already exists' });
        }
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    } else {
      console.log('invalid inputs');
    }
};

// Connexion d'un user
exports.login = (req, res) => {
  const findcryptedEmail = cryptoJs.HmacSHA256(req.body.email, process.env.EMAIL).toString();
  const username = req.body.username;
  const password = req.body.password;

  if (findcryptedEmail == null || password == null) {
    return res.status(400).json({ 'error': 'missing parameters'});
  }

  models.User.findOne({
    where: { username: username }
  })
  .then(user => {
    if (user) {
      bcrypt.compare(password, user.password, function(errBycrypt, resBycrypt) {
        if(resBycrypt) {
          return res.status(200).json({
            userId: user.id,
            token: jwtUtils.generateTokenForUser(user)
          })
        }
      })
    } else {
      return res.status(403).json({ 'error': 'user not exist in DataBase' });
    }
  })
  .catch(err => {
    return res.status(500).json({ 'error': 'unable to verify user' });
  })
};

//Profil d'un user
exports.userProfile = (req, res) => {
  const userId = jwtUtils.getUserId(req.headers.authorization)
  models.User.findOne({
      attributes: ['id', 'email', 'username', 'bio'],
      where: { id: userId }
  })
      .then(user => res.status(200).json(user))
      .catch(error => res.status(500).json(error))
};

//modification d'un profil
exports.updateUserProfile = (req, res) => {
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUserId(headerAuth);

  // Params
  var bio = req.body.bio;

  asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        attributes: ['id', 'bio'],
        where: { id: userId }
      }).then(function (userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
    function(userFound, done) {
      if(userFound) {
        userFound.update({
          bio: (bio ? bio : userFound.bio)
        }).then(function() {
          done(userFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update user' });
        });
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function(userFound) {
    if (userFound) {
      return res.status(201).json(userFound);
    } else {
      return res.status(500).json({ 'error': 'cannot update user profile' });
    }
  });
}

//Suppression d'un compte
exports.deleteProfile = (req, res) => {
  const userId = jwtUtils.getUserId(req.headers.authorization);
  if (userId != null) {
      models.User.findOne({
          where: { id: userId }
      })
          .then(user => {
              if (user != null) {
                  models.Post
                      .destroy({
                          where: { userId: user.id }
                      })
                      .then(() => {
                          console.log('Tous les posts de cet user ont été supprimé');
                          models.User
                              .destroy({
                                  where: { id: user.id }
                              })
                              .then(() => res.end())
                              .catch(err => console.log(err))
                      })
                      .catch(err => res.status(500).json(err))
              }
              else {
                  res.status(401).json({ error: 'user not exist in DataBase' })
              }
          })
  } else {
      res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
  }
}