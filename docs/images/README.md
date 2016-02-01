This directory contains images used in this package's documentation, including the original SVG documents.

The PNG versions of these images were generated using ImageMagick on OS X, using a command like:

`for i in *.svg; do inkscape --export-png ${i/.svg/.png} $i; done`