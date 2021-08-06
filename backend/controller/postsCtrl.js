// Imports
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');

const db = require("../models/index");
const Post = db.post;
const User = db.user;
const Comment = db.comment;

// CRUD model
const ITEMS_LIMIT = 50;

// Routes
// Créer un Post
exports.createPost = (req, res, next) => {

    // Checks if there is a file and define its address or leave it blank
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

    asyncLib.waterfall([

        // Get the user to be linked with the post
        function(done) {
            User.findOne({
                    where: { id: req.body.userId }
                })
                .then(function(userFound) {
                    done(null, userFound);
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
        },

        // If found, create the post with inputs
        function(userFound, done) {
            if (userFound) {
                Post.create({
                        content: req.body.content,
                        imageUrl: imageUrl,
                        UserId: userFound.id
                    })
                    .then(function(newPost) {
                        done(newPost);
                    });
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        },

        // If done, confirm it
    ], function(newPost) {
        if (newPost) {
            return res.status(201).json(newPost);
        } else {
            return res.status(500).json({ 'error': 'cannot send post' });
        }
    })
};

// Récupère tout les Posts
exports.findAll = (req, res) => {

    const fields = req.query.fields; // DB table fields to load
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
        limit = ITEMS_LIMIT;
    }

    asyncLib.waterfall([

            // If found, get all posts by pseudo
            function(done) {
                Post.findAll({
                    // Cheking user inputs
                    order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
                    attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                    limit: (!isNaN(limit)) ? limit : null,
                    offset: (!isNaN(offset)) ? offset : null,
                    include: [{ 
                        model: User,
                        Comment,
                        attributes: ['pseudo', 'imageUrl', 'isAdmin']
                    }]
                }).then(function(posts) {
                    done(posts)
                }).catch(function(err) {
                    console.log(err);
                    res.status(500).json({ "error": "invalid fields" });
                });
            },
            // If done, confirm it
        ],
        function(posts) {
            if (posts) {
                return res.status(201).json(posts);
            } else {
                return res.status(500).json({ 'error': 'cannot send post' });
            }
        })
};


//Suppression d'un post
exports.deletePost = (req, res) => {

    Post.findOne({
        where: {
            id: req.params.id
        }
    }).then(post => {
        // Checking if there is a file attached with the post
        if (post.imageUrl !== null) {
            const filename = post.imageUrl.split('/images/')[1]; // get the filename
            fs.unlink(`images/${filename}`, () => { // delete the file
                Post.destroy({ where: { id: req.params.id } }) // then delete the post
                    .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        }
        // Just delete the post if no file attached
        Post.destroy({ where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: 'Post supprimé !' }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ message: "Post introuvable", error: error }))
};