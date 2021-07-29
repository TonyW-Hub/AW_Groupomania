// Imports
const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');
// Constants

// Routes
exports.createPost = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    const title = req.body.title;
    const content = req.body.content;

    if (title == null || content == null) {
        return res.status(400).json({ error: 'missing parameters' });
    }
    if (title.length <= 2 || content.length <= 4) {
        return res.status(400).json({ error: 'invalid post'});
    }

    asyncLib.waterfall([
        function(done) {
            models.User.findOne({
                where: { id: userId }
            })
            .then(function(userFound) {
                done(null, userFound);
            })
            .catch(err => { return res.status(500).json({ error: 'unable to verify user' });});
        },
        function(userFound, done) {
            if (userFound) {
                models.Message.create({
                    title: title,
                    content: content,
                    likes: 0,
                    UserId: userFound.id
                })
                .then(newMessage => {
                    done(newMessage);
                });
            } else {
                res.status(404).json({ error: 'user not found '});
            }
        }
    ]), function(newMessage) {
        if (newMessage) {
            return res.status(201).json(newMessage);
        } else {
            return res.status(500).json({ error: 'cannot post message' });
        }
    };
};

exports.getPost = (req, res, next) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    models.Message.findAll({
        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: [ 'username' ]
        }]
    })
    .then(function(messages) {
        if (messages) {
            res.status(200).json(messages);
        } else {
            res.status(404).json({ err: 'no messages found' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ err: "invilad fields" });
    });
};