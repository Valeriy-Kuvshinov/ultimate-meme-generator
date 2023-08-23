'use strict'

let gTextColor = 'black'
let gFontSize = 25
let gFontType = 'Arial'

let gImgs = createImages()
let gMemeLines = []

let gKeywordSearchCountMap = {
    'funny': 20, 'cat': 16, 'dog': 20, 'baby': 2, 'politics': 6, 'cute': 5
    , 'trump': 10, 'obama': 12, 'work': 8, 'science': 4, 'aliens': 7, 'media': 10
    , 'hope': 4, 'love': 3, 'matrix': 9, 'leonardo': 5, 'animals': 8, 'life': 2
    , 'putin': 15, 'israel': 4
}

function drawText(text, x, y, color, fontSize, fontType) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = color
    gCtx.fillStyle = color
    gCtx.font = `${fontSize}px ${fontType}`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function increaseFontSize() {
    if (!gMemeLines[gSelectedLineIdx]) return
    if (gMemeLines[gSelectedLineIdx].fontSize > 90) return

    gMemeLines[gSelectedLineIdx].fontSize += 5
}

function reduceFontSize() {
    if (!gMemeLines[gSelectedLineIdx]) return
    if (gMemeLines[gSelectedLineIdx].fontSize < 5) return

    gMemeLines[gSelectedLineIdx].fontSize -= 5
}

function changeFont(selectedFont) {
    if (!gMemeLines[gSelectedLineIdx]) return

    gFontType = selectedFont
    gMemeLines[gSelectedLineIdx].fontType = gFontType
}

function setColor(color) {
    if (!gMemeLines[gSelectedLineIdx]) return

    gTextColor = color
    gMemeLines[gSelectedLineIdx].color = gTextColor
}

function changeText(userText){
    gMemeLines[gSelectedLineIdx].txt = userText
}

function createLine(location, txt, lineIdx) {
    return {
        lineIdx,
        isSelected: false,
        isBold: false,
        txtAlign: 'center',
        txt,
        location,
        color: gTextColor,
        fontSize: gFontSize,
        fontType: gFontType,
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
    for (let i = 1; i <= 18; i++) {
        const imgObj = {
            id: i,
            url: `images/square-aspect-ratio/${i}.jpg`,
            keywords: keywordsArray[i % keywordsArray.length]
        }
        images.push(imgObj)
    }
    return images
}