const fs = require('fs');



const licode_config = require(process.env['HOME'] + '/licode/licode_config.js');
if (!licode_config){
  console.error("Could not find licode");
  process.exit(-1);
}
let serverConfig = require("../server/config.json");
serverConfig.service.ID = licode_config.nuve.superserviceID;
serverConfig.service.Key = licode_config.nuve.superserviceKey;
const str = JSON.stringify(serverConfig, null, 2);
fs.writeFile(__dirname + "/../src/config.json", str, function (err) {
  if(err){
    console.error("Error writing to config.json");
    process.exit(-1);
  }
});


// function prompt(question, callback) {
//   const stdin = process.stdin,
//     stdout = process.stdout;
//
//   stdin.resume();
//   stdout.write(question);
//
//   stdin.once('data', function (data) {
//     callback(data.toString().trim());
//   });
// }
