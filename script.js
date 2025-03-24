const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();
let originalImageData;
let currentColorIndex = 0;
const colorLayers = ['cyan', 'magenta', 'yellow', 'black'];
let layers = {};

document.getElementById('imageUpload').addEventListener('change', loadImage);
document.getElementById('downloadImageBtn').addEventListener('click', downloadImage);
document.getElementById('separateColorsBtn').addEventListener('click', separateColorsCMYK);
document.getElementById('clearImageBtn').addEventListener('click', clearImage);
document.getElementById('restoreImageBtn').addEventListener('click', restoreImage);
document.getElementById('resizeImageBtn').addEventListener('click', showResizeOptions);
document.getElementById('applyResizeBtn').addEventListener('click', applyResize);

function loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        image.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

function separateColorsCMYK() {
    if (!originalImageData) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    if (Object.keys(layers).length === 0) {
        layers = {
            cyan: new Uint8ClampedArray(data),
            magenta: new Uint8ClampedArray(data),
            yellow: new Uint8ClampedArray(data),
            black: new Uint8ClampedArray(data)
        };

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;

            const k = 1 - Math.max(r, g, b);
            const c = (1 - r - k) / (1 - k) || 0;
            const m = (1 - g - k) / (1 - k) || 0;
            const y = (1 - b - k) / (1 - k) || 0;

            layers.cyan[i] = (1 - c) * 255;
            layers.cyan[i + 1] = 255;
            layers.cyan[i + 2] = 255;
            layers.cyan[i + 3] = 255;

            layers.magenta[i] = 255;
            layers.magenta[i + 1] = (1 - m) * 255;
            layers.magenta[i + 2] = 255;
            layers.magenta[i + 3] = 255;

            layers.yellow[i] = 255;
            layers.yellow[i + 1] = 255;
            layers.yellow[i + 2] = (1 - y) * 255;
            layers.yellow[i + 3] = 255;

            layers.black[i] = k * 255;
            layers.black[i + 1] = k * 255;
            layers.black[i + 2] = k * 255;
            layers.black[i + 3] = 255;
        }
    }

    displayColorLayer();
}

function displayColorLayer() {
    const width = canvas.width;
    const height = canvas.height;
    if (layers[colorLayers[currentColorIndex]]) {
        const colorImageData = new ImageData(layers[colorLayers[currentColorIndex]], width, height);
        ctx.putImageData(colorImageData, 0, 0);
    }
    currentColorIndex = (currentColorIndex + 1) % colorLayers.length;
}

function clearImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function restoreImage() {
    if (!originalImageData) return;
    ctx.putImageData(originalImageData, 0, 0);
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
