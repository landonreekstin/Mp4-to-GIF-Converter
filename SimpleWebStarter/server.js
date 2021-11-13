
var express = require('express');
var app = express();
const busboy = require('connect-busboy'); // form upload manager
const fs = require('fs'); // file stream file manager
const { customAlphabet } = require('nanoid'); // random id
const redis = require('redis'); // database
const { response } = require('express');
const { time } = require('console');

// set random id generator
const nanoid = customAlphabet('1234567890abcdefghij', 10);

// set up connection to redis server
let redisConf = {
  host: 'ev-compsci-01.principia.local', // redis ip
  port: '6379'
};
const redisClient = redis.createClient(redisConf);
redisClient.on('error', error => { 
  console.error(error)
});

// Set the View Engine
app.set('view engine', 'ejs');

// enable middleware
app.use(busboy());

// Set up the server
// process.env.PORT is related to deploying on AWS
var server = app.listen(process.env.PORT || 5000, listen);
module.exports = server;
path = require('path');

// send the index.ejs file
app.get("/", async(req, res) =>{
  res.render("public/index");
});

// send the index.ejs file
app.get("/convert/:file", async(req, res) =>{
  redisClient.lrange('convertedQ2', 0, 10, (err, items) =>{
    if (items.includes(req.params.file)){ // file available
      // redirect to download screen
      res.render("public/download",
        {file: __dirname + "/" + req.params.file + ".gif"});
    }else{ // return to wait screen
      res.render("public/wait_screen",
        {file: req.params.file});
    }
  });
});

// submission control
app.post("/convert", async(req, res) =>{
  console.clear() // debug 
  
  // variables 
  let fstream;
  let fuuid = nanoid(); // generate random uuid
  let fpath;
  let status = "valid";
  
  // handle upload
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename){
    // confirm extension
    let ext = filename.split('.');
    ext = ext[ext.length - 1];
    console.log(ext);
    ext.toLowerCase();
    if (!(ext == "mp4" || ext == "mov")){
      status = "invalid";
    }
    else{
      console.log("\n\nReceived: " + filename);
      // move to upload submission's folder
      fpath = __dirname + '/../subs/' + fuuid;
      fstream = fs.createWriteStream(fpath);
      file.pipe(fstream);
      // queue task onto regis server
      redisClient.rpush(['submittedQ2', fuuid], function(err, reply) {
        let d = Date(Date.now());
        let a = d.toString();
        console.log("\n\nAdded new task: " + fuuid + " at " + a);
      })
      // debug check that file was uploaded
      confirmUpload();
    }
  });

  // send response
  if (status == "invalid"){
    // return to upload page
    res.render("public/index", {status_fl: status, file: fuuid});
  }
  else {
    // redirect to response page
    res.render("public/wait_screen", {status_fl: status, file: fuuid});
  }  
});

// outsourced response for timeout purposes
// check contents of queue
function confirmUpload(){
  let d = Date(Date.now());
  console.log("\n\nTop ten items in submittedQ at: " + d.toString());
  redisClient.lrange('submittedQ2', 0, 10, (err, items) =>{
    items.map(item => {
      console.log(item + " found on queue.")});
  });
}

// ***********************************************
// Be sure any routes are setup before this!
// Set the folder for public items
publicDir = path.join(__dirname,'public');
app.use(express.static(publicDir))
app.set('views', __dirname);
app.use(express.urlencoded({ extended: true }))

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}