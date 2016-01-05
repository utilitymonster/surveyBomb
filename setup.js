var crypto = require('crypto');

var models = require('./models');
var auth = require('./authenticate');

var sequelize = models.sequelize;
var Admin = models.Admin;
  
var prompt = require('prompt');
var force = true;

prompt.start();

sequelize.sync({force: force}).then(function(){

  console.log("Setting up the database");
  console.log("Create your admin credentials");

  var properties = [
    {
      name: 'username', 
      validator: /^[a-zA-Z\s\-]+$/,
      warning: 'Username must be only letters, spaces, or dashes'
    },
    {
      name: 'password',
      hidden: true
    }
  ];

  prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }

    var password = result.password;
    var salt = new Buffer(crypto.randomBytes(512)).toString('hex');
    var pw_crypt = auth.obscure_password(password, salt);

    Admin.create({
      name: result.username,
      password: pw_crypt,
      salt: salt
    }).then(function(){
      console.log("Admin created");
      console.log("Setup Complete - Run 'node index.js' and visit '/admin/index' in your browser");
    });

  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
})

