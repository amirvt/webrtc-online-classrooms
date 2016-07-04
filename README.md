#WebRTC Online Classrooms


A Small Project that leverages the Licode WebRTC communications platform to create virtual classrooms using the relatively new WebRTC standard.

##Technologies
* [react.js](https://facebook.github.io/react/)
* [redux.js](http://redux.js.org/)
* [material-ui](http://material-ui.com/)
* [express.js](http://expressjs.com)
* [The Licode WebRTC communications platform](http://lynckia.com/licode/). 

##Features

This project is still under  development. A working feature-complete prototype will be available by August 2016.

##Setting up a development environment 

1. Install a Licode server using the instructions at [http://lynckia.com/licode/install.html](http://lynckia.com/licode/install.html)
2. Install NPM and Node
3. Clone this repo
4. Edit the project [config file](/server/config.js)
5. Run `npm install`
6. Run the server with `node server/index.js`
7. Run the client using the `npm start -s` command

##Setting up https


###Setting up https for the Licode server

You'll need to do this to be able to use screen capturing.

Open `licode/scripts/licode_default.js`
Change the settings as below:

```javascript
config.erizoController.hostname = 'your_server_hostname_include_domain_name'; //default value: ''
config.erizoController.port = 8443; //default value: 8080
// Use true if clients communicate with erizoController over SSL
config.erizoController.ssl = true; //default value: false
```

```javascript
// This configuration is used by erizoController server to listen for connections
// Use true if erizoController listens in HTTPS. SSL certificates located in /cert
config.erizoController.listen_ssl = true; //default value: false
config.erizoController.listen_port = 8443; //default value: 8080
```

Finally, replace both cert.pem and key.pem in /cert directory with your own cert files. 
