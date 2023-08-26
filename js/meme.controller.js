'use strict'

let gElCanvas // Canvas element
let gCtx // Canvas rendering context
let gCurrentImage = null // Currently selected image URL
let gIsLineSelected = false // Flag to check if any line is selected
let gSelectedLineIdx = null // Index of currently selected line
let gIsDragging = false // Flag to check if any line is being dragged
let gTapTimeout = null // Measurement for unselecting a line on touch

// Initialization function
function onInit() {
    // Locate and initialize canvas and its rendering context
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery(gImgs) // Render initial gallery
    addEventListeners() // Attach event listeners to elements
}

// Function to render a meme on canvas
function renderMeme(imageUrl) {
    gCurrentImage = imageUrl
    const img = new Image() // Create an Image object
    img.onload = function () { // Once the img has loaded, do the following:
        // Clear canvas and draw the image
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

        // Draw each line of the meme
        gMemeLines.forEach((line, idx) => {
            let y = (line.location === 'top' ? 50 : line.location === 'middle'
                ? gElCanvas.height / 2 : gElCanvas.height - 50) + line.y
            let x = (gElCanvas.width / 2) + line.x

            // Adjust x position based on text alignment
            if (line.txtAlign === 'left') x = 20
            else if (line.txtAlign === 'right') x = gElCanvas.width - 20

            const lineHeights = drawText(line.txt, x, y, line.color, line.fontSize, line.fontType
                , gElCanvas.width - 30, line.txtAlign, line.isBold)

            const textWidth = gCtx.measureText(line.txt).width
            let padding = 10

            // Calculate where the rectangle should start based on text alignment
            let rectX = x - textWidth / 2 - padding

            if (line.txtAlign === 'left') rectX = x - padding
            else if (line.txtAlign === 'right') rectX = x - textWidth - padding - 5

            let rectY = y - line.fontSize / 2 - padding

            // Draw the rectangle around the selected line
            if (gIsLineSelected && gSelectedLineIdx === idx) {
                drawSelectedBorder(rectX, rectY, textWidth + 2 * padding, line.fontSize + 2
                    * padding, 10, 'rgba(255, 255, 255, 0.3)')
            }
        })
    }
    img.src = imageUrl // Trigger the image loading
}

// Clear the canvas
function onResetMeme() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)

    gMemeLines = []
    gSelectedLineIdx = null
    gCurrentImage = null
}

// Function to change the color of a line in the meme
function onSetColor(color) {
    if (!gMemeLines[gSelectedLineIdx]) return

    setColor(color)
    renderMeme(gCurrentImage)
}

// Function to change the font size of a line in the meme
function onChangeFontSize(action) {
    if (!gMemeLines[gSelectedLineIdx]) return

    if (action === '+') increaseFontSize()
    if (action === '-') reduceFontSize()
    renderMeme(gCurrentImage)
}

// Function to change the font type of a line in the meme
function onChangeFont(selectedFont) {
    if (!gMemeLines[gSelectedLineIdx]) return

    changeFont(selectedFont)
    renderMeme(gCurrentImage)
}

// Function to change the text alignment of a line in the meme
function onChangeTextAlign(alignValue) {
    if (!gMemeLines[gSelectedLineIdx]) return

    changeTextAlign(alignValue)
    renderMeme(gCurrentImage)
}

// Function to toggle the selected line for editing
function onToggleLine() {
    if (gSelectedLineIdx === null || !gMemeLines[gSelectedLineIdx]) {
        gIsLineSelected = true
        gSelectedLineIdx = 0
    } else {
        // Code to toggle line selection
        if (gSelectedLineIdx === gMemeLines.length - 1) {
            gSelectedLineIdx = 0
        } else gSelectedLineIdx++
    }
    renderMeme(gCurrentImage)
}

// Function to toggle bold style of a line for editing
function onToggleBold() {
    if (!gMemeLines[gSelectedLineIdx]) return

    gMemeLines[gSelectedLineIdx].isBold = !gMemeLines[gSelectedLineIdx].isBold
    renderMeme(gCurrentImage)
}

