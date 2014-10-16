var gvApp = angular.module("gvApp", ["ngMaterial","ui.date",'ui.mask','ui.select2']); // array is require

gvApp.controller("gvAppCtrl",['$scope','$materialDialog','$http','xml2json', function ($scope,$materialDialog,$http,xml2json){
  $scope.selectedIndex = 0;
  $scope.user={
    login:false    
  };
  $scope.xml=true;
  $scope.$on('user',function(event,user){
    $scope.user = user;
  });
  /*var params = {address: "guate", sensor: false};
  $http.get(
      'http://maps.googleapis.com/maps/api/geocode/xml',
      {params: params}
    ).then(function(response) {
      var xml = response.data,
      dom = xml2json.parseXml(xml),
      json = xml2json.xml2json(dom);
    });*/
  $scope.signUp = function (e) {
    $materialDialog({
      templateUrl: 'partials/sign-up.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.save = function () {
          if($scope.signUp.$valid) {
            var params = {
              username: $scope.username, 
              password: $scope.password,
              name: $scope.nombre,
              lastName: $scope.apellido,
              email: $scope.email,
              documento: $scope.ddv,
              nit: $scope.nit,
              tarjeta: $scope.tdc
            };
            $http.post(
              '/signup',
              {params: params}
            ).then(function(response) {
              var user = response.data;
              if (user.state == 0) {
                $scope.wrongUsername = true;
              } else {
                user.login = true;
                $rootScope.$broadcast('user',user);
                $hideDialog();
              } 
            });
          }
        }
      }]
    });
  };
  $scope.signIn = function (e) {
    $materialDialog({
      templateUrl: 'partials/sign-in.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.login = function () {
          if($scope.signUp.$valid) {
            var params = {
              username: $scope.username, 
              password: $scope.password,
            };
            $http.post(
              '/signin',
              {params: params}
            ).then(function(response) {
              var user = response.data;
              if (user.state == 0) {
                $scope.wrongUsername = true;
              } else {
                user.login = true;
                $rootScope.$broadcast('user',user);
                $hideDialog();
              } 
            });
          }
        }
      }]
    });
  };
  $scope.logOut = function () {
    $scope.user={
      login:false    
    };
    $scope.selectedIndex = 0;
  }
  $scope.configure = function (e) {
    $materialDialog({
      templateUrl: 'partials/configure.html',
      targetEvent: e,
      locals: {
        user: $scope.user
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','user', function($scope, $hideDialog, $http,$rootScope,user) {
        $scope.username=user.username.trim();
        $scope.password=user.password.trim();
        $scope.nombre=user.name.trim();
        $scope.apellido=user.lastName.trim();
        $scope.email=user.email.trim();
        $scope.ddv=user.documento.trim();
        $scope.nit=user.nit.trim();
        $scope.tdc=user.tarjeta.trim();
        $scope.close = function() {
          $hideDialog();
        };
        $scope.save = function () {
          console.log($scope.config.$valid)
          if($scope.config.$valid) {
            var params = {
              username: $scope.username, 
              password: $scope.password,
              name: $scope.nombre,
              lastName: $scope.apellido,
              email: $scope.email,
              documento: $scope.ddv,
              nit: $scope.nit,
              tarjeta: $scope.tdc
            };
            $http.post(
              '/configure',
              {params: params}
            ).then(function(response) {
              var user = response.data;
              user.login = true;
              $rootScope.$broadcast('user',user);
              $hideDialog();
            });
          }
        }
      }]
    });
  };
}]);
gvApp.controller("billetCtrl",['$scope','$http','$materialDialog', function ($scope,$http,$materialDialog){
  $scope.places = [];
  $http.post(
      'getairport'
    ).then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        $scope.places.push(response.data[i].place);
      }
    });
  $scope.$on('newAirport',function(event,airline){
    $scope.places.push(airline.place);
    console.log($scope.places);
  });
  $scope.searchFlight = function(e) { 
    $materialDialog({
      templateUrl: 'partials/search-flights.html',
      targetEvent: e,
      locals: {
        info: {
          fecha:$scope.fecha,
          origen: $scope.origen,
          destino: $scope.destino,
          xml: $scope.xml
        }      
      },
      controller: ['$scope', '$hideDialog','$http','info', function($scope, $hideDialog, $http, info) {
        $scope.onSearch = true;
        Date.prototype.yyyymmdd = function() {
         var yyyy = this.getFullYear().toString();
         var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
         var dd  = this.getDate().toString();
         return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
        };
        var f = info.fecha.yyyymmdd();
        var params = {
          origen: info.origen, 
          destino: info.destino,
          fecha: f,
          xml: info.xml
        };
        return $http.post(
          '/searchflight',
          {params: params}
        ).then(function(response) {
          console.log(response);
          $scope.onSearch = false;
        });
        $scope.close = function() {
          $hideDialog();
        };
        $scope.next = function () {
          
        }
      }]
    });
  };
  
  /*$scope.disabled = undefined;

  $scope.enable = function() {
    $scope.disabled = false;
  };

  $scope.disable = function() {
    $scope.disabled = true;
  };

  $scope.clear = function() {
    $scope.person.selected = undefined;
    $scope.address.selected = undefined;
    $scope.country.selected = undefined;
  };

  $scope.address = {};
  $scope.refreshAddresses = function(address) {
    var params = {address: address, sensor: false};
    return $http.get(
      'http://maps.googleapis.com/maps/api/geocode/json',
      {params: params}
    ).then(function(response) {
      $scope.addresses = response.data.results
    });
  };*/
}]);
gvApp.controller("superuserCtrl",['$scope','$materialDialog','$http',function ($scope,$materialDialog,$http){
  $http.post(
      'getairline'
    ).then(function(response) {
      $scope.airlines = response.data;
    });
  $scope.$on('newAirline',function(event,airline){
    $scope.airlines.push(airline);
  });
  $scope.$on('newAirlines',function(event,airlines){
    $scope.airlines = airlines;
  });
  $scope.add = function (e) {
    $materialDialog({
      templateUrl: 'partials/addAirline.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.add = function () {
          if($scope.addAirline.$valid) {
            var params = {
              codigo: $scope.codigo, 
              nombre: $scope.nombre,
              host: $scope.host,
              ext: $scope.ext
            };
            $http.post(
              '/addairline',
              {params: params}
            ).then(function(response) {
              var airline = response.data;
              if (airline.state == 0) {
                $scope.wrongCode = true;
              } else {
                $rootScope.$broadcast('newAirline',airline);
                $hideDialog();
              } 
            });
          }
        }
      }]
    });
  }
  $scope.edit = function (e,airline) {
    $materialDialog({
      templateUrl: 'partials/editAirline.html',
      targetEvent: e,
      locals: {
        airline: airline
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airline', function($scope, $hideDialog, $http,$rootScope,airline) {
        $scope.codigo = airline.codigo.trim();
        $scope.nombre = airline.nombre.trim();
        $scope.host = airline.host.trim();
        $scope.ext = airline.ext.trim();
        $scope.close = function() {
          $hideDialog();
        };
        $scope.edit = function () {
          if($scope.editAirline.$valid) {
            var params = {
              codigo: $scope.codigo, 
              nombre: $scope.nombre,
              host: $scope.host,
              ext: $scope.ext
            };
            $http.post(
              '/editairline',
              {params: params}
            ).then(function(response) {
              console.log(response);
              var airlines = response.data;
              $rootScope.$broadcast('newAirlines',airlines);
              $hideDialog();
            });
          }
        }
      }]
    });
  }
  $scope.delete = function (e,airline) {
    $materialDialog({
      templateUrl: 'partials/deleteAirline.html',
      targetEvent: e,
      locals: {
        airline: airline
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airline', function($scope, $hideDialog, $http,$rootScope,airline) {
        $scope.codigo = airline.codigo;
        $scope.nombre = airline.nombre;
        $scope.host = airline.host;
        $scope.ext = airline.ext;
        $scope.close = function() {
          $hideDialog();
        };
        $scope.delete = function () {
          var params = {
            codigo: $scope.codigo, 
            nombre: $scope.nombre,
            host: $scope.host,
            ext: $scope.ext
          };
          $http.post(
            '/deleteairline',
            {params: params}
          ).then(function(response) {
            var airlines = response.data;
            $rootScope.$broadcast('newAirlines',airlines);
            $hideDialog();
          });
        }
      }]
    });
  }

}]);

