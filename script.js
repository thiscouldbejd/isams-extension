var s1 = document.createElement("script");
s1.src = chrome.extension.getURL("FileSaver.js");
s1.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s1);

var s2 = document.createElement("script");
s2.src = chrome.extension.getURL("open.js");
s2.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s2);