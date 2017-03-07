// Grab the canvs and the context
var canvas = document.getElementById('the-canvas');
var context = canvas.getContext('2d');
var imageData = context.getImageData(0,0,canvas.width,canvas.height);
var initialClick = false;
var initialCoords = { x: 0, y: 0 };
var tempRectangle = { x1: 0, y1: 0, x2: 0, y2: 0 };
var rectangles = [];

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function drawCircle(centerX, centerY) {
    context.beginPath();
    context.arc(centerX, centerY, 5, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
}
function drawRectangle(tempRectangle){
    context.rect(tempRectangle.x1, tempRectangle.y1, tempRectangle.x2, tempRectangle.y2);
    context.stroke();
}
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    if(initialClick){
        tempRectangle = { x1: tempRectangle.x1, y1: tempRectangle.y1, x2: mousePos.x, y2: mousePos.y };
        context.putImageData(imageData, 0, 0);
        rectangles.push(tempRectangle);
        drawRectangle(tempRectangle);
        tempRectangle = { x1: mousePos.x, y1: mousePos.y, x2: mousePos.x, y2: mousePos.y };
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
    } else {
        tempRectangle = { x1: mousePos.x, y1: mousePos.y, x2: mousePos.x, y2: mousePos.y };
        drawCircle(mousePos.x, mousePos.y);
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
    }
    initialClick = !initialClick;
}, false);
canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    if(initialClick){
        tempRectangle = { x1: tempRectangle.x1, y1: tempRectangle.y1, x2: mousePos.x, y2: mousePos.y };
        context.putImageData(imageData, 0, 0);
        drawRectangle(tempRectangle);
    } else {

    }
}, false);

// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'http://localhost:3000/app/resources/ama.pdf';

// Disable workers to avoid yet another cross-origin issue (workers need
// the URL of the script to be loaded, and dynamically loading a cross-origin
// script does not work).
// PDFJS.disableWorker = true;

// The workerSrc property shall be specified.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

// Asynchronous download of PDF
var loadingTask = PDFJS.getDocument(url);
loadingTask.promise.then(function (pdf) {
    console.log('PDF loaded');

    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function (page) {
        console.log('Page loaded');

        var scale = 1.5;
        var viewport = page.getViewport(scale);

        // Prepare canvas using PDF page dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.then(function () {
            console.log('Page rendered');
        });
    });
}, function (reason) {
    // PDF loading error
    console.error(reason);
});