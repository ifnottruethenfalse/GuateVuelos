/**
 * FlightController
 *
 * @description :: Server-side logic for managing flights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var pg = require("pg");
var http = require("http");
module.exports = {
	


  /**
   * `FlightController.search()`
   *  Descripcion: Busca en las bases de datos las aereolineas para luego ejecutar los scripts de cada una.
   *  Devuelve: Un Arreglo con este formato:
   *       [{"aereolina":maya,"vuelos":[{ ... }], ... ]
   */
  search: function (req, res) {
    var info = req.body.params;
    var type = info.xml? "XML" : "JSON";
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    var respuesta = [];
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("SELECT * FROM AEROLINEAS", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        for (var i = 0; i < result.rows.length; i++) {
          result.rows[i].codigo = result.rows[i].codigo.trim();
          result.rows[i].ext = result.rows[i].ext.trim();
          result.rows[i].host = result.rows[i].host.trim();
          result.rows[i].nombre = result.rows[i].nombre.trim(); 
        }
        var asycFor = function (i) {
          var url = "http://"+result.rows[i].host+"/script_lista_vuelos."+result.rows[i].ext+"?destino="+info.destino+"&fecha="+info.fecha+"&origen="+info.origen+"&type="+type; 
          console.log(url);
          http.get(url, function(response) {
            console.log("Got response: ");
            response.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
              //if (info.xml) {
                /*var xml = res.data.lista_vuelos,
                dom = xml2json.parseXml(xml),
                json = xml2json.xml2json(dom);
                json.host = airlines[i].host;
                json.ext = airlines[i].ext;
                json.type = params.type;
                flightLists.push(json);*/
              //} else {
              //  if (chunk.lista_vuelos) {
              //    respuesta.push(chunk.lista_vuelos);  
              //  }
                if (chunk.lista_vuelos) {
                  respuesta.push(chunk.lista_vuelos);  
                }  
              });
              
              if (i != result.rows.length - 1) {
                asycFor(i+1);
              } else {
                console.log(respuesta);
                res.send(respuesta);
              }
          }).on('error', function(e) {
            console.log("Got error: " + e.message);
          });
        }
        if (result.rows.length != 0) {
          asycFor(0);
        }
        client.end();
      });
    });
  }
};

