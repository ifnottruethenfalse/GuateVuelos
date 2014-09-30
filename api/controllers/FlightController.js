/**
 * FlightController
 *
 * @description :: Server-side logic for managing flights
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `FlightController.search()`
   *  Descripcion: Busca en las bases de datos las aereolineas para luego ejecutar los scripts de cada una.
   *  Devuelve: Un Arreglo con este formato:
   *       [{"aereolina":maya,"vuelos":[{ ... }], ... ]
   */
  search: function (req, res) {
    var info = req.body.params;
    //info.origen
    //info.destino
    //info.fecha
    //info.xml boolean (verdadero xml, falso json)

    

    return res.json({
      todo: 'search() is not implemented yet!'
    });
  }
};

