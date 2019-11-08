var load_Handler = function(callback) {
    if (document.readyState!="loading") callback();
    else if (document.addEventListener) document.addEventListener("DOMContentLoaded", callback);
    else document.attachEvent("onreadystatechange", function(){
        if (document.readyState=="complete") callback();
    });
};

var silent_Handler = function(target_url) {
    return function() {
        
        
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";

        xhr.onload = function(e) {
            if (xhr.readyState == 4 && this.status == 200) {

                saveAs(new Blob([this.response], {type: "application/vnd.ms-excel"}), "output.xls", true);

            } else {
                // Fail Gracefully
                window.location = target_url;
            }
        };

        xhr.open("GET", target_url);
        xhr.send();
    };
};

var click_Handler = function(target_url) {
    return function() {
        
        let xhr = new XMLHttpRequest();
        xhr.responseType = "blob";

        xhr.onload = function(e) {
            if (xhr.readyState == 4 && this.status == 200) {
                var blob = new Blob([this.response], {type: "application/vnd.ms-excel"});
                let a = document.createElement("a");
                a.style = "display: none";
                document.body.appendChild(a);
                let url = window.URL.createObjectURL(blob);
                a.href = url;
                a.target = "_blank";
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                // Fail Gracefully
                window.location = target_url;
            }
        };

        xhr.open('GET', target_url);
        xhr.send();
    };
};