// Function to add a new line to the meme
function onAddLine() {
    // Define the way the lines are organized in the meme
    const textOrder = ["TOP TEXT", "BOTTOM TEXT", "MIDDLE TEXT"]
    const locationOrder = ['top', 'bottom', 'middle']

    // As long as there are less than 3 lines, add a new line to the meme
    if (gMemeLines.length < 3) {
        const newLine = createLine(locationOrder[gMemeLines.length]
            , textOrder[gMemeLines.length], gMemeLines.length + 1)
        gMemeLines.push(newLine)

        renderMeme(gCurrentImage)
    }
}

// Function to remove an existing line from the meme
function onRemoveLine() {
    if (gMemeLines.length === 0) return

    gMemeLines.pop()
    renderMeme(gCurrentImage)
}

// Function to edit the text of a line in the meme
function setLineTxt() {
    if (!gMemeLines[gSelectedLineIdx]) return

    const userText = document.getElementById('userText').value
    if (userText === '') return

    gMemeLines[gSelectedLineIdx].txt = userText
    renderMeme(gCurrentImage)
}

// Function to move a line in a meme to the left by 5px
function onMoveLeft() {
    if (!gMemeLines[gSelectedLineIdx]) return

    gMemeLines[gSelectedLineIdx].x -= 5
    renderMeme(gCurrentImage)
}

// Function to move a line in a meme to the right by 5px
function onMoveRight() {
    if (!gMemeLines[gSelectedLineIdx]) return

    gMemeLines[gSelectedLineIdx].x += 5
    renderMeme(gCurrentImage)
}

// Function to move a line in a meme up by 5px
function onMoveUp() {
    if (!gMemeLines[gSelectedLineIdx]) return

    gMemeLines[gSelectedLineIdx].y -= 5
    renderMeme(gCurrentImage)
}

// Function to move a line in a meme down by 5px
function onMoveDown() {
    if (!gMemeLines[gSelectedLineIdx]) return

    gMemeLines[gSelectedLineIdx].y += 5
    renderMeme(gCurrentImage)
}

// Function to handle getting any file of PNG / JPG / JPEG type, and rendering it in the canvas
function onImgUpload(e) {
    let img = e.target.files[0] // Get the uploaded file
    if (!img) return

    let imgName = img.name

    // Check if the file's name ends with .png, .jpg, or .jpeg
    if (!(imgName.endsWith('.png') || imgName.endsWith('.jpg') || imgName.endsWith('.jpeg'))) {
        alert('Please upload a valid image (jpg, jpeg, png).')
        return
    }
    let imageURL = URL.createObjectURL(img)

    gCurrentImage = imageURL

    let imageObj = new Image()
    imageObj.onload = function () {
        onResetMeme()
        onAddLine()
        onAddLine()
        onToggleLine()
        renderMeme(imageURL)
    }
    imageObj.src = imageURL
}

// Function to handle downloading a meme to a PNG format
function downloadMeme(elLink) {
    gIsLineSelected = false
    renderMeme(gCurrentImage)

    const dataUrl = gElCanvas.toDataURL()

    elLink.href = dataUrl
    elLink.download = 'my-img' // Set a name for the downloaded file
}

// Function to handle event of randomly choosing an img from the gallery
function onChooseRandom() {
    const randomIdx = Math.floor(Math.random() * gImgs.length)
    const randomImageUrl = gImgs[randomIdx].url

    onResetMeme()
    onAddLine()
    onAddLine()
    onToggleLine()
    renderMeme(randomImageUrl)
}

// Function to attach event listeners
function addEventListeners() {
    // File upload event
    document.getElementById('file-upload').addEventListener('change', function (e) {
        onImgUpload(e)
    })

    // Click event on canvas to select a text line
    gElCanvas.addEventListener('click', onClickText)

    // Mouse events for when the user drags a line
    gElCanvas.addEventListener('mousedown', onMouseDown)
    gElCanvas.addEventListener('mousemove', onMouseMove)
    gElCanvas.addEventListener('mouseup', onMouseUp)

    // Touch events for when the user drags a line
    gElCanvas.addEventListener('touchstart', onTouchStart)
    gElCanvas.addEventListener('touchmove', onTouchMove)
    gElCanvas.addEventListener('touchend', onTouchEnd)

    // Keyboard event for arrow keys
    window.addEventListener('keydown', function (event) {
        // If an arrow key is pressed, call the appropriate function
        if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            onMoveLeft()
        } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            onMoveRight()
        } else if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
            onMoveUp()
        } else if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
            onMoveDown()
        }
    })
}

