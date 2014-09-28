/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	signup : function (req, res) {
    // body...
    var info = req.body.params;

    res.json({status:200});
  },
  signin : function (req, res) {
    // body...
    var info = req.body.params;

    res.json({status:200});
  }
};

