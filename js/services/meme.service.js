'use strict'

let gTextColor = 'black'
let gFontSize = 20
let gFontType = 'Arial'

var gImgs = createImages()
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red'
        }
    ]
}
var gKeywordSearchCountMap = {
    'funny': 20, 'cat': 16, 'dog': 20, 'baby': 2, 'politics': 6, 'cute': 5
    , 'trump': 10, 'obama': 12, 'work': 8, 'science': 4, 'aliens': 7, 'media': 10
    , 'hope': 4, 'love': 3, 'matrix': 9, 'leonardo': 5, 'animals': 8, 'life': 2
    , 'putin': 15, 'israel': 4
}

function drawText(text, x, y) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = gTextColor
    gCtx.fillStyle = gTextColor
    gCtx.font = `${gFontSize}px ${gFontType}`
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function increaseFontSize() {
    if (gFontSize > 98) return
    gFontSize += 5
}

function reduceFontSize() {
    if (gFontSize < 5) return
    gFontSize -= 5
}

function changeFont(selectedFont) {
    gFontType = selectedFont
    gCtx.font = `${gFontSize}px ${gFontType}`
}

function setColor(color) {
    gTextColor = color
}

function createImages() {
    const images = [];
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