gvApp.controller("superuserAirportCtrl",['$scope','$materialDialog','$http',function ($scope,$materialDialog,$http){
  $http.post(
      'getairport'
    ).then(function(response) {
      $scope.airports = response.data;
    });
  $scope.$on('newAirport',function(event,airport){
    $scope.airports.push(airport);
  });
  $scope.$on('newAirports',function(event,airports){
    $scope.airports = airports;
  });
  $scope.add = function (e) {
    $materialDialog({
      templateUrl: 'partials/addAirport.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog','$http','$rootScope', function($scope, $hideDialog, $http,$rootScope) {
        $scope.close = function() {
          $hideDialog();
        };
        $scope.add = function () {
          console.log("add")
          if($scope.addAirport.$valid) {
            console.log("add valid")
            var params = {
              id: $scope.id, 
              name: $scope.name,
              place: $scope.place
            };
            $http.post(
              '/addairport',
              {params: params}
            ).then(function(response) {
              var airport = response.data;
              if (airport.state == 0) {
                $scope.wrongCode = true;
              } else {
                $rootScope.$broadcast('newAirport',airport);
                $hideDialog();
              } 
            });
            console.log("post")
          }
        }
      }]
    });
  }
  $scope.edit = function (e,airport) {
    $materialDialog({
      templateUrl: 'partials/editAirport.html',
      targetEvent: e,
      locals: {
        airport: airport
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airport', function($scope, $hideDialog, $http,$rootScope,airport) {
        $scope.id = airport.id.trim();
        $scope.name = airport.name.trim();
        $scope.place = airport.place.trim();
        $scope.close = function() {
          $hideDialog();
        };
        $scope.edit = function () {
          console.log("aqui")
          if($scope.editAirport.$valid) {
            console.log("alla")
            var params = {
              id: $scope.id, 
              name: $scope.name,
              place: $scope.place
            };
            $http.post(
              '/editairport',
              {params: params}
            ).then(function(response) {
              console.log(response);
              var airports = response.data;
              $rootScope.$broadcast('newAirports',airports);
              $hideDialog();
            });
            console.log("asaber")
          }
        }
      }]
    });
  }
  $scope.delete = function (e,airport) {
    $materialDialog({
      templateUrl: 'partials/deleteAirport.html',
      targetEvent: e,
      locals: {
        airport: airport
      },
      controller: ['$scope', '$hideDialog','$http','$rootScope','airport', function($scope, $hideDialog, $http,$rootScope,airport) {
        $scope.id = airport.id;
        $scope.name = airport.name;
        $scope.place = airport.place;
        $scope.close = function() {
          $hideDialog();
        };
        $scope.delete = function () {
          var params = {
            id: $scope.id, 
            name: $scope.name,
            place: $scope.place
          };
          $http.post(
            '/deleteairport',
            {params: params}
          ).then(function(response) {
            var airports = response.data;
            $rootScope.$broadcast('newAirports',airports);
            $hideDialog();
          });
        }
      }]
    });
  }

}]);
gvApp.controller('autosCtrl',function($scope){
  this.products = cars;
  $this.reservar = function(e){
    if ($scope.user.login) {
      //reserva
    } else {
      $scope.signIn(e);
    }
  }
});
gvApp.controller('HotelesCtrl',function($scope){
  this.products = hoteles;
  this.reservar = function(e){
    if ($scope.user.login) {
      //reserva
    } else {
      $scope.signIn(e);
    }
  }
});
gvApp.controller('PackCtrl',function($scope, $http){
  this.products = paquetes;
  this.reservar = function(e){
    if ($scope.user.login) {
      var params = {
              username: $scope.username, 
              description: $scope.description,
              paquete: $scope.paquete,
              precio: $scope.precio,
            }
            $http.post(
              '/reservacion',
              {params: params}
            ).then(function(response) {
              $scope.success = true;

            });
    } else {
      $scope.signIn(e);
    }
  }
});
gvApp.controller('ToursCtrl',function($scope){
  this.products = tours;
  this.reservar = function(e){
    if ($scope.user.login) {
      //reserva
    } else {
      $scope.signIn(e);
    }
  }
});
gvApp.controller('SupportCtrl',function($scope, $http){
  $scope.add = function () {
          if($scope.support.$valid) {
            var params = {
              name: $scope.name, 
              description: $scope.description,
            }
            $http.post(
              '/support',
              {params: params}
            ).then(function(response) {
              $scope.success = true;

            });
          }
  }
});
var cars = [{
              marca: 'Toyota Echo or Similar',
              pack: "Standard Package - Price includes: Unlimited Kilometers, Primary Liability Insurance and Local Taxes.",
              price: 'US$93.13',
              image: 'images/toyota_echo.jpg'
           },
           {
              marca: 'Suzuki Maruti or Similar',
              pack: "Standard package - Price includes unlimited mileage, primary liability insurance and local taxes",
              price: 'US$73.29',
              image: 'images/suzuki_maruti.jpg'
           },
           {
              marca: 'Nissan Sentra or Similar',
              pack: "Standard Package - Price includes: Unlimited Kilometers, Primary Liability Insurance and Local Taxes.",
              price: 'US$105.26',
              image: 'images/sentra_lrg.jpg'
           },
           {
              marca: 'Mitsubishi Lancer or Similar',
              pack: "Standard Package - Price includes: Unlimited Kilometers, Primary Liability Insurance and Local Taxes.",
              price: 'US$121.94',
              image: 'images/mitsubishi_lancer.jpg'
           }];