function onShareToFacebook() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')

        const { responseText: url } = XHR

        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

// Function to check if a text line is clicked on the canvas
function onClickText(event) {
    let rect = gElCanvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    gIsLineSelected = false

    // Logic to detect which line was clicked on
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
            gIsLineSelected = true
            gSelectedLineIdx = idx
            renderMeme(gCurrentImage)
        }
    })
    // Deselect a line, if clicked outside of the line (not on the text)
    if (!gIsLineSelected) {
        gSelectedLineIdx = null // Set to null or any invalid index
        renderMeme(gCurrentImage)
    }
}

function onMouseDown() {
    if (gIsLineSelected) { // Check if any line is selected
        gIsDragging = true
    }
}

function onMouseMove(event) {
    if (!gIsDragging || !gIsLineSelected) return
    let rect = gElCanvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    // Update the x and y coordinates of the selected line
    gMemeLines[gSelectedLineIdx].x = x - gElCanvas.width / 2
    gMemeLines[gSelectedLineIdx].y = y - (gMemeLines[gSelectedLineIdx].location === 'top'
        ? 50 : gMemeLines[gSelectedLineIdx].location === 'middle'
            ? gElCanvas.height / 2 : gElCanvas.height - 50)

    renderMeme(gCurrentImage)
}

function onMouseUp() {
    gIsDragging = false
}

function onTouchStart(event) {
    event.preventDefault()

    clearTimeout(gTapTimeout)

    let rect = gElCanvas.getBoundingClientRect()
    let touch = event.touches[0]
    let x = touch.clientX - rect.left
    let y = touch.clientY - rect.top

    let isAnyLineTouched = false // Flag to track if any line was touched

    // Logic to detect which line was touched
    gMemeLines.forEach((line, idx) => {
        gCtx.font = `${line.fontSize}px ${line.fontType}`
        gCtx.textAlign = line.txtAlign

        let lineY = (line.location === 'top' ? 50 : line.location === 'middle'
            ? gElCanvas.height / 2 : gElCanvas.height - 50) + line.y

        let textWidth = gCtx.measureText(line.txt).width
        let startX = (gElCanvas.width - textWidth) / 2

        if (line.txtAlign === 'left') startX = 20
        else if (line.txtAlign === 'right') startX = gElCanvas.width - textWidth - 20

        if (y > lineY - line.fontSize / 2 && y < lineY + line.fontSize / 2 &&
            x > startX && x < startX + textWidth) {
            isAnyLineTouched = true
            gIsLineSelected = true
            gSelectedLineIdx = idx
            gIsDragging = true

            renderMeme(gCurrentImage)
        }
    })
    // Deselect a line, if touched outside of the line (not on the text)
    if (isAnyLineTouched) {
        gTapTimeout = setTimeout(() => {
            gIsDragging = true
        }, 200)
    } else {
        gIsLineSelected = false
        gSelectedLineIdx = null
        gIsDragging = false
        renderMeme(gCurrentImage)
    }
}

function onTouchMove(event) {
    event.preventDefault()
    if (!gIsDragging || !gIsLineSelected) return

    let rect = gElCanvas.getBoundingClientRect()
    let touch = event.touches[0]
    let x = touch.clientX - rect.left
    let y = touch.clientY - rect.top

    // Update the x and y coordinates of the selected line
    gMemeLines[gSelectedLineIdx].x = x - gElCanvas.width / 2
    gMemeLines[gSelectedLineIdx].y = y - (gMemeLines[gSelectedLineIdx].location === 'top'
        ? 50 : gMemeLines[gSelectedLineIdx].location === 'middle'
            ? gElCanvas.height / 2 : gElCanvas.height - 50)

    renderMeme(gCurrentImage)
}

function onTouchEnd(event) {
    event.preventDefault()
    gIsDragging = false
    clearTimeout(gTapTimeout)
}