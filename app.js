const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
app.use(bodyParser.urlencoded({ extended: true }));

//the server will run in a dynamic port chose by Heroku
//but it also works locally
app.listen(process.env.PORT || 3000);

//to take static files inside a folder public
//html file will search the files inside this dir
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  //to tranform JS data into JSON data
  const jsonData = JSON.stringify(data);

  //to post data in an API
  const url = "https://us7.api.mailchimp.com/3.0/lists/71780b59f0";
  const options = {
    method: "POST",
    auth: "gnyokota:a2d04ea173843421194000851f08f529c-us7",
  };

  const request = https.request(url, options, function (response) {
    response.statusCode === 200
      ? res.sendFile(__dirname + "/sucess.html")
      : res.sendFile(__dirname + "/failure.html");
    // response.on("data", function (data) {
    //   console.log(JSON.parse(data));
    // });
  });

  //passing the input data to the API
  request.write(jsonData);
  request.end();
});

//the submit button(action) will redirect us to the homepage
app.post("/failure", function (req, res) {
  res.redirect("/");
});

//2d04ea173843421194000851f08f529c-us7
//71780b59f0
