let startX, startY, endX, endY, isDrawing = false;
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

document.getElementById('imageUpload').addEventListener('change', loadImage);
document.getElementById('removeWatermarkBtn').addEventListener('click', removeWatermark);
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

function removeWatermark() {
    const width = endX - startX;
    const height = endY - startY;

    // Get the surrounding area
    const surroundingData = ctx.getImageData(startX - 10, startY - 10, width + 20, height + 20);

    // Create a temporary canvas to hold the surrounding area
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width + 20;
    tempCanvas.height = height + 20;

    // Draw the surrounding area on the temporary canvas
    tempCtx.putImageData(surroundingData, 0, 0);

    // Clear the selected area on the main canvas
    ctx.clearRect(startX, startY, width, height);

    // Draw the surrounding area back on the main canvas, without the watermark area
    ctx.drawImage(tempCanvas, 10, 10, width, height, startX, startY, width, height);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'image_without_watermark.png';
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
