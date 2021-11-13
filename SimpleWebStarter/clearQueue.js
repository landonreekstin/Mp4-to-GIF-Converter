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
function clearQueue() {

    client.lrange('submittedQ2', 0, 10, (err, items) => {
        if (!err) {
            for(let i = 0; i < items.length; i++) {
                client.lpop("submittedQ2"); // pop everything
            }
        }
    });
    console.log("Done.");
}



clearQueue();