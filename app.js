const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const port = process.env.port || 3000;
var app = express();

//We need this to access local files. All local files accessed within signup.html needs to be placed within public folder and public folder has to be provided here to app.use method.
app.use(express.static("public"));

//If we want to access the user data entered within the signup.html form
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
    console.log("Get Sign up page");
});

//Read the user entered data on signup form.
app.post("/",function(req,res){
    let fName = req.body.fName;
    let lName = req.body.lName;
    let email = req.body.eMail;
    console.log(fName , lName, email);

    //Format is as per MailChimp developer docs.
    //create javascript object.
    let data = {
        members :[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                    FNAME: fName,
                    LNAME:lName
                }
            }
        ]
    };

    //Convert javascript object to json before sending.
    const jsonData = JSON.stringify(data);

    //Url - get it from MailChimp Account.
    const url = "https://us7.api.mailchimp.com/3.0/lists/600c829ac0"

    //Provide auth key , that is API key.
    const options = {
        method: "POST",
        auth:"jyothi1:33f0f9e8920a5bf395cb0f8461fd20a4-us7"
    }
    
    //Make a API call to Mailchimp , providing url and options.
    const request = https.request(url, options,function(response){

        //If success navigate to success page.
        if(response.statusCode === 200){
            console.log("Success!!!");
            res.sendFile(__dirname+"/success.html");
        }
        else{
            console.log("Failure !!!!");
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            //Uncomment to seee what response is recieved from server after API call.
            //console.log(JSON.parse(data));
        })
    });
    
    //Sending the user entered data along request.
    request.write(jsonData);
    request.end();

});

//To redirect to login page once try again button is clicked.
app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(port, function(){
    console.log("Server listening Signup Project!!!!");


});

//Get all these from Mailchimp account.
//API Key
//33f0f9e8920a5bf395cb0f8461fd20a4-us7

//Audience Id
//600c829ac0