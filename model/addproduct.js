var Product = require('../model/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true } );
module.exports={
	"addproduct":function(reqest){
		var products = new Product();
		        products.imagePath=reqest.body.image;
		        products.title=reqest.body.title;
		        products.description=reqest.body.description;
		        products.price=reqest.body.price;
		  products.save(function(err, result) {
		  	    mongoose.disconnect();

		  });
      
	}
};