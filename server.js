/*
    description: Application handles and provides login, register, main and purchase pages.
                 This app integrates multiple concepts from "MEAN" software stack, leaving 
                 behind only Angular.js.
                 Instead of MongoDB module, mongoose is being used as a faster and more
                 straight-forward approach to the NoSQL database.

    author: Gabriel Moreira
    date: January 23nd, 2019
*/

//requirements
const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const fs = require("fs");
const randomStr = require("randomstring");
const session = require("client-sessions");
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
//end requirements


//APP setup
var userData = require("./public/data/users.json");
const app = express();
const PORT = process.env.PORT || 3000

app.engine(".hbs", exphbs({
    defaultLayout: "main",
    extname: ".hbs"}));
app.set("view engine", ".hbs");                                       
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//end APP setup

//Variables
var strRandom = randomStr.generate();
app.use(session({
    cookieName: "MySession",
    secret: strRandom,      												//	random string
    duration: 5 * 60 * 1000,												//	5 minutes
    activeDuration: 1 * 60 * 1000,											//	1 minutes
    httpOnly: true,                                                         //  prevents browser JavaScript from accessing cookies
    secure: true,                                                           //  ensures cookies are only used over https
    ephemeral: true                                                         //  deletes the cookie when the browser is closed
}));

var Schema = mongoose.Schema;
var dbSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    avail_quantity: Number,
    fileName: String
}, {
    versionKey: false                                                       //  Suppresses versioning
});
var db = mongoose.model("products", dbSchema);

var dataSet = {
    imgList: [],
    imgTitle: "Gabriel Moreira - Food shop",
    imgFile: "foodshop.png",
    imgDesc: "",
    userName: "",
    prodName: "",
    prodDescription: "",
    prodQuantity: "",
    btnHide: "hidden"
};

var purchaseData = {
    imgFile:"",
    Name:"",
    Description: "",
    Price:0,
    Quantity:0,
    Message: ""
}
//end variables


//Methods

//Mongoose connection methods
var mongodbUri = "mongodb://user:user@ds147518.mlab.com:47518/web322_database";
var conn = mongoose.connection;
conn.on('connected', function () {  
    console.log('Mongoose default connection open to ' + mongodbUri);
}); 
conn.on('error',function (err) {  
    console.log('Mongoose default connection error: ' + err);
});

//End Mongoose connection methods

//This method renders the login page requested using the
//URL wihthout aditional path.
app.get("/", function(req, res){
    res.render('login', {
    });
});

//This method will render the main page if there's a match
//on username and password. Otherwise, it will display error 
//messages bellow the buttons.
app.post("/", function(req, res){
    if(!userData.hasOwnProperty(req.body.txtUserName))
    {
        var errorMsg = {Message : "Not a registered username"}
        res.render('login', {
            data: errorMsg
        });
    }

    else if (userData[req.body.txtUserName] != req.body.txtPassword)
    {
        var errorMsg = {Message : "Wrong password"}
        res.render('login', {
            data: errorMsg
        });   
    }

    else
    {
        mongoose.connect(mongodbUri);
        conn.once('open', function() {
            // Wait for the database connection to establish, then start the app.         
        });
        req.MySession.user = req.body.txtUserName;
        req.MySession.password = req.body.txtPassword;
        
        dataSet.userName = req.MySession.user;
        dataSet.imgFile = "foodshop.png";
        dataSet.imgDesc = "";
        
        db.update({}, {avail_quantity:3}, {multi: true}, (err,data)=>{
            if (err) throw err;
            populateArray(req,res);
        });
    }
});

//This method will render the page with an image selected on
//the list. It also handles the case when the user logs out
//and return to the previous page. In this case it won't process
//the request to display the image.
app.post("/shop", (req,res)=>{
    var inputData = req.body.foodOption;
    purchaseData.Name = req.body.foodOption;

    if(req.MySession.user)
    {
        if (inputData)
        {
            dataSet.imgDesc = inputData;
            db.find({name:inputData}, { _id: 0, name: 1, fileName: 1 }, (err, data) => {
                if (err) throw err;
                dataSet.imgFile =  data[0].fileName;
                res.render('index', {
                    data: dataSet
                });
            });
        }
       
        else
        {
            dataSet.imgFile = "foodshop.png";
            dataSet.imgDesc = "";
            res.render('index', {
                data: dataSet
            });
        }
    }
});

