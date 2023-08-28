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

    updateUI('en') // Initialize the UI with the default language (English)

    addEventListeners() // Attach event listeners to elements
}

// Function to render a meme on canvas
function renderMeme(imageUrl, callback = null) {
    gCurrentImage = imageUrl
    const img = new Image()

    img.onload = () => {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

        gMemeLines.forEach(({
            txt, color, fontSize, fontType, txtAlign, isBold, location, x: lineX, y: lineY
        }, idx) => {
            const y = ((location === 'top' ? 50 : location === 'middle'
                ? gElCanvas.height / 2 : gElCanvas.height - 50) + lineY)
            let x = (gElCanvas.width / 2) + lineX

            x = txtAlign === 'left' ? 20 : txtAlign === 'right' ? gElCanvas.width - 20 : x

            drawText(txt, x, y, color, fontSize, fontType, gElCanvas.width - 30
                , txtAlign, isBold)

            const textWidth = gCtx.measureText(txt).width
            const padding = 10
            let rectX = x - textWidth / 2 - padding

            rectX = txtAlign === 'left' ? x - padding : txtAlign === 'right'
                ? x - textWidth - padding - 5 : rectX
            let rectY = y - fontSize / 2 - padding

            if (gIsLineSelected && gSelectedLineIdx === idx) {
                drawSelectedBorder(rectX, rectY, textWidth + 2 * padding
                    , fontSize + 2 * padding, 10, 'rgba(255, 255, 255, 0.3)')
            }
        })
        if (callback) {
            callback()
        }
    }
    img.src = imageUrl
}

// Function to draw text on the canvas
function drawText(text, x, y, color, fontSize, fontType, maxWidth, textAlign, isBold, xOffset = 0, yOffset = 0) {
    // Determine font weight based on isBold flag
    let fontWeight = isBold ? 'bold' : 'normal'

    // Set up text stroke and fill styles
    gCtx.lineWidth = 1
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = color

    // Configure font settings
    gCtx.font = `${fontWeight} ${fontSize}px ${fontType}`
    gCtx.textAlign = textAlign

    // Apply offset adjustments
    x += xOffset
    y += yOffset

    gCtx.textBaseline = 'middle' // Align text to the middle vertically

    // Split the text by spaces to handle each word
    let words = text.split(' ')

    // Initialize variables
    let line = ''
    let lineHeights = []

    // Loop to arrange words in lines
    for (let n = 0; n < words.length; n++) {
        // Construct a test line appending the next word
        let testLine = line + words[n] + ' '

        // Measure the text width
        let metrics = gCtx.measureText(testLine)
        let testWidth = metrics.width

        // If the line is too wide, draw it and start a new one
        if (testWidth > maxWidth && n > 0) {
            gCtx.fillText(line, x, y)
            gCtx.strokeText(line, x, y)
            lineHeights.push(y)
            line = words[n] + ' '
            y += fontSize
        }
        else line = testLine
    }
    // Draw and stroke any remaining text
    gCtx.fillText(line, x, y)
    gCtx.strokeText(line, x, y)
    lineHeights.push(y)

    return lineHeights
}

// Function to draw a border around the selected text
function drawSelectedBorder(x, y, width, height, radius, fillColor, xOffset = 0, yOffset = 0) {
    // Apply offset adjustments
    x += xOffset
    y += yOffset

    // Draw a rounded rectangle, rectangle will be drawn around the line
    gCtx.beginPath()
    gCtx.moveTo(x + radius, y)
    gCtx.lineTo(x + width - radius, y)
    gCtx.arcTo(x + width, y, x + width, y + radius, radius)
    gCtx.lineTo(x + width, y + height - radius)
    gCtx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
    gCtx.lineTo(x + radius, y + height)
    gCtx.arcTo(x, y + height, x, y + height - radius, radius)
    gCtx.lineTo(x, y + radius)
    gCtx.arcTo(x, y, x + radius, y, radius)
    gCtx.closePath()
    gCtx.fillStyle = fillColor
    gCtx.fill()
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
    const textInput = document.querySelector('.text-input').value = ''
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
    gSelectedLineIdx = null

    renderMeme(gCurrentImage, () => {
        // The callback function will execute after renderMeme() is complete
        const dataUrl = gElCanvas.toDataURL()
        elLink.href = dataUrl
        elLink.download = 'my-img' // Set a name for the downloaded file
    })
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

function updateUI(language) {
    const langTranslations = translations[language]
    const translatableElements = document.querySelectorAll('[data-trans]')
    const textInput = document.querySelector('.text-input')

    if (language === 'he') {
        document.body.setAttribute('dir', 'rtl')
        textInput.style.direction = 'rtl'
        textInput.style.textAlign = 'right'
    } else {
        document.body.setAttribute('dir', 'ltr')
        textInput.style.direction = 'ltr'
        textInput.style.textAlign = 'left'
    }

    translatableElements.forEach(element => {
        const key = element.getAttribute('data-trans')
        if (langTranslations[key]) {
            if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                element.placeholder = langTranslations[key]
            } else element.textContent = langTranslations[key]
        }
    })
}
