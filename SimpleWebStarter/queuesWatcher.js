// Listen to Redis and show how many items are in 
// the queue

// Connect to the redis server
const redis = require("redis");
var redisConf = {
  host: 'ev-compsci-01.principia.local', // The redis's server ip 
  port: '6379'
  }; 
const client = redis.createClient(redisConf);
client.on("error", function(error) {
  console.error(error);
});


// Loop through the following function and refresh the screen
function showQueues() {
    console.clear();

    client.lrange('submittedQ2', 0, 10, (err, items) => {
        if (!err) {
            // Loop through entries and draw to screen
            console.log("\n\nTo do tasks:\n")
            for(let i = 0; i < items.length; i++) {
                console.log(i + " - " +items[i]);
            }
        }
    });
    client.lrange('convertedQ2', 0, 10, (err, items) => {
        if (!err) {
            // Loop through entries and draw to screen
            console.log("\n\ncompleted tasks:\n")
            for(let i = 0; i < items.length; i++) {
                console.log(i + " - " +items[i]);
            }
        }
    });
    // Wait 5 seconds and do it again
    setTimeout(showQueues, 5000);
}


// run
showQueues();