load_Handler(function() {
  
  var _window = window.location.href;
  
  if (
    /legacy\/system\/framework\/desktop.asp/i.test(_window) ||
    /modules\/dailybulletin\/bulletin\/bulletinlist.asp/i.test(_window) ||
    /legacy\/system\/dashboard/i.test(_window) ||
    /modules\/pupilprofiles/i.test(_window) ||
    /senmanager\/register\/list.asp/i.test(_window) ||
    /senmanager\/register\/printpreview.asp/i.test(_window)) {
    
    var _handle_Items = function(items) {
      for (var i = 0; i < items.length; i++) {
        var __text = items[i].innerText;
        if (__text) {
          var __urls = __text.match(/\[([^"]+)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))\)/gi), __expand = false;
          if (!__urls) {
            __urls = items[i].innerText.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gi);
          } else {
            __expand = true;
          }
          if (__urls) {
            for (var j = 0; j < __urls.length; j++) {
              var __substitute = false;
              if (__expand) {
                var __matches = __urls[j].match(/\[([^"]+)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*))\)/i);
                if (__matches.length >= 3) {
                  __substitute = '<a style="color:red;" href="' + __matches[2] + '" target="_blank">' + __matches[1] +'</a>';
                }
              } else {
                __substitute = '<a style="color:red;" href="' + __urls[j] + '" target="_blank">' + __urls[j] +'</a>';
              }
              if (__substitute) items[i].innerHTML = items[i].innerHTML.replace(__urls[j], __substitute);
            }
          }
        }
      }
    };
    
    try {
        
      if (/senmanager\/register\/list.asp/i.test(_window)) {
      
        _handle_Items(document.querySelectorAll("table tbody tr td table tbody tr td table tbody tr td"));
        
      } else if (/modules\/pupilprofiles\/profile\/index/i.test(_window)) {
          
          var d = document;
          var _check = function() {
              try {
                  var a = d.querySelectorAll("td[title='SEND Register Notes:']");
                  if (a && a.length == 1) {
                      _handle_Items(a[0].parentNode.getElementsByTagName("TD"));
                  }
                  else {
                      setTimeout(_check, 1000);
                  }
              }
              catch (e) {
                  console.log("iSAMS Extension", e);
              }
          };
      
          if (d.querySelectorAll) setTimeout(_check, 1000);
      
      } else {
       
          // -- Parse all the Daily Bulletin Links -- //
          var ID = "bulletinlist",
              DATA = "datadiv",
              IDS = "bulletin",
            _handle_Item = function(item) {
              var _divs = item.getElementsByTagName("div");
              if (!_divs || _divs.length === 0) _divs = item.getElementsByTagName("TD");
              _handle_Items(_divs);
            },
            _handle_Bulletin = function(bulletin) {
              var _items = bulletin.getElementsByTagName("TR");
              if ((!_items || _items.length === 0) && document.querySelectorAll) {
                _handle_Items(bulletin.querySelectorAll("div.body"));
                bulletin.querySelectorAll("div.title").forEach(function(node) {
                	node.style.overflow = "hidden";
                });
                //overflow: hidden;
              } else {
                for (var i = 0; i < _items.length; i++) _handle_Item(_items[i]);
              }
            };
    
          var __bulletin = document.getElementById(ID);
          
          if (__bulletin && __bulletin.childNodes.length >= 1 &&
              (__bulletin.childNodes[0].nodeName == "TABLE")) {
            
            _handle_Bulletin(__bulletin);
    
          } else {
    
            __bulletin = document.getElementById(DATA);
            
            if (__bulletin && __bulletin.getElementsByTagName("table") &&
                __bulletin.getElementsByTagName("table").length >= 1) {
                
              _handle_Bulletin(__bulletin);
              
            } else {
              
              if (document.querySelectorAll)
                __bulletin = document.querySelectorAll("tab[name='Daily Bulletin'] div.content.list");
              
              if (__bulletin.length >= 1) _handle_Bulletin(__bulletin);
    
              var config = {
                childList: true
                , subtree: true
                , attributes: false
                , characterData: false
              };
    
              var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (!mutation.addedNodes) return
                  for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.id == ID || (node.parentNode && node.parentNode.id == ID)) {
                      _handle_Bulletin(node);
                    } else if (node.nodeName == "TD" && node.id && node.id.startsWith(IDS)) {
                      _handle_Item(node);
                    } else if (node.nodeName == "TABLE" && node.classList.contains("LinedList")) {
                      _handle_Bulletin(node);
                    } else if (node.nodeName == "WIDGET" &&
                               node.parentElement.getAttribute("name") == "Daily Bulletin") {
                      _handle_Bulletin(node);
                    } else if (node.nodeName == "DIV" &&
                               node.classList.contains("widget") &&
                               node.parentElement.parentElement.getAttribute("name") == "Daily Bulletin") {
                      _handle_Bulletin(node);
                    }
                  }
                })
              });
    
              observer.observe(document.body, config);
              
            }
            
          }
      }
      
    } catch (e) {
      console.log("iSAMS Extension", e);
    }
      
  }

  // -- Grab all the Link Elements to check -- //
  var __links = document.getElementsByTagName("a");

  // -- Look through looking for our specified element -- //
  for (var i = 0; i < __links.length; i++) {

      if (__links[i].hasAttribute("href") && __links[i].getAttribute("href").indexOf("actionforcedownload.aspx") > 0 && __links[i].getAttribute("href").indexOf(".xls") > 0) { // Handles Grade Matrix / Totals Downloads

          var _element = __links[i];
          var _url = __links[i].getAttribute("href");
          _url = _url.substring(_url.indexOf("actionforcedownload.aspx"));
          _url = _url.substring(0, _url.lastIndexOf("'"));
          _url = "https://" + window.location.hostname + "/Legacy/system/common/" + _url;

          // Log the URL to the Console.
          console.log("LIST DOWNLAD URL: ", _url);

          // Remove the default handler
          _element.setAttribute("href", "#");

          // Add the new handler
          _element.addEventListener("click", silent_Handler(_url));

          break;

      } else if (__links[i].hasAttribute("href") && __links[i].getAttribute("href").indexOf("actionforcedownload.asp") === 0) { // Handles More General Reports

          var _element = __links[i];
          var _url = __links[i].getAttribute("href");
          _url = "https://" + window.location.hostname + "/Legacy/system/common/" + _url;

          // Log the URL to the Console.
          console.log("LIST DOWNLOAD URL: ", _url);

          // Remove the default handler
          _element.setAttribute("href", "#");

          // Add the new handler
          _element.addEventListener("click", silent_Handler(_url));

          break;

      } else if (__links[i].hasAttribute("title") && __links[i].getAttribute("href") == "#" && (
              __links[i].textContent == "CLICK HERE to Download the Microsoft Excel Document containing the Report" || // Handles Set Lists Exports
              __links[i].textContent == "Download Excel Timetable" // Handles Timetable Exports
          )) {

          var _element = __links[i].parentElement;

          while (_element && _element.nodeName != "TR") {
              _element= _element.parentElement;
          }

          if (_element && _element.hasAttribute("onclick")) {
              var _command = _element.getAttribute("onclick");
              var _match = new RegExp("'([^' ]*)'", "g");
              var _matches = _match.exec(_command);
              var _url;
              if (_matches && _matches.length > 0) {
                  for (var j = 0; j < _matches.length; j++) {
                      if (_matches[j].indexOf("/Legacy/") === 0) { // Full Legacy Generate
                        	console.log("ORIGINAL URL: ", _matches[j]);
                          _url = _matches[j]
                            	.replace(new RegExp("x252F", "g"), "/")
                            	.replace(new RegExp("x2F", "g"), "/")
                            	.replace(/\\/g, "");
                          _url = "https://" + window.location.hostname + _url;
                        	console.log("TRANSFORMED URL: ", _url);
                          break;
                      } else if (_matches[j].indexOf("x2Ffiles") === 1) { // Timetable Manager Generate
                        	console.log("ORIGINAL URL: ", _matches[j]);
                          _url = _matches[j]
                        			.replace(new RegExp("x252F", "g"), "/")
                            	.replace(new RegExp("x2F", "g"), "/")
                            	.replace(/\\/g, "");
                          _url = "https://" + window.location.hostname + _url;
                        	console.log("TRANSFORMED URL: ", _url);
                          break;
                      }
                  }
              }
              if (_url) {

                  // Log the URL to the Console.
                  console.log("LIST DOWNLAD URL: ", _url);

                  // Remove the default handler
                  _element.removeAttribute("onclick");

                  // Add the new handler
                  _element.addEventListener("click", silent_Handler(_url));

              }

          }

          break;
      }
  }
  
});