var hoteles = [{
              Hotel: 'Silken Al-Andalus Palace',
              pack: "El Silken Al-Andalus Palace se encuentra a solo 10 minutos en coche del centro histórico de Sevilla. Dispone de gimnasio, salón de belleza, piscina al aire libre, terrazas, jardines y zonas amplias al aire libre para relajarse.",
              price: 'US$57',
              image: 'images/sevillahotel.jpg'
           },
           {
              Hotel: 'Park Plaza Westminster Bridge London, Londres ',
              pack: "El Park Plaza Westminster Bridge London se encuentra frente al Parlamento y el Big Ben, en la ribera sur de Londres. Además, está cerca de la noria London Eye, el acuario, así como diversos restaurantes y teatros.",
              price: 'US$73.29',
              image: 'images/London.jpg'
           },
           {
              Hotel: 'La Scelta Di Goethe - Luxury Suites, Roma',
              pack: "La Scelta Di Goethe - Luxury Suites se encuentra en la importante calle Via del Corso y ofrece un servicio de mayordomo las 24 horas.",
              price: 'US$1.824',
              image: 'images/Bellagio.jpg'
           },
           {
              Hotel: 'Adagio Paris Tour Eiffel, París',
              pack: "Este aparthotel está situado a 20 minutos a pie de la Torre Eiffel y ofrece alojamiento en estudios y apartamentos con aire acondicionado y vistas panorámicas a París, conexión Wi-Fi gratuita, acceso gratuito a una piscina climatizada cubierta y centro de fitness de uso gratuito.",
              price: 'US$121.94',
              image: 'images/Paris.jpg'
           }];
