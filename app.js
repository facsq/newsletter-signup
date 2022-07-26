const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")
 
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))


app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(firstName, lastName, email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,

            }
        }]
    };


    app.post("/failure", function(req,res){
        res.redirect("/"); 
    })

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/3edc08e825";
    const options = {
        method: "POST",
        auth: "squirrel:faaf306a7f21a4fabf4df44eb975f9bd-us10"

    }
    
    const request = https.request(url, options, function(response){
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    });

    request.write(jsonData);
    request.end();


});



//faaf306a7f21a4fabf4df44eb975f9bd-us10 api key
//3edc08e825 audience id

app.listen(process.env.PORT || 3000);
