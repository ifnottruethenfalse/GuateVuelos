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
            info.state = 200;
            info.superuser = false;
            res.send(info);
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
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("SELECT * FROM USUARIOS WHERE usuario='"+info.username+"' AND password= '"+info.password+"'", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        if(result.rows.length == 0){
           res.json({state:0});
        }
        else{
            info.state = 200;
            console.log(result.rows[0]);
            info.superuser = result.rows[0].superuser;
            info.name = result.rows[0].nombre;
            info.lastName = result.rows[0].apellido;
            info.username = result.rows[0].usuario;
            info.email = result.rows[0].correoelectronico;
            info.tarjeta= result.rows[0].tarjetadecredito;
            info.documento = result.rows[0].numeropasaporte;
            info.nit = result.rows[0].nit;
            console.log(info);
            res.send(info);
        }
        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
        client.end();
      });
    });
  }
};

