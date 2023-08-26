'use strict'

let gImgs = createImages() // Global array to hold image objects
let gMemeLines = [] // Global array to hold meme line objects

// Object map to hold the keyword search counts for categories (and to search with those categories)
let gKeywordSearchCountMap = {
    'funny': 20, 'politics': 6, 'cute': 5, 'work': 8
    , 'science': 4, 'media': 10, 'animals': 8, 'life': 2, 'israel': 4
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

// Function to change font size, font type, color and text alignment of the selected line
function increaseFontSize() {
    if (gMemeLines[gSelectedLineIdx].fontSize > 50) return
    gMemeLines[gSelectedLineIdx].fontSize += 5
}
function reduceFontSize() {
    if (gMemeLines[gSelectedLineIdx].fontSize < 20) return
    gMemeLines[gSelectedLineIdx].fontSize -= 5
}
function changeFont(selectedFont) {
    gMemeLines[gSelectedLineIdx].fontType = selectedFont
}
function setColor(color) {
    gMemeLines[gSelectedLineIdx].color = color
}
function changeTextAlign(alignValue) {
    gMemeLines[gSelectedLineIdx].txtAlign = alignValue
}

// Function to create a line object for a meme
function createLine(location, txt, lineIdx) {
    return {
        lineIdx,
        isBold: false,
        txtAlign: 'center',
        txt,
        location,
        x: 0,
        y: 0,
        color: 'white',
        fontSize: 30,
        fontType: 'Impact',
    }
}

// Function to create image objects with id, url and keywords
function createImages() {
    const images = []
    const keywordsArray = [ // Assign keywords to the images
        ['funny', 'politics'],
        ['cute', 'animals'],
        ['cute', 'animals'],
        ['cute', 'funny', 'work'],
        ['cute', 'funny'],
        ['science', 'funny', 'media'],
        ['cute', 'funny'],
        ['life', 'work', 'media'],
        ['cute', 'funny'],
        ['politics', 'funny'],
        ['funny', 'life'],
        ['life', 'work', 'israel'],
        ['life', 'funny', 'media'],
        ['funny', 'life', 'media'],
        ['media', 'funny', 'life'],
        ['media', 'funny', 'life'],
        ['politics', 'funny'],
        ['media', 'funny', 'life'],
    ]
    // Create image objects and push them into the array
    for (let i = 1; i < 19; i++) {
        const imgObj = {
            id: i,
            url: `images/square-aspect-ratio/${i}.jpg`,
            keywords: keywordsArray[(i - 1) % keywordsArray.length]
        }
        images.push(imgObj)
    }
    return images
}