var tours = [{
              promocion: 'BlackFriday Panama',
              pack: "Incluye: Boleto aéreo Guatemala / Panamá / Guatemala. Traslados aeropuerto / Hotel / aeropuerto. Impuestos de salida de Guatemala. Impuestos de salida de Panamá. 03 noches de alojamiento en hotel a elegir con desayuno. Impuestos hoteleros.",
              price: 'US$544.00',
              image: 'images/Panama.jpg'
           },
           {
              promocion: 'Charters a Orlando Fin de Año',
              pack: "Charters a Orlando fin de año 2014, llegando al aeropuerto más eficiente de Florida Central. Con derecho a 3-4 maletas por persona. 8 días, 07 noches. ",
              price: 'US$ 694.00',
              image: 'images/orlando.jpg'
           }];
var paquetes = [{
              promocion: 'Habitacion 2 x 1',
              pack: "En cualquier hotel marriot de cualquier localidad.",
              price: 'US$30.00',
              image: 'images/2x1.png'
           },
           {
              promocion: 'Alquila tu carro y obten descuento',
              pack: "Aplican solo para modelos recientes (2010 en adelante)",
              price: 'US$40.00',
              image: 'images/Descuento.png'
           }];

gvApp.factory('xml2json',function(){
  return {
    parseXml:function(xml) {
     var dom = null;
     if (window.DOMParser) {
        try { 
           dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
        } 
        catch (e) { dom = null; }
     }
     else if (window.ActiveXObject) {
        try {
           dom = new ActiveXObject('Microsoft.XMLDOM');
           dom.async = false;
           if (!dom.loadXML(xml)) // parse error ..

              window.alert(dom.parseError.reason + dom.parseError.srcText);
        } 
        catch (e) { dom = null; }
     }
     else
        alert("cannot parse xml string!");
     return dom;
   },
   xml2json:function(xml, tab) {
     var X = {
        toObj: function(xml) {
           var o = {};
           if (xml.nodeType==1) {   // element node ..
              if (xml.attributes.length)   // element with attributes  ..
                 for (var i=0; i<xml.attributes.length; i++)
                    o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
              if (xml.firstChild) { // element has child nodes ..
                 var textChild=0, cdataChild=0, hasElementChild=false;
                 for (var n=xml.firstChild; n; n=n.nextSibling) {
                    if (n.nodeType==1) hasElementChild = true;
                    else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                    else if (n.nodeType==4) cdataChild++; // cdata section node
                 }
                 if (hasElementChild) {
                    if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                       X.removeWhite(xml);
                       for (var n=xml.firstChild; n; n=n.nextSibling) {
                          if (n.nodeType == 3)  // text node
                             o["#text"] = X.escape(n.nodeValue);
                          else if (n.nodeType == 4)  // cdata node
                             o["#cdata"] = X.escape(n.nodeValue);
                          else if (o[n.nodeName]) {  // multiple occurence of element ..
                             if (o[n.nodeName] instanceof Array)
                                o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                             else
                                o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                          }
                          else  // first occurence of element..
                             o[n.nodeName] = X.toObj(n);
                       }
                    }
                    else { // mixed content
                       if (!xml.attributes.length)
                          o = X.escape(X.innerXml(xml));
                       else
                          o["#text"] = X.escape(X.innerXml(xml));
                    }
                 }
                 else if (textChild) { // pure text
                    if (!xml.attributes.length)
                       o = X.escape(X.innerXml(xml));
                    else
                       o["#text"] = X.escape(X.innerXml(xml));
                 }
                 else if (cdataChild) { // cdata
                    if (cdataChild > 1)
                       o = X.escape(X.innerXml(xml));
                    else
                       for (var n=xml.firstChild; n; n=n.nextSibling)
                          o["#cdata"] = X.escape(n.nodeValue);
                 }
              }
              if (!xml.attributes.length && !xml.firstChild) o = null;
           }
           else if (xml.nodeType==9) { // document.node
              o = X.toObj(xml.documentElement);
           }
           else
              alert("unhandled node type: " + xml.nodeType);
           return o;
        },
        toJson: function(o, name, ind) {
           var json = name ? ("\""+name+"\"") : "";
           if (o instanceof Array) {
              for (var i=0,n=o.length; i<n; i++)
                 o[i] = X.toJson(o[i], "", ind+"\t");
              json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
           }
           else if (o == null)
              json += (name&&":") + "null";
           else if (typeof(o) == "object") {
              var arr = [];
              for (var m in o)
                 arr[arr.length] = X.toJson(o[m], m, ind+"\t");
              json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
           }
           else if (typeof(o) == "string")
              json += (name&&":") + "\"" + o.toString() + "\"";
           else
              json += (name&&":") + o.toString();
           return json;
        },
        innerXml: function(node) {
           var s = ""
           if ("innerHTML" in node)
              s = node.innerHTML;
           else {
              var asXml = function(n) {
                 var s = "";
                 if (n.nodeType == 1) {
                    s += "<" + n.nodeName;
                    for (var i=0; i<n.attributes.length;i++)
                       s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                    if (n.firstChild) {
                       s += ">";
                       for (var c=n.firstChild; c; c=c.nextSibling)
                          s += asXml(c);
                       s += "</"+n.nodeName+">";
                    }
                    else
                       s += "/>";
                 }
                 else if (n.nodeType == 3)
                    s += n.nodeValue;
                 else if (n.nodeType == 4)
                    s += "<![CDATA[" + n.nodeValue + "]]>";
                 return s;
              };
              for (var c=node.firstChild; c; c=c.nextSibling)
                 s += asXml(c);
           }
           return s;
        },
        escape: function(txt) {
           return txt.replace(/[\\]/g, "\\\\")
                     .replace(/[\"]/g, '\\"')
                     .replace(/[\n]/g, '\\n')
                     .replace(/[\r]/g, '\\r');
        },
        removeWhite: function(e) {
           e.normalize();
           for (var n = e.firstChild; n; ) {
              if (n.nodeType == 3) {  // text node
                 if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                    var nxt = n.nextSibling;
                    e.removeChild(n);
                    n = nxt;
                 }
                 else
                    n = n.nextSibling;
              }
              else if (n.nodeType == 1) {  // element node
                 X.removeWhite(n);
                 n = n.nextSibling;
              }
              else                      // any other node
                 n = n.nextSibling;
           }
           return e;
        }
     };
     if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
     var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
     return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
  }
  } 
});