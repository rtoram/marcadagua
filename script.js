let startX, startY, isDrawing = false;
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

document.getElementById('imageUpload').addEventListener('change', loadImage);
document.getElementById('removeWatermarkBtn').addEventListener('click', removeWatermark);
document.getElementById('downloadImageBtn').addEventListener('click', downloadImage);

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
    const currentX = event.offsetX;
    const currentY = event.offsetY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
}

function endDrawing(event) {
    if (!isDrawing) return;
    isDrawing = false;
}

function removeWatermark() {
    const currentX = event.offsetX;
    const currentY = event.offsetY;
    const width = currentX - startX;
    const height = currentY - startY;

    ctx.clearRect(startX, startY, width, height);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'image_without_watermark.png';
    link.href = canvas.toDataURL();
    link.click();
}
