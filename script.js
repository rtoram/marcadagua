document.getElementById('imageUpload').addEventListener('change', loadImage);
document.getElementById('removeWatermarkBtn').addEventListener('click', removeWatermark);

function loadImage(event) {
    const imageCanvas = document.getElementById('imageCanvas');
    const ctx = imageCanvas.getContext('2d');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

function removeWatermark() {
    const imageCanvas = document.getElementById('imageCanvas');
    const ctx = imageCanvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imgData.data;

    // Example logic to remove watermark (simple color replacement)
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Assume watermark is white
        if (r > 200 && g > 200 && b > 200) {
            data[i] = 255; // Red channel
            data[i + 1] = 255; // Green channel
            data[i + 2] = 255; // Blue channel
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
}
