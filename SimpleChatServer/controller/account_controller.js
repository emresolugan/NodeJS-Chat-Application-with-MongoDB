const User = require('../models/Users');
var expressValidator = require('express-validator');

/**
 * GET /register
 * register page.
 */

 exports.getRegister = (req, res) => {
	 
	 res.render('Register.html');
 };



/**
 * POST /register
 * Create a new local account.
 */
exports.postRegister = (req, res, next) => {
  
  const user = new User({
    email: req.body.email,
    password: req.body.password,
	username: req.body.username
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (existingUser) {
      console.log('This account already exists..');
      return res.redirect('/Register.html');
    }
    user.save(function (err) {if (err) console.log ('A user added in the database..')});
	return res.redirect('/?param=' + req.body.username);
  });
};


/**
 * GET /login
 * login page.
 */

 exports.getLogin = (req, res) => {
	 
	 res.render('Login.html');
 };
 
 
 /**
 * POST /login
 * Create a new local account.
 */
 
 exports.postLogin = (req, res) => {

 var username = req.body.username;
 var password = req.body.password;
 
	 
 User.findOne({ username: username , password: password}, function(err, existingUser) {
    if (err) {
	  console.log(err);
      return res.status(500).send();
    }
	if(!existingUser)
	{
		console.log('Record not found..');
		return res.redirect('Login.html');
	}
	
		return res.redirect('/?param=' + username);
	
  })
 };