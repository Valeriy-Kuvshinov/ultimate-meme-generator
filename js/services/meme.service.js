'use strict'

let gImgs = createImages()
let gMemeLines = []

let gKeywordSearchCountMap = {
    'funny': 20, 'cat': 16, 'dog': 20, 'baby': 2, 'politics': 6, 'cute': 5
    , 'trump': 10, 'obama': 12, 'work': 8, 'science': 4, 'aliens': 7, 'media': 10
    , 'hope': 4, 'love': 3, 'matrix': 9, 'leonardo': 5, 'animals': 8, 'life': 2
    , 'putin': 15, 'israel': 4
}

function drawText(text, x, y, color, fontSize, fontType, maxWidth, textAlign) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = color
    gCtx.fillStyle = color
    gCtx.font = `${fontSize}px ${fontType}`

    if (textAlign === 'left') x = 20
    else if (textAlign === 'right') x = gElCanvas.width - 12
    else x = gElCanvas.width / 2 + 4
    gCtx.textAlign = textAlign

    gCtx.textBaseline = 'middle'

    let words = text.split(' ')
    let line = ''
    let lineHeights = []

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' '
        let metrics = gCtx.measureText(testLine)
        let testWidth = metrics.width

        if (testWidth > maxWidth && n > 0) {
            gCtx.fillText(line, x, y)
            gCtx.strokeText(line, x, y)
            lineHeights.push(y)
            line = words[n] + ' '
            y += fontSize
        }
        else line = testLine
    }
    gCtx.fillText(line, x, y)
    gCtx.strokeText(line, x, y)
    lineHeights.push(y)

    return lineHeights
}

function drawSelectedBorder(x, y, width, height, radius, fillColor) {
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

function changeText(userText) {
    gMemeLines[gSelectedLineIdx].txt = userText
}

function createLine(location, txt, lineIdx) {
    return {
        lineIdx,
        isBold: false,
        txtAlign: 'center',
        txt,
        location,
        color: 'black',
        fontSize: 30,
        fontType: 'Arial',
    }
}

function createImages() {
    const images = []
    const keywordsArray = [
        ['funny', 'politics', 'trump'],
        ['cute', 'animals', 'dog'],
        ['cute', 'animals', 'dog', 'baby'],
        ['cute', 'funny', 'cat', 'work'],
        ['cute', 'funny', 'baby'],
        ['science', 'funny', 'aliens', 'media'],
        ['cute', 'funny', 'baby'],
        ['funny', 'life', 'work', 'media'],
        ['cute', 'funny', 'baby'],
        ['politics', 'funny', 'obama'],
        ['love', 'life', 'hope'],
        ['funny', 'life', 'work', 'israel'],
        ['life', 'funny', 'leonardo'],
        ['funny', 'life', 'matrix', 'media'],
        ['media', 'funny', 'life'],
        ['media', 'funny', 'life'],
        ['politics', 'funny', 'putin'],
        ['media', 'funny', 'life'],
    ]
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