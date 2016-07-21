const licode_config = require(process.env['HOME'] + '/licode/licode_config.js');
if (!licode_config){
  console.log("Could not find licode");
  exit(-1);
}
const config = require("../config.json");
config.service.ID = licode_config.nuve.superserviceID;
config.service.Key = licode_config.nuve.superserviceKey;
const str = JSON.stringify(config, null, 2);
require('fs').writeFile("../config.json", str, function (err) {
  if(err){
    console.log("Error writing to config.json");
    exit(-1);
  }
});
