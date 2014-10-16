/**
 * ReservacionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var pg = require("pg");
module.exports = {
   add: function (req, res) {
    var info = req.body.params;
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("INSERT INTO RESERVACION VALUES('"+info.username+"','"+info.description+"','"+info.paquete+"','"+info.precio+"');", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
          console.log(result)
            info.state = 200;
            info.superuser = false;
            res.send(info);
            client.end();
          });
        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
      });
    // Send a JSON response
  }
  
};
