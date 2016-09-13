# Jbogidva

## Table of Content

 1. [What is it?](#what-is-it-)
 2. [Contributing](#contributing)
 3. [Writing a translated text for this website](#writing-a-translated-text-for-this-website)
 4. [Project structure](#project-structure)
 5. [Technical choices](#technical-choices)
 6. [Reusing the script](#reusing-the-script)


## What is it?

It is a tool to help learn lojban by reading a lot of it.

The goal is to have lojban texts enhanced to ease reading
while learning.

When we mouse over some words, their definition is shown.
More familiar words may require clicking on them to see the
definition.

The translation is not generated automatically, but crafted
by conscientious teachers. They choose which kind of
definition to give the reader (a formal definition like
“x1 something x2 to x3”, or a more lax one like “to do”?),
which part of the sentence to translate (we are not limited
to words), and which kind of translation to provide (visible
on mouseover, or only when clicking?).

Help can be nested. So, we can mouse over an expression and
have it’s whole translation, or over a specific word and
have the translation of said word only.

We use a text format to define translations: a text beetween
brackets is a lojban text with translation. The text and
it’s translation are separated by a vertical bar (`|`) if
the translation is to be shown when the mouse is over the
text. They are separated by `~` if we have to click on the
text to see the translation.

    {viska|see}   will show “see” when hovering over “viska”,
    {viska~see}   will show “see” when clicking on “viska”.

The text can contain HTML (we are not limited to boring plain
text).


## Contributing

You can contribute to this project in many ways:

 - You can enhance the CSS so that the reading is easier or
   prettier,
 - You can enhance the javascript so that we do things better,
   or more things,
 - You can **write new pages with texts and their
   translation** – this is the most important contribution you
   can give, because this site is useless without content,
 - You can take a translation from one language and “translate
   the translation” in another language (we currently have
   english and french translations, because these are the only
   languages I speak. More is better.),
 - You can correct translations when you find a mistake,
 - You can find an other way, we are open to anything.

The following sections explain how to contribute on certain
aspects. The project is on github and the web pages are also
hosted there, in the hope that pulling changes and applying
them will be efficient enough for the maintainer to do his job.


## Writing a translated text for this website

### Structure of a translated text

A translated text is any text, with it’s translated part
beetween brackets:

```
{lo tavla|a speaker}
```

In the brackets, the text and it’s translation are separated
by `|` or `~` (if we want to show the translation,
respectively , when hovering the text, or when clicking on it).

```
{seltcidu~only visible when i click on it}
```

We can nest translations:

```
{{mi~me} {prami|love} {do~you}
|I love you}
```

If your text or translation contains `{`, `}`, `|`, `~` or
`\`, you have to escape it with a `\`.

```
{text\{with\}|plenty\|of\~escaped\\characters}
```

Your text can contain any HTML, or be surrounded by it:

```
<p>
{my <b>text</b>|translated}
</p>
```

You just have to avoid overlap as it will produce bad html:

```
<b>{overlap</b>|is bad}
```

When writing a translation with lots of nesting, you may use newlines and indentation:

```
{.i|start of a sentence}
{{mi|I}
 {nelci|like}
 {lo jbobau~lojban}
|I like lojban,}
.i
{{ku'i|but}
 {ri|it}
 {nandu|is difficult to}
 {mi~me}
 lo
 {nu|the event of}
 mi
 {djuno|knowing}
 {{mo'a|too few}
  {{lojbo|lojban}
   {valsi|word}
  |lojbanic word}
 |too few lojbanic words}
| but I find it difficult while I don’t know much vocabulary.}
```

is better than

```
{.i|start of a sentence} {{mi|I} {nelci|like} {lo jbobau~lojban}
|I like lojban,} .i {{ku'i|but} {ri|it} {nandu|is difficult to}
{mi~me} lo {nu|the event of} mi {djuno|knowing} {{mo'a|too few}
{{lojbo|lojban} {valsi|word} |lojbanic word} |too few lojbanic
words} | but I find it difficult while I don’t know much
vocabulary.}
```

And that’s all you should need to know.


### Structure of a page

The HTML of a page should always be quite similar:


#### Surrounding html

```html
<!doctype html>
<html lang="jbo">
<head>
    <meta charset="utf-8">
    <title>Zbafanva: [title of the current page]</title>
    <link rel="stylesheet" type="text/css" href="../book.css">
    <link rel="stylesheet" type="text/css" href="../zbafanva.css">
    <script src="../zbafanva.js"></script>
</head>
<body class="lojban">

    [Navigation links]

    [The translated text]

    [Navigation links]

</body>
</html>
```

We apply the `lojban` class to `<body>`, because all of our
page is meant to be translated. Keep in mind that you _can_
apply this class to elements in particular (which means less
text to parse by the script if you have a lot of text not
translated).

The `<html>` tag as a `lang` attribute set to `jbo`. This is a
decision that can be contested, but until it is, we should
stick to a single convention.

The title of the page always begins with “Zbafanva:”, so a
visitor can identify the website clearly when looking at his
browsing history.


#### Navigation links

```html
<nav>
    <div>
        <a href="…">[previous page]</a>
    </div><div>
        <a href="navigation.html">[table of content]</a>
    </div><div>
        <a href="…">[chapters of this text]</a>
    </div><div>
        <a href="…">[next page]</a>
    </div>
</nav>
```

The navigation part should be the same at the top and at the
bottom of the page.

You can omit the links to a previous or next page, or to the
chapters. Only “table of content” is mandatory. However, you
have to keep the `<div>` elements to get every link in the
right place. And a previous and next link are welcome, even if
the page is not part of a book with chapters. Just point to an
easier (for previous) and harder (for next) text, and try to
keep the “navigation graph” consistent (so that the “next” of a
page has said page as it’s “previous”, and if every page can be
reached uing only next and previous, it is an ideal situation).

The links will usually be in lojban, and a translation
provided, so an element of the navigation will more typically
look like this:

```html
<div>
    {<a href="…">lojban name</a>
    |translation}
</div>
```

For now, the table of content is “ro selci'a”:

```html
<div>
    {<a href="navigation.html">ro selci'a</a>
    |All the texts}
</div>
```

Chapters are marked “romo'o” (but we don’t have any yet!):

```html
<div>
    {<a href="textname-chapters.html">romo'o</a>
    |Chapters}
</div>
```

(We may put texts that have chapters in their own directory, we
will see once we have one.)

“Previous” links are preceded by a “←”, and “next” links
followed by a “→”.


#### The translated text

The translated text follows the rules in “Structure of a
translated text”. It can contain any HTML markup as long as it
is nested correctly (`<a>{bad</a>|markup}` is a no go). It
_should_ contain HTML markup, in fact, to be pretty and not
boring (headers, paragraphs, footnotes, that kind of things).

So, typically, a text would look like this:

```html
<h1>{title in lojban|title translated}</h1>
<p>
[…]
{{nested|translated}
 {lojban|…}
 {expressions|…}
|and their translation}
[…]
</p>
<p>
[…]<em>{emphasis on some lojban|translated}</em>[…]
</p>
<img src=""> <!-- we want some illustrations too ;-) -->
<p>
[…]{lojban expression|translated}
</p>
<p>
[…]
</p>
```

In the case of illustrations, their “title” text should be in
lojban, but as it is in an attribute, it cannot be translated.
We may provide a “legend” class to put under the images and
have their description in a translatable lojban.


## Project structure

The main files are in the root directory. They are:

 - `jbogidva.js`: the javascript that does all the magic.
 - `jbogidva.css`: the associated css to make the magic look
   good.
 - `book.css`: the css of this website. Not mandatory if you
   reuse the script only.

The root directory also contains:

 - `LICENSE`: the license of this project.
 - `README.md`: this file
 - `index.html`: a portal redirecting to the different
   languages.

The translations are provided in many languages, each in their
own directory.

 - `en`: english translations
 - `fr`: french translations

Each language directory has at least two files:

 - `index.html`: an explanation of this project in the target
   language.
 - `navigation.html`: a list of all the texts translated in
   this language.


## Technical choices

The pages are static. So we can develop and deploy using a very
simple infrastructure (I currently develop with only a text
editor and a browser, no web server, no fancy stuff). This
means that some things are not automated however (the
invariants in a web page, the index of all the files…).

The navigation is on a separated page to avoid deduplication.
This is a direct result of the choice to have a static website
with no infrastructure, but it also saved me some reflexion
about how to integrate the list of all files on every page (as
a designer, not a programmer).

The javascript is simple and heavily commented. The code uses
english (the temptation to use lojban for variables and
functions names was there, but it would limit potential
contributions). A previous iteration did more things, but was
less useful and more complicated, so embrace simplicity.

The website works on my computer, on Firefox and Google
Chrome. I hope it is simple enough to work on most other
systems and browsers. But it clearly needs testing.


## Reusing the script

You can use the `zbafanva.js` and `zbafanva.css` files on your
own website if you wish, it should not be specifically tied to
this one (being integrated into the lojban wiki would be a kind
of consecration, wouldn’t it be?).

You may want to modify the CSS to suit your style, though…

`book.css` is written for this site specifically and is not
required for the script to function. As per the license you
can still reuse it, of course.

