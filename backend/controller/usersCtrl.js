// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require("../models/index");
const User = db.user;
const asyncLib = require('async');

const jwtUtils = require('../utils/jwt.utils');
const validInput = require('../utils/valid-input');
const models = require('../models');

// Inscription d'un user
exports.signup = (req, res, next) => {

    // Params
    const email = req.body.email;
    const pseudo = req.body.pseudo;
    const password = req.body.password;
    const imageUrl = "https://pic.onlinewebfonts.com/svg/img_24787.png";

    // Checking params be null
    if (email == null || pseudo == null || password == null) {
        return res.status(400).json({ 'error': 'messing parameters' })
    }

    const emailValid = validInput.validEmail(email);
    const passwordValid = validInput.validPassword(password);
    const pseudoValid = validInput.validPseudo(pseudo);

    if (emailValid == true && passwordValid == true && pseudoValid == true) {

        // Using Waterfall to enchain functions
        asyncLib.waterfall([

        // Checks if User exists
        function(done) { // done = main parameter
            User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
        },

        // If not, Hash the password
        function(userFound, done) {
            if (!userFound) {
                bcrypt.hash(password, 10, function(err, bcryptedPassword) {
                    done(null, userFound, bcryptedPassword);
                });
            } else {
                return res.status(409).json({ error: 'user already exist' });
            }
        },

        // Create User in DB
        function(userFound, bcryptedPassword, done) {
            // Use the model to create a new User
            let newUser = User.create({
                    email: email,
                    pseudo: pseudo,
                    imageUrl: imageUrl,
                    password: bcryptedPassword,
                    isAdmin: 0
                })
                .then(function(newUser) {
                    done(newUser);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'cannot add user' });
                });
            }
        ],

        // After created, return new User id
        function(newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
    } else {
        return res.status(400).json({ 'error' : 'Invalid information.'})
    };
};

// Connexion d'un user
exports.login = (req, res) => {
  // Params
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
    }

    asyncLib.waterfall([

        // Checks if users exists
        function(done) {
            User.findOne({
                    where: { email: email }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
        },

        // If so, compare password hashes
        function(userFound, done) {
            if (userFound) {
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                    done(null, userFound, resBycrypt);
                });
            } else {
                return res.status(404).json({ 'error': 'user not exist in DB' });
            }
        },

        // If hashes matched, select user
        function(userFound, resBycrypt, done) {
            if (resBycrypt) {
                done(userFound);
            } else {
                return res.status(403).json({ 'error': 'invalid password' });
            }
        }

        // Return userId with a unique token
    ], function(userFound) {
        if (userFound) {
            return res.status(200).json({
                userId: userFound.id,
                token: jwt.sign({ userId: userFound.id },
                    // must be a long non specific and random characters
                    process.env.TOKEN,
                    // make the token expires after 8h
                    { expiresIn: '8h' }
                ),
                isAdmin: userFound.isAdmin
            });
        } else {
            return res.status(500).json({ 'error': 'cannot log on user' });
        }
    });
};

//Profil d'un user
exports.findOne = (req, res, next) => {
    const userId = jwtUtils.getUserId(req.headers.authorization)
  // Getting user infos linked to his id
  User.findOne({
      attributes: ['id', 'email', 'pseudo', 'imageUrl', 'isAdmin'],
      where: { id: userId }
  }).then((user) => {
      if (user) {
          res.status(201).json(user);
      } else {
          res.status(404).json({ 'error': 'user not found' });
      }
  }).catch((err) => {
      res.status(500).json({ 'error': 'cannot fetch user' });
  });
};

// Check all user admin
exports.findAll = (req, res) => {
    const userId = jwtUtils.getUserId(req.headers.authorization)

  asyncLib.waterfall([
          // Check if the user exists
          function(done) {
              User.findOne({
                      where: { id: userId }
                  })
                  .then(function(userFound) {
                      done(null, userFound);
                  })
                  .catch(function(err) {
                      return res.status(500).json({ 'error': 'unable to verify user' });
                  });
          },

          // If found, get all users by pseudo and id
          function(userFound, done) {
              if (userFound) {
                  User.findAll({
                          attributes: ['id', 'pseudo', 'email', 'imageUrl', 'isAdmin', 'createdAt']
                      })
                      .then(function(users) {
                          done(users)
                      }).catch(function(err) {
                          console.log(err);
                          res.status(500).json({ "error": "invalid fields" });
                      });
              } else {
                  res.status(404).json({ 'error': 'user not found' });
              }
          },
        ],

      // if done, confirm it
      function(users) {
          if (users) {
              return res.status(201).json(users);
          } else {
              return res.status(500).json({ 'error': 'cannot send users' });
          }
      })
};

//modification d'un profil
exports.update = async(req, res, next) => {

    // Params
    const pseudo = req.body.pseudo;
    const email = req.body.email;

    const password = req.body.password || null;

    const imageUrl = req.body && req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

    const emailExists = await User.findOne({ where: { email: email } });
    const pseudoExists = await User.findOne({ where: { pseudo: pseudo } });

    if (emailExists != null || pseudoExists !== null) {
        return res.status(406).json({ error: "Email already registered" })
    } else {

      asyncLib.waterfall([
          function(done) {
              User.findOne({
                      where: { id: req.body.userId }
                  }).then(function(userFound) {
                      done(null, userFound);
                  })
                  .catch(function(err) {
                      return res.status(500).json({ 'error': 'unable to verify user' });
                  });
          },

          function(userFound, done) {
              if (userFound && password !== null) {
                  bcrypt.hash(password, 10)
                      .then(hash => {
                          userFound.update({
                                  pseudo: (pseudo ? pseudo : userFound.pseudo),
                                  email: (email ? email : userFound.email),
                                  password: hash,
                                  imageUrl: (imageUrl ? imageUrl : userFound.imageUrl)
                              })
                              .then(function() {
                                  done(userFound);
                              })
                              .catch(function(err) {
                                  res.status(500).json({ 'error': 'cannot update user' });
                              })
                      })
              } else if (userFound && password == null) {
                  userFound.update({
                          pseudo: (pseudo ? pseudo : userFound.pseudo),
                          email: (email ? email : userFound.email),
                          imageUrl: (imageUrl ? imageUrl : userFound.imageUrl),
                          password: userFound.password,
                      })
                      .then(function() {
                          done(userFound);
                      })
                      .catch(function(err) {
                          res.status(500).json({ 'error': 'cannot update user' });
                      })
              } else {
                  res.status(404).json({ 'error': 'user not found' });
              }
          },
      ],
        function(userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    }
};

//Suppression d'un compte
exports.delete = (req, res) => {
  const userId = req.params.id;
  if (userId != null) {
      models.User.findOne({
          where: { id: userId }
      })
          .then(user => {
              if (user != null || user.isAdmin === true) {
                  // Post delete
                  models.Post.destroy({
                      where: { userId: user.id },
                      force: true
                  })
                    .then(() => {
                        console.log('All post have been deleted');
                        // User delete
                        models.User.destroy({
                            where: { id: user.id },
                            force: true
                        })
                            .then(() => res.end())
                            .catch(err => console.log(err))
                    })
                    .catch(err => {

                        console.log(err)
                        res.status(500).json(err)
                    })
              }
              else {
                  res.status(404).json({ error: 'user not exist in DataBase' })
              }
          })
  } else {
      res.status(500).json({ error: 'Cannot delete this account, contact an administrator' })
  }
};