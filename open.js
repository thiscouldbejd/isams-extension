var ___handler = function(target_url) {
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

        xhr.open('GET', target_url);
        xhr.send();
    };
};


var __handler = function(target_url) {
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
    }
};

// -- Grab all the Link Elements to check -- //
var __links = document.getElementsByTagName("a");

// -- Look through looking for our specified element -- //
for (var i = 0; i < __links.length; i++) {
    

    if (__links[i].hasAttribute("href") && __links[i].getAttribute("href").indexOf("actionforcedownload.asp") === 0) { // Handles More General Reports
    
        var _element = __links[i];
        var _url = __links[i].getAttribute("href");
        _url = "https://" + window.location.hostname + "/Legacy/system/common/" + _url;
        
        // Log the URL to the Console.
        console.log("LIST DOWNLAD URL: ", _url);
                
        // Remove the default handler
        _element.setAttribute("href", "#");

        // Add the new handler
        _element.addEventListener("click", ___handler(_url));
        
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
                        _url = _matches[j].replace(new RegExp("x2F", "g"), "/").replace(/\\/g, "");
                        _url = "https://" + window.location.hostname + _url;
                        break;
                    } else if (_matches[j].indexOf("x2Ffiles") === 1) { // Timetable Manager Generate
                        _url = _matches[j].replace(new RegExp("x2F", "g"), "/").replace(/\\/g, "");
                        _url = "https://" + window.location.hostname + _url;
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
                _element.addEventListener("click", ___handler(_url));
                
            }
            
        }
        
        break;
    }
}