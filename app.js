// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);
var pg = require("pg");

  var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";

  var client = new pg.Client(conString);
client.connect();