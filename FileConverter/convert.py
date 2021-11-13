# converter file to take .mov or .mp4 file from Redis queue, convert to .gif, 
# and push back onto seperate Redis queue

import os
import sys
import redis

import ffmpeg
from time import sleep

outputPath = "C:\\Users\\lando\\Documents\\Programming Languages\\JavaScript\\gif-converter-2-landon-and-delwys\\converted\\"
inputPath = "C:\\Users\\lando\\Documents\\Programming Languages\\JavaScript\\gif-converter-2-landon-and-delwys\\subs\\"

# time to delay before popping another file off submittedQ2
wait = 5

# connect to redis server
client = redis.Redis(host='ev-compsci-01.principia.local', port=6379, db=0)

while 1==1:

    #Pop video file from Redis mov/mp4 stack
    fileName = client.lpop('submittedQ2')
    while fileName != None:
        fileName = fileName.decode("utf-8")

        # For testing
        #fileName = "39i1j85i8c"
        #print(fileName.decode("utf-8"), type(fileName))
        #sys.exit()

        # convert to gif
        (
        ffmpeg
        .input(inputPath + fileName)
        .output(outputPath + fileName + ".gif")
        .run()
        )

        # push onto converted stack with gif files
        client.rpush('convertedQ2', fileName)

        fileName = client.blpop('submittedQ2', wait)

    # Wait to pop another file, not needed if using blpop()
    sleep(5)