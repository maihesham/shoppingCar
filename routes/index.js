var express = require('express');
var router = express.Router();
var Cart = require('../model/cart');
var Product = require('../model/product');
var Order = require('../model/order');
/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i ++) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('index', {title: 'Shopping Cart', products: productChunks,successMsg: successMsg, noMessages: !successMsg});
    });
});
router.get('/add-to-cart/:id', function (req, res, next) {
   
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart.items : {});
    
    Product.findById(productId, function (err, product) {
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
        
    });
});
router.get('/shopping-cart', function (req, res, next) {
    
    if (!req.session.cart) {
        return res.render('shopping-cart', {title: 'Cart',products: null});
    }
    var cart = new Cart(req.session.cart.items);
    console.log("heeeeeeeeeeeeeeeeeeeeeeeeeee"+cart.generateArray()+" "+cart.totalPrice);
    var arrCar=[];
    arrCar=cart.generateArray();
    for(var i=0;i<arrCar.length;i++){
        console.log("index "+arrCar[i].qty);
    }
    res.render('shopping-cart', {title: 'Cart',products: arrCar, totalPrice: cart.totalPrice});
});
router.get('/checkout', isLoggedIn, function(req, res, next) {
    console.log("llllllllllll;;;;;;;;;;;     "+req.session.cart.items);
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart.items);
    var errMsg = req.flash('error')[0];
    res.render('checkout', {title: 'checkout',total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});
router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart.items);
     var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
           
        });
        order.save(function(error,res){if(error){console.log("error "+error);}});
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
        }); 
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart.items ? req.session.cart.items : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart.items ? req.session.cart.items : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

module.exports = router;
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()&&req.session.user.role=="user") {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}