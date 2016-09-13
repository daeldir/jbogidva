/* LRL Recursive License

   Copyright Dorian Trupin <daeldir@gmail.com> © 2016

   Permission is granted to use, copy, modify and/or distribute
   this work as long as:

       You follow the license

   This license is under LRL Recursive license.

   This software is provided with the guarantee that it will
   fail some day. Use it at your own risk.

   For more details, see https://github.com/daeldir/LRL
*/

// The goal is to have lojban texts enhanced to ease reading
// while learning.
//
// When we mouse over some words, their definition is shown.
// More familiar words may require clicking on them to see the
// definition.
//
// The translation is not generated automatically, but crafted
// by conscientious teachers. They choose which kind of
// definition to give the reader (a formal definition like
// “x1 something x2 to x3”, or a more lax one like “to do”?),
// which part of the sentence to translate (we are not limited
// to words), and which kind of translation to provide (visible
// on mouseover, or only when clicking?).
//
// Help can be nested. So, we can mouse over an expression and
// have it’s whole translation, or over a specific word and
// have the translation of said word only.
//
// We use a text format to define translations: a text beetween
// brackets is a lojban text with translation. The text and
// it’s translation are separated by a vertical bar (“|”) if
// the translation is to be shown when the mouse is over the
// text. They are separated by “~” if we have to click on the
// text to see the translation.
//
// {viska|see}   will show “see” when hovering over “viska”,
// {viska~see}   will show “see” when clicking on “viska”.
//
// Every text in elements with the class “lojban” are parsed.
// The text can contain HTML.

"use strict";

// We can modify the name of these classes if we want to
// integrate the script in a file which already uses these
// classes for something else.
var parseClass = "lojban";
var clickClass = "click";
var hoverClass = "hover";
var structureClass = "structure";
var bubbleClass = "bubble";
var bubbleVisibleClass = "visible";
var toggleStructureClass = "toggle-structure";

// Two elements are “fixed” in our application: the bubble,
// which shows the translation (we only need one because we
// only show one translation at a time), and a button which
// toggle the display of the structure of our translations.
var bubble = document.createElement("div");
var toggle = document.createElement("div");
bubble.className = bubbleClass;
toggle.className = toggleStructureClass;
// Fancy lojban text in the button. “stura” means “structure”.
toggle.innerHTML = "{stura}";
toggle.addEventListener("click", toggleStructure);

// Call f, for each element in the pseudo-array a, with said
// element as a parameter to f. We need this because we have
// many pseudo-arrays in javascript that look like arrays, that
// we want to use like arrays, but that do not have the methods
// of arrays.
function each(a, f) {
    Array.from(a).forEach(f);
}

// Query the dom and perform an operation “f” on each node
// returned. The first argument is optional, in which case the
// query is performed on “document”.
function eachQuery(el, query, f) {
    if (f === undefined) {
        f = query;
        query = el;
        el = document;
    }
    each(el.querySelectorAll(query), f);
}

// preventDefault is really a mess. But if we
// “return prevented(e);”, we should manage to stop
// propagation.
function prevented(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
}

// Parse a text. It returns an array of expressions. An
// expression is either:
//  - plain text
//  - a node
// A node has three attributes:
//  - its text (an inner array of expressions)
//  - its translation (plain text, with maybe some HTML)
//  - its type (hover or click)
function parse(text) {
    return parseText(0, text).r;
}

// Pseudo-PEG to help think about the parser:
// text ← (expression / plain)*
// plain ← anything except "{", "|", "~", and "}" unless
//         escaped by "\"
// expression ← "{" text separator plain "}"
// separator ← "|" / "~"

// text ← (expression / plain)*
function parseText(i, t) {
    var result = [], tmp;
    while (i < t.length) {
        tmp = parseExpression(i, t);
        if (tmp.r === false) {
            tmp = parsePlain(i, t);
            if (tmp.r === false) {
                break;
            }
        }
        i = tmp.i;
        result.push(tmp.r);
    }
    return {i: i, r: result};
}

