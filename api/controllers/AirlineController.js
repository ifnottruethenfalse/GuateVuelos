/**
 * AirlineController
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
    
  
  /**
   * Action blueprints:
   *    `/airline/edit`
   */
   edit: function (req, res) {
    var info = req.body.params;
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("UPDATE AEROLINEAS SET nombre='"+info.nombre+"', host='"+info.host+"', ext='"+info.ext+"' WHERE codigo='"+info.codigo+"'", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        client.query("SELECT * FROM AEROLINEAS", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result.rows);
        });
      });
    });
  },


  /**
   * Action blueprints:
   *    `/airline/delete`
   */
   delete: function (req, res) {
    var info = req.body.params;
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("DELETE FROM AEROLINEAS WHERE codigo='"+info.codigo+"'", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        client.query("SELECT * FROM AEROLINEAS", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result.rows);
        });
      });
    });
    
  },


  /**
   * Action blueprints:
   *    `/airline/add`
   */
   add: function (req, res) {
    
    var info = req.body.params;
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("SELECT codigo FROM AEROLINEAS WHERE codigo='"+info.codigo+"';", function(err, result) {
        if(err) {
          return console.error('error running query codigo de AEROLINEA existente', err);
        }
        if(result.rows.length >= 1){
           res.json({state:0});
        }
        else{
          var query = client.query("INSERT INTO AEROLINEAS VALUES('"+info.codigo+"','"+info.nombre+"','"+info.host+"', '"+info.ext+"');", function(err, result) {
            if(err) {
              return console.error('error running query', err);
            }
            res.send(info);
          });
        }
      });
    });
  },


  /**
   * Action blueprints:
   *    `/airline/getairlines`
   */
  getairlines: function (req, res) {
    var conString = "pg://postgres:cris12345@localhost:5432/GuateVuelos";
    var client = new pg.Client(conString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      var query = client.query("SELECT * FROM AEROLINEAS", function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result.rows);
      });
    });
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AirlineController)
   */
  _config: {}

  
};
