/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var pg = require("pg");
module.exports = {
	signup : function (req, res) {
    // body...
    var info = req.body.params;
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("SELECT usuario FROM USUARIOS WHERE usuario='"+info.username+"';", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        if(result.rows.length >= 1){
           res.json({state:0});
        }
        else{
          client.query("INSERT INTO USUARIOS VALUES('"+info.nit+"','"+info.username+"','"+info.name+"', '"+info.lastName+"', '"+info.documento+"', '"+info.tarjeta+"', '"+info.email+"', false)" ,function(err, result) {
            if(err) {
              return console.error('error running query', err);
            }
            res.json(info);
          });
        }
        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
        client.end();
      });
    });


   
  },
  signin : function (req, res) {
    // body...
    var info = req.body.params;

    res.json({state:200});
  }
};
//INSERT INTO usuarios VALUES(0,'superuser','cris12345','cristhian','morales','1234567890','0123456789012345','cristhian@gmail.com',true)
