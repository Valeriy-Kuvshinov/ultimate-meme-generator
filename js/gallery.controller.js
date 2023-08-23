'use strict'

function renderGallery() {
    const images = createImages()
    const gallerySection = document.querySelector('.gallery-section')

    images.forEach(image => {
        const imgElement = document.createElement('img')
        imgElement.src = image.url;
        imgElement.alt = image.keywords.join(', ')

        imgElement.addEventListener('click', function() {
            renderMeme(image.url)
        })
        gallerySection.appendChild(imgElement);
    })
}