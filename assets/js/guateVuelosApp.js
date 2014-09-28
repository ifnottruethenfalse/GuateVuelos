var gvApp = angular.module("gvApp", ["ngMaterial","ui.date",'ui.mask']); // array is require

gvApp.controller("gvAppCtrl",['$scope','$materialDialog','$http','xml2json', function ($scope,$materialDialog,$http,xml2json){
  $scope.selectedIndex = 0;
  $scope.user={
    login:false    
  };
  $scope.xml=true;
  $scope.$on('user',function(event,user){
    $scope.user = user;
    console.log($scope.user);
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
              console.log(user);
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
}]);

gvApp.controller("billetCtrl",['$scope','$http','$materialDialog', function ($scope,$http,$materialDialog){
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
          $scope.onSearch = false;
          console.log(response);
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