
const createQueryParams = params =>
    Object.keys(params)
        .map(k => `${k}=${encodeURI(params[k])}`)
        .join('&');

var generateIconCache = {};
var marker_color = {5: 'red', 4: 'pink', 3: 'turquoise', 2: 'blue', 1: 'black'};

function generateIcon(number, callback) {
    if (generateIconCache[number] !== undefined) {
        callback(generateIconCache[number]);
    }

    var fontSize = 16,
        imageWidth = imageHeight = 35;

    if (number >= 4) {
        fontSize = 12;
        imageWidth = imageHeight = 55;
    } else if (number < 4 && number >= 3) {
        fontSize = 14;
        imageWidth = imageHeight = 45;
    } else if (number < 3 && number > 0) {
        fontSize = 18;
        imageWidth = imageHeight = 35;
    }

    var svg = d3.select(document.createElement('div')).append('svg')
        .attr('viewBox', '0 0 54.4 54.4')
        .append('g');

    var circles = svg.append('circle')
        .attr('cx', '27.2')
        .attr('cy', '27.2')
        .attr('r', '21.2')
        .style('fill', marker_color[number]);

    var path = svg.append('path')
        .attr('d', 'M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z')
        .attr('fill', '#FFFFFF');

    var text = svg.append('text')
        .attr('dx', 27)
        .attr('dy', 32)
        .attr('text-anchor', 'middle')
        .attr('style', 'font-size:' + fontSize + 'px; fill: #FFFFFF; font-family: Arial, Verdana; font-weight: bold')
        .text(number);

    var svgNode = svg.node().parentNode.cloneNode(true),
        image = new Image();

    d3.select(svgNode).select('clippath').remove();

    var xmlSource = (new XMLSerializer()).serializeToString(svgNode);

    image.onload = (function (imageWidth, imageHeight) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            dataURL;

        d3.select(canvas)
            .attr('width', imageWidth)
            .attr('height', imageHeight);

        context.drawImage(image, 0, 0, imageWidth, imageHeight);

        dataURL = canvas.toDataURL();
        generateIconCache[number] = dataURL;

        callback(dataURL);
    }).bind(this, imageWidth, imageHeight);

    image.src = 'data:image/svg+xml;base64,' + btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
