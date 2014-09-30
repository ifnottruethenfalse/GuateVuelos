/**
 * FlightController
 *
 * @description :: Server-side logic for managing flights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var pg = require("pg");
module.exports = {
	


  /**
   * `FlightController.search()`
   *  Descripcion: Busca en las bases de datos las aereolineas para luego ejecutar los scripts de cada una.
   *  Devuelve: Un Arreglo con este formato:
   *       [{"aereolina":maya,"vuelos":[{ ... }], ... ]
   */
  search: function (req, res) {
    var info = req.body.params;
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    var i = 0;
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("SELECT codigo FROM AEROLINEAS", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        if(result.rows.length < 1){
           res.json({state:0}); // Te envio 0 "no hay aerolineas en la base de datos."
        }
        else{
          var respuesta = [result.rows.length];
          while(i < result.rows.length ){
            client.query("SELECT * FROM VUELOS WHERE codigo= '"+result.rows[i]+"' AND origen='"+info.origen+"' AND destino='"+info.destino+"' AND fecha='"+info.fecha+"'" ,function(err, result1) {
              i++;
            if(err) {
              return console.error('error running query', err);
            }

            });
          }
        }
            info.state = 200;
            info.superuser = false;
            res.send(info);
            client.end();
          });
        });
    //info.origen
    //info.destino
    //info.fecha
    //info.xml boolean (verdadero xml, falso json)
  }
};

