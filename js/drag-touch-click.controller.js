'use strict'


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

    // Listen for changes to the language selection
    document.querySelector('.language-select').addEventListener('change', function () {
        updateUI(this.value)
    })
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
            const textInput = document.querySelector('.text-input').value = ''
            
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
            const textInput = document.querySelector('.text-input').value = ''

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