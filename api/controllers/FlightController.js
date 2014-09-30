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
      var query = client.query("SELECT codigo, nombre FROM AEROLINEAS", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        if(result.rows.length < 1){
           res.json({state:0}); // Te envio 0 "no hay aerolineas en la base de datos."
        }
        else{
          var respuesta = [result.rows.length];
          while(i < result.rows.length ){
            if(info.xml){
              $http({method: 'GET', url: "http://'"+result.rows[i].nombre+"'/script_lista_vuelos?origen='"+info.origen+"'&destino='"+info.destino+"'&fecha='"+info.fecha+"'&type='"+info.xml+"',type=XML"}).
                success(function(data, status, headers, config) {
                  respuesta[i] = "<lista_vuelos>\n<aerolinea>'"+result.rows[i].nombre+"'</aerolinea>\n<vuelo>'"+data.vuelo+"'</vuelo>\n<lista_vuelos>";
               //XML
              }).
                error(function(data, status, headers, config) {
                res.json({state:0}); 
                });
            }
            else{
              $http({method: 'GET', url: "http://'"+result.rows[i].nombre+"'/script_lista_vuelos?origen='"+info.origen+"'&destino='"+info.destino+"'&fecha='"+info.fecha+"'&type='"+info.xml+"',type=JSON"}).
                success(function(data, status, headers, config) {
                  respuesta[i] = "{\"aerolinea\":'"+result.rows[i].nombre+"',\"vuelo\":[{'"+data.vuelo+"'}]}";
               //JSON
              }).
                error(function(data, status, headers, config) {
                res.json({state:0}); 
                });
            }
            i++;
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

