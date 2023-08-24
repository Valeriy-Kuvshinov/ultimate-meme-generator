'use strict'

function renderGallery() {
    const images = createImages()
    const gallerySection = document.querySelector('.gallery-section')

    images.forEach(image => {
        const imgElement = document.createElement('img')
        imgElement.src = image.url
        imgElement.alt = image.keywords.join(', ')

        imgElement.addEventListener('click', function() {
            onResetMeme()
            onAddLine()
            onAddLine()
            renderMeme(image.url)
            console.log(image)
        })
        gallerySection.appendChild(imgElement)
    })
}