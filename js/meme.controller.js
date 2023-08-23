'use strict'

let gElCanvas
let gCtx
let gCanvasWidth
let gCanvasHeight

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
    //addEventListeners()

    gCanvasWidth = gElCanvas.width
    gCanvasHeight = gElCanvas.height
    console.log('gCtx', gCtx)
}

function renderMeme(imageUrl) {
    const img = new Image()

    img.onload = function() {
        // Clear the canvas
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

        // Draw the image
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

        // Draw top text
        const topText = "Top Text"
        const topTextX = gElCanvas.width / 2
        const topTextY = 50
        drawText(topText, topTextX, topTextY)

        // Draw bottom text
        const bottomText = "Bottom Text"
        const bottomTextX = gElCanvas.width / 2
        const bottomTextY = gElCanvas.height - 20 
        drawText(bottomText, bottomTextX, bottomTextY)
    };
    img.src = imageUrl
}

function onSetColor(color) {
    setColor(color)
}

function onChangeFontSize(action) {
    if (action === '+') increaseFontSize()
    if (action === '-') reduceFontSize()
}

function onChangeFont(selectedFont){
    changeFont(selectedFont)
}

// Clear the whole canvas
function onResetMeme() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

    gElCanvas.width = gCanvasWidth
    gElCanvas.height = gCanvasHeight

    gCanvasWidth = gElCanvas.width
    gCanvasHeight = gElCanvas.height
}

function onAddText() {

}

// function onImgUpload(img) {
//     if (!img) return

//     let imgName = img.name

//     // Check if the file's name ends with .png, .jpg, or .jpeg
//     if (!(imgName.endsWith('.png') || imgName.endsWith('.jpg') || imgName.endsWith('.jpeg'))) {
//         alert('Please upload a valid image (jpg, jpeg, png).')
//         return
//     }
//     const imageObj = new Image() // Create a new image object

//     imageObj.src = URL.createObjectURL(img) // Set the image source to the uploaded image data

//     // When the image has loaded, draw it on the canvas
//     imageObj.onload = function () {
//         // Resize the canvas to the image's size
//         gElCanvas.width = imageObj.width
//         gElCanvas.height = imageObj.height

//         // Draw the image across the whole canvas
//         gCtx.drawImage(imageObj, 0, 0, gElCanvas.width, gElCanvas.height)
//     }
// }

function downloadMeme(elLink) {
    const dataUrl = gElCanvas.toDataURL()
    console.log('dataUrl', dataUrl)

    elLink.href = dataUrl
    // Set a name for the downloaded file
    elLink.download = 'my-img'
}

// function addEventListeners() {
//     gElCanvas.addEventListener('mousedown', onMouseDown)
//     gElCanvas.addEventListener('mousemove', onMouseMove)
//     gElCanvas.addEventListener('mouseup', onMouseUp)
// }

// function onMouseDown() {
//     gIsDrawing = true
// }

// function onMouseMove(ev) {
//     if (gIsDrawing && gCurrShape === 'freestyle') {
//         const { offsetX, offsetY } = ev
//         drawFreeStyle(offsetX, offsetY)
//     }
// }

// function onMouseUp() {
//     gIsDrawing = false
// }