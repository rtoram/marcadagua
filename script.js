document.getElementById('resizeImageBtn').addEventListener('click', resizeImage);

function resizeImage() {
    const newWidth = prompt("Enter new width:");
    const newHeight = prompt("Enter new height:");

    if (newWidth && newHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(tempCanvas, 0, 0);
    }
}
