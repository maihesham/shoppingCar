var Admin = require('../model/admin');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } );

 var newAdmin = new Admin();
        newAdmin.email = 'maiheshamibrahim10@gmail.com';
        newAdmin.password = newAdmin.encryptPassword('mai99');
        newAdmin.save(function(err, result) {
            mongoose.disconnect();
        });

