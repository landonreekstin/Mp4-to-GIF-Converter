A simple web app using JavaScript and Python to convert video files into a gif.

- Project name: Gif Converter

- Authors: Landon Reekstin, Delwys Glokpor

- Project description:
  CSCI 220 Programming Languages assignment. By a combination of javascript
  servers and python scripts, make a browsable site where a user can submit
  ".mp4" or ".mov" video files. Said video once submitted are queued onto a
  Redis queue on a 3rd party server. From the Redis server, the files are
  pulled and converted into gif files using ff-mpeg api on local machine.
  Resulting files are queued on a different queue on the 3rd party server.
  From there then the site must provide the user with a link to his converted
  gif.

- General informations:
  # ".mov" and ".mp4" files are submitted through
  "./SimpleWebStarter/public/index.ejs".
  # valid video files are given a unique 10 alphanumeric name then moved under
  "./subs/".
  # current path is then pushed onto "submittedQ2" on Redis server.
  # path is popped from queue for conversion through
  "./FileConverter/convert.py".
  # Converted files are expected to be moved under "./converted/" and
  their path pushed onto the "convertedQ2".

- Redis server config: (requires that you get onto Principia VPN if applicable)
  host: 'ev-compsci-01', // redis ip
  port: '6379'

- Queue of submitted videos files:
  name: "submittedQ2"
  contents: each element is a String that is a direct path to file location.

- Queue of converted gif:
  name: "convertedQ2"
  contents: each element is a String that is a direct path to file location.