'use strict'

let gElCanvas
let gCtx
let gCanvasWidth
let gCanvasHeight
let gStrokeWidth = 1

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderImages()
    //addEventListeners()
    //reloadDefaultSettings()

    gCanvasWidth = gElCanvas.width
    gCanvasHeight = gElCanvas.height
    console.log('gCtx', gCtx)
}

function onSetColor(color) {
    setColor(color)
}

function onChangeFontSize(action) {
    if (action === '+') increaseFontSize()
    if (action === '-') reduceFontSize()
}

// Clear the whole canvas
function onResetMeme() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

    gElCanvas.width = gCanvasWidth
    gElCanvas.height = gCanvasHeight

    gCanvasWidth = gElCanvas.width
    gCanvasHeight = gElCanvas.height
}

function onAddText(ev) {
    const { offsetX, offsetY } = ev
    console.log('offsetX, offsetY:', offsetX, offsetY)

    let userSentence = prompt('Insert Text')
    if (!userSentence) return

    drawText(userSentence, offsetX, offsetY)
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

function renderImages() {
    const images = createImages()
    const gallerySection = document.querySelector('.gallery-section')

    images.forEach(image => {
        const imgElement = document.createElement('img')
        imgElement.src = image.url;
        imgElement.alt = image.keywords.join(', ')

        gallerySection.appendChild(imgElement)
    })
}

// function reloadDefaultSettings() {
//     $('#userColor').setValue('#000000')
//     $('#uploadFile').setValue('')
// }

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