'use strict'

let gImgs = createImages() // Global array to hold image objects
let gMemeLines = [] // Global array to hold meme line objects

// Object map to hold the keyword search counts for categories (and to search with those categories)
let gKeywordSearchCountMap = {
    'funny': 20, 'politics': 6, 'cute': 5, 'work': 8
    , 'science': 4, 'media': 10, 'animals': 8, 'life': 2, 'israel': 4
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