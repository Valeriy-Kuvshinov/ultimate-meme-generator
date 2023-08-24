'use strict'

let gElCanvas
let gCtx
let gCanvasWidth
let gCanvasHeight
let gCurrentImage = null
let gSelectedLineIdx = null

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderGallery()
    addEventListeners()

    gCanvasWidth = gElCanvas.width
    gCanvasHeight = gElCanvas.height
    console.log('gCtx', gCtx)
}

function renderMeme(imageUrl) {
    gCurrentImage = imageUrl
    const img = new Image()
    img.onload = function () {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

        gMemeLines.forEach((line, idx) => {
            const y = line.location === 'top' ? 50 : line.location === 'middle' 
            ? gElCanvas.height / 2 : gElCanvas.height - 50

            const lineHeights = drawText(line.txt, gElCanvas.width / 2, y, line.color
                , line.fontSize, line.fontType, gElCanvas.width - 30, line.txtAlign, line.isBold)

            // Highlight the selected line
            if (gSelectedLineIdx === idx) {
                lineHeights.forEach(yPosition => {
                    const textWidth = gCtx.measureText(line.txt).width

                    let x = (gElCanvas.width - textWidth) / 2
                    if (line.txtAlign === 'left') x = 20
                    else if (line.txtAlign === 'right') x = gElCanvas.width - textWidth - 20

                    const padding = 10
                    drawSelectedBorder(x - padding, yPosition - line.fontSize / 2 - padding
                        , textWidth + 2 * padding, line.fontSize + 2 * padding, 10, 'rgba(255, 255, 255, 0.3)')
                })
                drawText(line.txt, gElCanvas.width / 2, y, line.color, line.fontSize
                    , line.fontType, gElCanvas.width - 30, line.txtAlign, line.isBold)
            }
        })
    }
    img.src = imageUrl
}

// Clear the whole canvas
function onResetMeme() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

    gElCanvas.width = gCanvasWidth
    gElCanvas.height = gCanvasHeight
    gCanvasWidth = gElCanvas.width
    gCanvasHeight = gElCanvas.height

    gMemeLines = []
    gSelectedLineIdx = null
    gCurrentImage = null
}

function onSetColor(color) {
    if (!gMemeLines[gSelectedLineIdx]) return

    setColor(color)
    renderMeme(gCurrentImage)
}

function onChangeFontSize(action) {
    if (!gMemeLines[gSelectedLineIdx]) return

    if (action === '+') increaseFontSize()
    if (action === '-') reduceFontSize()
    renderMeme(gCurrentImage)
}

function onChangeFont(selectedFont) {
    if (!gMemeLines[gSelectedLineIdx]) return

    changeFont(selectedFont)
    renderMeme(gCurrentImage)
}

function onChangeTextAlign(alignValue) {
    if (!gMemeLines[gSelectedLineIdx]) return

    changeTextAlign(alignValue)
    renderMeme(gCurrentImage)
}

function onToggleLine() {
    if (gSelectedLineIdx === null || !gMemeLines[gSelectedLineIdx]) {
        gSelectedLineIdx = 0
    } else {
        if (gSelectedLineIdx === gMemeLines.length - 1) {
            gSelectedLineIdx = 0
        } else gSelectedLineIdx++
    }
    renderMeme(gCurrentImage)
}

function onToggleBold() {
    if (!gMemeLines[gSelectedLineIdx]) return

    gMemeLines[gSelectedLineIdx].isBold = !gMemeLines[gSelectedLineIdx].isBold
    renderMeme(gCurrentImage)
}

function onAddLine() {
    const textOrder = ["TOP TEXT", "BOTTOM TEXT", "MIDDLE TEXT"]
    const locationOrder = ['top', 'bottom', 'middle']

    if (gMemeLines.length < 3) {
        const newLine = createLine(locationOrder[gMemeLines.length]
            , textOrder[gMemeLines.length], gMemeLines.length + 1)
        gMemeLines.push(newLine)

        renderMeme(gCurrentImage)
    }
}

function onRemoveLine() {
    if (gMemeLines.length === 0) return

    gMemeLines.pop()
    renderMeme(gCurrentImage)
}

function setLineTxt() {
    if (!gMemeLines[gSelectedLineIdx]) return

    const userText = document.getElementById('userText').value
    if (userText === '') return

    gMemeLines[gSelectedLineIdx].txt = userText
    renderMeme(gCurrentImage)
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

    elLink.href = dataUrl
    // Set a name for the downloaded file
    elLink.download = 'my-img'
}

function addEventListeners() {
    gElCanvas.addEventListener('click', onClickText)
}

function onClickText(event) {
    let rect = gElCanvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    gMemeLines.forEach((line, idx) => {
        gCtx.font = `${line.fontSize}px ${line.fontType}`
        gCtx.textAlign = line.txtAlign

        let lineY = line.location === 'top' ? 50 : line.location === 'middle' ? 
        gElCanvas.height / 2 : gElCanvas.height - 50

        let textWidth = gCtx.measureText(line.txt).width
        let startX = (gElCanvas.width - textWidth) / 2

        if (line.txtAlign === 'left') startX = 20
        else if (line.txtAlign === 'right') startX = gElCanvas.width - textWidth - 20

        if (y > lineY - line.fontSize / 2 && y < lineY + line.fontSize / 2 &&
            x > startX && x < startX + textWidth) {
            gSelectedLineIdx = idx
            renderMeme(gCurrentImage)
        }
    })
}

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
