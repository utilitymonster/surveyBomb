var crypto = require('crypto');

var models = require('./models');
var sequelize = models.sequelize;
var Admin = models.Admin;
  
var prompt = require('prompt');
var iterations = 1000;
var keylen = 24; // bytes
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
    var buff = crypto.pbkdf2Sync(password, 'salt', iterations, keylen);
    var pw_crypt = Buffer(buff, 'binary').toString('hex');

    Admin.create({
      name: result.username,
      password: pw_crypt
    }).then(function(){
      console.log("Admin created");
    });

  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
})

