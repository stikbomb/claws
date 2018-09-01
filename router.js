"use strict";

const UsersModel = require('./models/users.model');
const MessageModel = require('./models/messages.model');
const GamesModel = require('./models/games.model');
const textsController = require('./controllers/textscontrol');

module.exports = (app, passport) => {


    app.get('/', (req, res) => {
        res.render('index.ejs');
    });


    app.get('/login', (req, res) => {
        res.render('login.ejs')
    });


    app.post('/changename', (req, res) => {
        console.log(req.user);
        UsersModel.update({"local.name": req.user.local.name}, { $set: {"local.name": req.body.newname}}, function (err, user) {
            if (err) return handleError(err);
            res.send("Succes!");
        });
    });


    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile.ejs')
    });



    app.get('/api/getalluser', async (req, res) => {
        let users = await UsersModel.find().lean().exec();
        res.send(users);
        }
    );


    app.get('/api/getallmsg', async (req, res) => {
        let messages = await MessageModel.find().lean().exec();
        res.send(messages);
    });


    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/', // redirect to the secure profile section
    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
    // }));

    app.post('/login', passport.authenticate('local-login',  {
            failureRedirect: '/auth'
        }),
        function (req, res) {
            // Successful authentication
            //, redirect home.
            res.send({user: req.user});
        });




    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
    }));


    // app.post('/register', passport.authenticate('local-signup', {
    //         failureRedirect: '/auth'
    //     }),
    //     function (req, res) {
    //         // Successful authentication
    //         //, redirect home.
    //         res.send('Success!');
    //     });


    app.post('/logout', (req, res) => {
        req.session.destroy(function (err) {
            res.redirect('/'); //Inside a callback… bulletproof!
        })
    });


    app.get('/auth/vk',
        passport.authenticate('vk', {
            scope: ['friends']
        }),
        function (req, res) {
            // The request will be redirected to vk.com
            // for authentication, so
            // this function will not be called.
        });


    app.get('/auth/vk/callback',
        passport.authenticate('vk', {
            failureRedirect: '/auth'
        }),
        function (req, res) {
            // Successful authentication
            //, redirect home.
            res.redirect('/');
        });

    app.get('/closeall', (req, res) => {
      GamesModel.find({status: 'Starting'}, (err, result) => {
        console.log(result);
        result.forEach((game) => {
          GamesModel.findByIdAndUpdate(game._id, { $set: { status: 'Closed' }}, (err, result) => {
            if (err) throw err;
            console.log(result);
          });
        });
        console.log('Succes!!!');
        res.sendStatus(200);
      })
    });

    app.get('/getalltexts', textsController.getAll);
    app.get('/text/:id', textsController.getText);
    app.post('/text', textsController.addText);
    app.put('/text/:id', textsController.updateText);
    app.delete('/text/:id', textsController.deleteText);

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}