// plain ← anything except "{", "|", "~", and "}" unless
//         escaped by "\"
function parsePlain(i, t) {
    var result = "";
    var oldI = i;
    while (i < t.length) {
        var c = t[i];
        if (c === "\\") {
            i += 1;
            c = t[i]
        } else if (c === "{" || c === "}" ||
                   c === "|" || c === "~") {
            break;
        }
        result += c;
        i += 1;
    }
    if (i === oldI) {
        return {i: i, r: false};
    }
    return {i: i, r: result};
}

// expression ← "{" text separator plain "}"
function parseExpression(i, t) {
    var result = {}, tmp;
    if (t[i] !== "{") {
        return {i: i, r: false};
    }
    tmp = parseText(i + 1, t);
    result.expression = tmp.r;
    tmp = parseSeparator(tmp.i, t);
    result.type = tmp.r;
    tmp = parsePlain(tmp.i, t);
    result.translation = tmp.r;
    return {i: tmp.i+1, r: result};
}

// separator ← "|" / "~"
function parseSeparator(i, t) {
    var result = [];
    if (t[i] === "|") {
        return {i: i+1, r: hoverClass};
    }
    if (t[i] === "~") {
        return {i: i+1, r: clickClass};
    }
    return {i: i, r: false};
}

// Generate HTML from the parsed text. The augmented elements
// are “span” tags, with a “hover” or “click” class, and a
// “data-translation” attribute, containing the url-encoded
// representation of the translation.
function generateHTML(tree) {
    var result = "";
    each(tree, function (element) {
        if (typeof element === "string") {
            result += element;
        } else {
            result += "<span ";
            result += "class=\"" + element.type +"\" ";
            result += "data-translation=\"" +
                      escape(element.translation) + "\">";
            // Let’s hope we do not blow the javascript
            // return stack… :-°
            result += generateHTML(element.expression);
            result += "</span>"
        }
    });
    return result;
}

// Show a bubble with the translation of an expression.
function showBubble(e) {
    var el = e.currentTarget;
    var translation = el.getAttribute("data-translation");
    // We setup the bubble.
    bubble.innerHTML = unescape(translation);
    bubble.style.left = e.clientX + "px";
    bubble.style.top = e.clientY + "px";
    // And show it.
    setTimeout(function () {
        bubble.classList.add(bubbleVisibleClass);
    }, 0);
    // Setup a one time event to hide the bubble when we move
    // the mouse out of the expression. This should prevent
    // hiding the bubble right as we hover one, because of
    // things like race condition beetween previous mouseout
    // and current mouseover (I had the problem on an older
    // version of the code, I am not sure if it is still
    // necessary as I have simplified it a lot, but anyway,
    // having all the events here makes it pretty clear, I
    // think).
    var listener = el.addEventListener("mouseout", function () {
        bubble.classList.remove(bubbleVisibleClass);
        el.removeEventListener("mouseout", listener);
    });
    return prevented(e);
}

// Augment the text: parse it and create new elements which can
// react to the user and show the translation.
function augment(node) {
    // Parse and write the resulting HTML.
    var tree = parse(node.innerHTML);
    node.innerHTML = generateHTML(tree);
    // Setup the event listeners on the newly created elements.
    eachQuery(node, "." + clickClass, function (element) {
        element.addEventListener("click", showBubble);
    });
    eachQuery(node, "." + hoverClass, function (element) {
        element.addEventListener("mouseover", showBubble);
    });
}

// Toggle the structure of a text (show what can be hovered and
// clicked). All nodes should be coherents (have, or not have
// the “structure” class, but not some with and some without).
// Otherwise, “toggleStructure” will only switch their state
// and you will always have some structure shown :-).
// (I don’t care to foolproof this part, it’s not critical and
// easy to correct from the writer perspective)
function toggleStructure() {
    eachQuery("." + parseClass, function (node) {
        if (node.classList.contains(structureClass)) {
            node.classList.remove(structureClass);
        } else {
            node.classList.add(structureClass);
        }
    });
}

window.addEventListener("load", function () {
    // Format every marked node for reading and interaction.
    eachQuery("." + parseClass, augment);

    // We add the “structure” button and the bubble to the
    // document *after* having augmented the text, because in
    // the case where “<body>” has the class “lojban”,
    // “augment” would mess with them.
    document.body.appendChild(toggle);
    document.body.appendChild(bubble);
})
