let startX, startY, endX, endY, isDrawing = false;
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

document.getElementById('imageUpload').addEventListener('change', loadImage);
document.getElementById('separateColorsBtn').addEventListener('click', separateColorsCMYK);
document.getElementById('downloadImageBtn').addEventListener('click', downloadImage);
document.getElementById('resizeImageBtn').addEventListener('click', showResizeOptions);
document.getElementById('applyResizeBtn').addEventListener('click', applyResize);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);

function loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        }
        image.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

function startDrawing(event) {
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
}

function draw(event) {
    if (!isDrawing) return;
    endX = event.offsetX;
    endY = event.offsetY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}

function endDrawing(event) {
    if (!isDrawing) return;
    isDrawing = false;
    endX = event.offsetX;
    endY = event.offsetY;
}

function separateColorsCMYK() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const cyanCanvas = createColorCanvas(width, height);
    const magentaCanvas = createColorCanvas(width, height);
    const yellowCanvas = createColorCanvas(width, height);
    const blackCanvas = createColorCanvas(width, height);

    const cyanCtx = cyanCanvas.getContext('2d');
    const magentaCtx = magentaCanvas.getContext('2d');
    const yellowCtx = yellowCanvas.getContext('2d');
    const blackCtx = blackCanvas.getContext('2d');

    const cyanImageData = cyanCtx.createImageData(width, height);
    const magentaImageData = magentaCtx.createImageData(width, height);
    const yellowImageData = yellowCtx.createImageData(width, height);
    const blackImageData = blackCtx.createImageData(width, height);

    const cyanData = cyanImageData.data;
    const magentaData = magentaImageData.data;
    const yellowData = yellowImageData.data;
    const blackData = blackImageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;

        cyanData[i] = (1 - c) * 255;
        cyanData[i + 1] = 255;
        cyanData[i + 2] = 255;
        cyanData[i + 3] = 255;

        magentaData[i] = 255;
        magentaData[i + 1] = (1 - m) * 255;
        magentaData[i + 2] = 255;
        magentaData[i + 3] = 255;

        yellowData[i] = 255;
        yellowData[i + 1] = 255;
        yellowData[i + 2] = (1 - y) * 255;
        yellowData[i + 3] = 255;

        blackData[i] = k * 255;
        blackData[i + 1] = k * 255;
        blackData[i + 2] = k * 255;
        blackData[i + 3] = 255;
    }

    cyanCtx.putImageData(cyanImageData, 0, 0);
    magentaCtx.putImageData(magentaImageData, 0, 0);
    yellowCtx.putImageData(yellowImageData, 0, 0);
    blackCtx.putImageData(blackImageData, 0, 0);

    downloadCanvas(cyanCanvas, 'cyan.png');
    downloadCanvas(magentaCanvas, 'magenta.png');
    downloadCanvas(yellowCanvas, 'yellow.png');
    downloadCanvas(blackCanvas, 'black.png');
}

function createColorCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function downloadCanvas(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
}

function showResizeOptions() {
    document.getElementById('resizeOptions').style.display = 'block';
}

function applyResize() {
    const newWidth = parseInt(document.getElementById('newWidth').value);
    const newHeight = parseInt(document.getElementById('newHeight').value);

    if (newWidth && newHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
    }
}