//This method ends the session and render the login page.
app.post("/logout", (req,res)=>{
    res.clearCookie("MySession");
    res.render('login', {
    });
    conn.close(function () { 
        console.log('Mongoose default connection disconnected');
    }); 
});

//This method renders the register page.
app.get("/register", (req,res)=>{
    res.render('register', {
    });
});

//This method gets the registry information from the register
//page. It evaluates if:
//1. User already exists
//2. Passwords are matching
//3. Password has lenght of at least 8 characters
//It will display messages for each of the cases.
app.post("/register", (req,res)=>{
    var user = req.body.txtUserName;
    var pass = req.body.txtPassword;
    var cpass = req.body.txtConfirmPassword;
    var errorMsg = {userName: "", Message: ""};
    
    if(userData.hasOwnProperty(user))
    {
        errorMsg.Message = "User name not available."
        res.render('register', {
            data: errorMsg
        })
    }

    else if(pass != cpass)
    {
        errorMsg.userName = user; 
        errorMsg.Message = "Passwords do not match."
        res.render('register', {
            data: errorMsg
        })
    }

    else if(pass.length < 8)
    {
        errorMsg.userName = user; 
        errorMsg.Message = "Password must be at least eight characters."
        res.render('register', {
            data: errorMsg
        })
    }

    else
    {
        errorMsg.Message = "Successfully registered."
        res.render('login', {
            data: errorMsg
        })
        userData[user] = pass;
        fs.writeFile("./public/data/users.json", JSON.stringify(userData, null, 4), (err) => {
            if (err) throw err;
            console.log("File successfully created/updated.");
        });
    }
});

//This method renders the purchase page, when the selected image
//is double clicked in the main page. It will display a smaller
//product image and its name, description, available quantity 
//and price
app.post("/purchase", (req,res)=>{
    if(purchaseData.Name == "")
    {
        populateArray(req,res);
    }
    else
    {
        db.find({name:purchaseData.Name}, (err, data) =>{
            if (err) throw err;
            purchaseData.imgFile = data[0].fileName;
            purchaseData.Description = data[0].description;
            purchaseData.Name = data[0].name;
            purchaseData.Price = data[0].price;
            purchaseData.Quantity = data[0].avail_quantity;
            
            res.render('purchase', {
                data:purchaseData
            });
        });
    }
});

//This method gets the purchase order with desired quantity to buy
//and updates the database.
app.get("/purchase", (req,res)=>{
    db.update({ name: purchaseData.Name }, { $set: { avail_quantity: purchaseData.Quantity-req.query.txtQuantity}},(err,data)=>{
        if (err) throw err;
        populateArray(req,res);
    });
});

//This method renders the main page after the "Cancel" button is
//clicked on the purchase page.
app.post("/cancel", (req,res)=>{
    dataSet.imgFile = "foodshop.png";
    populateArray(req,res);
})

//this method resets the product quantity in the database. It can be
//used as a way to reset the products in case one still might be at
//the main page and doesn't want to logout and login again.
app.get("/reset", (req,res)=>{
    db.update({}, {avail_quantity:3}, {multi: true}, (err,data)=>{
        if (err) throw err;
        populateArray(req,res);
    });
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

//This global function was created to shorten the code, since this
//piece of code had to be used in many places. It is used to update
//the product list on the main page with only products that are available
function populateArray(req,res) {
    db.find({}, { _id: 0, name: 1, avail_quantity: 1 }, (err, data) => {
        if (err)
            throw err;
        var jIndex = 0;
        dataSet.imgList = [];
        data.forEach((product, index) => {
            if (product.avail_quantity <= 0) {
                return;
            }
            dataSet.imgList[jIndex++] = product.name;
        });
        purchaseData.Name = "";
        dataSet.imgDesc = "";
        dataSet.imgFile = "foodshop.png";
        if(req.MySession.user)
        {
            res.render('index', {
                data: dataSet
            });
        }
        else
        {
            res.render('login',{
            })
        }
    });
}
//end methods