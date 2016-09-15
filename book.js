"use strict";

// This script adds the “invariants” of every page of this
// website.
//
// We can use javascript to generate vital parts of the site,
// as this site is useless without javascript anyway.
//
// This script break some common practices: we modify the DOM
// before we finished loading, we rely on implicit script/event
// execution order… It works, but only in this instance. Kids,
// don’t do this at home!

// This script needs to know where is the root of the website
// (where will it find the javascript, the CSS and such).
var root = "./";

// It also needs to know its own name, so that it can read the
// “data-root” attribute of its own script tag, and set the
// root variable to a sensible value.
var scriptName = "book.js";

// Adding a CSS to the page.
function addCss(name) {
    var el = document.createElement("link");
    el.setAttribute("rel", "stylesheet");
    el.setAttribute("type", "text/css");
    el.setAttribute("href", root + name);
    document.head.appendChild(el);
}

// Adding a script to the page.
function addJs(name) {
    var el = document.createElement("script");
    el.setAttribute("src", root + name);
    document.head.appendChild(el);
}

// Setup the root variable so that we can find the files.
function setRoot() {
    // Find this script in the page
    var script, re = new RegExp("/" + scriptName + "$");
    for (var i = 0; i < document.scripts.length; i++) {
        script = document.scripts[i];
        if(re.test(script.src)) {
            break;
        }
    }
    // Set the root if the script has a “data-root” attribute.
    var dataRoot = script.getAttribute("data-root");
    if (dataRoot !== null) {
        root = dataRoot;
    }
    return
}

// Reproduce the nav element from the top of the page, to the
// bottom of the page. If there is one (there are none on the
// “navigation.html” page, for instance).
function reproduceNav() {
    var nav = document.querySelector("nav");
    if (nav === null) return;
    document.body.appendChild(nav.cloneNode(true));
}

// On this website, the pages have everything translated, so
// we add the lojban class to the body.
function addLojbanClass() {
    document.body.classList.add("lojban");
}

// We do not execute this after load. The reason being: all we
// need has already been loaded at this point, and when
// inserting scripts, they will lose the ability to respond to
// the “onload” event if we load them this late. So we insert
// them as soon as we load this script, and then the page
// finish loading, and then they can respond to the event :-).
setRoot();
addCss("book.css");
addCss("jbogidva.css");
addJs("jbogidva.js");

// These parts need to be executed after load, however. They
// are also executed before the “onload” of “jbogidva.js”,
// because we loaded this script first. Thank god, what a
// headache it could have been otherwise.
window.addEventListener("load", function () {
    reproduceNav();
    addLojbanClass();
});