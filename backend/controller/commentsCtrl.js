// Imports
const db = require("../models/index");
const Comment = db.comment;
const User = db.user;
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

//Routes
// Création d'un commentaire
exports.createComment = (req, res, next) => {

    // Params
    const content = req.body;
    const userId = jwtUtils.getUserId(req.headers.authorization);

    if (content == null) {
        return res.status(400).json({ 'error': 'missing body' });
    }

    asyncLib.waterfall([

        // Get the user to be linked with the post
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

        // If found, create comment with input
        function(userFound, done) {
            if (userFound) {
                // Create the post and save it in DB
                Comment.create({
                        content: req.body.content,
                        UserId: userFound.id,
                        postId: req.params.id,
                    })
                    .then(function(newComment) {
                        done(newComment)
                    })
                    .catch(() => res.status(400).json({ message: "erreur commentaire controller" }));
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        },

        // If done, confirm it
    ], function(newComment) {
        if (newComment) {
            return res.status(201).json(newComment);
        } else {
            return res.status(500).json({ 'error': 'cannot send comment' });
        }
    })
};

// Récupération de tous les Commentaires
exports.getAllComments = (req, res, next) => {

    Comment.findAll({
            include: [{
                model: User,
                attributes: ['pseudo', 'imageUrl', 'isAdmin']
            }]
        })
        .then((comment => res.status(200).json(comment)))
        .catch(error => res.status(400).json({ error: "Erreur lors de l'affichage des commentaires" }));
},


// Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {

    Comment.findOne({
            where: {
                id: req.params.id
            }
        }).then(comment => {
            if (comment) {
                Comment.destroy({ where: { id: req.params.id },force: true })
                    .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ message: "Commentaire introuvable", error: error }))
};