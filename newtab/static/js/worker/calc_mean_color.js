"use strict";
function makeRGB(name){
    return ['rgb(', name, ')'].join('');
};

function mapPalette(palette){
    var arr = [];
    for (var prop in palette) {
        arr.push( frmtPobj(prop, palette[prop]) )
    };
    arr.sort(function(a, b) { return (b.count - a.count) });
    return arr;
};  

function fitPalette(arr, fitSize) {
    if (arr.length > fitSize ) {
        return arr.slice(0,fitSize);
    } else {
        for (var i = arr.length-1 ; i < fitSize-1; i++) { arr.push( frmtPobj('0,0,0', 0) ) };
        return arr;
    };
};

function frmtPobj(a,b){
    return {name: makeRGB(a), count: b};
}

// RGBaster Object
// ---------------
//
var PALETTESIZE = 10;

function calcMeanColor(data, opts, callback){

    opts = opts || {};
    var exclude = opts.exclude || [ ], // for example, to exclude white and black:  [ '0,0,0', '255,255,255' ]
        paletteSize = opts.paletteSize || PALETTESIZE;

    var colorCounts   = {},
        rgbString     = '',
        rgb           = [],
        colors        = {
            dominant: { name: '', count: 0 },
            palette:  []
        };

    var i = 0;
    for (; i < data.length; i += 4) {
        rgb[0] = data[i];
        rgb[1] = data[i+1];
        rgb[2] = data[i+2];
        rgbString = rgb.join(",");

        // skip undefined data and transparent pixels
        if (rgb.indexOf(undefined) !== -1  || data[i + 3] === 0) {
            continue;
        }

        // Ignore those colors in the exclude list.
        if ( exclude.indexOf( makeRGB(rgbString) ) === -1 ) {
            if ( rgbString in colorCounts ) {
                colorCounts[rgbString] = colorCounts[rgbString] + 1;
            }
            else{
                colorCounts[rgbString] = 1;
            }
        }

    }

    var palette = fitPalette( mapPalette(colorCounts), paletteSize+1 );
    return {
        dominant: palette[0].name,
        secondary: palette[1].name,
        palette:  palette.map(function(c){ return c.name; }).slice(1)
    };
};

function calculateColorBrightness(color) {
    var avg = 153;
    var reg = /rgb\((\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3})\)/i;
    var r, g, b;
    if (typeof (color) != "string") {
        return avg;
    }
    else if (color.length == 7) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(4, 2), 16);
    }
    else if (reg.test(color)) {
        color = reg.exec(color)[1].split(',');
        r = parseInt(color[0]);
        g = parseInt(color[1]);
        b = parseInt(color[2]);
    }
    else {
        return avg;
    }
    if (isNaN(r) || isNaN(g) || isNaN(b))
        return avg;
    return Math.floor((r + g + b) / 3);
    // return Math.floor(((color >> 16) + ((color & 0x00FF00) >> 8) + (color & 0x0000FF)) / 3) > 128;
}

onmessage = function(message) {
    var result = calcMeanColor(message.data, {
        exclude: [ 'rgb(255,255,255)', 'rgb(0,0,0)' ],
    })
    var color_avg = calculateColorBrightness(result.dominant);
    postMessage(color_avg);
}