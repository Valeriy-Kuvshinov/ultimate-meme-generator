'use strict'

let gTextColor = 'black'
let gFontSize = 40
let gLineHeight = 80

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
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function drawText(text, x, y) {
    gCtx.lineWidth = 1
    gCtx.strokeStyle = gTextColor
    gCtx.fillStyle = gTextColor
    gCtx.font = `${gFontSize}px Arial`
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