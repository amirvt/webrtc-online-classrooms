const fs = require('fs');

function prompt(question, callback) {
  var stdin = process.stdin,
    stdout = process.stdout;

  stdin.resume();
  stdout.write(question);

  stdin.once('data', function (data) {
    callback(data.toString().trim());
  });
}

const licode_config = require(process.env['HOME'] + '/licode/licode_config.js');
if (!licode_config){
  console.log("Could not find licode");
  exit(-1);
}
const config = require("../config.json");
config.service.ID = licode_config.nuve.superserviceID;
config.service.Key = licode_config.nuve.superserviceKey;

prompt("What's your server ip? (example: https://192.168.193.131:3016) ", (input) => {
  config.serverIp = input;
  config.licodeIp = "http://localhost:3000/";
  const str = JSON.stringify(config, null, 2);
  fs.writeFile(__dirname + "/../config.json", str, function (err) {
    if(err){
      console.log("Error writing to config.json");
      exit(-1);
    }
    process.exit();
  });
});
