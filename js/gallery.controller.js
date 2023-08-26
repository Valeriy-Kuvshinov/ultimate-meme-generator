'use strict'

// Function to render the image gallery
function renderGallery(imagesToRender) {
    // Grab the gallery section from the HTML document
    const gallerySection = document.querySelector('.gallery-section')

    gallerySection.innerHTML = '' // Clear existing images

    // Loop through the array of images to be rendered
    imagesToRender.forEach(image => {
        const imgElement = document.createElement('img') // Create an image element for each image object
        imgElement.src = image.url // Set the image source URL
        imgElement.alt = image.keywords.join(', ') // Add the image's keywords as its alt text

        // Attach a click event listener to each image element
        // Render the selected image into the canvas, and clear the canvas from what was prior
        imgElement.addEventListener('click', function () {
            onResetMeme()
            onAddLine()
            onAddLine()
            onToggleLine()
            renderMeme(image.url)
            console.log(image)
        })
        gallerySection.appendChild(imgElement) // Append the image element to the gallery section
    })
}

// Function to filter the gallery based on search term
function filterGallery() {
    // Get the search term from the input field and convert it to lowercase
    const searchTerm = document.getElementById('image-search').value.toLowerCase()

    // Filter the images whose keywords include the search term
    const filteredImages = gImgs.filter(img => {
        return img.keywords.some(keyword => {
            // Convert the keyword to lowercase and check if it includes the search term
            if (keyword.toLowerCase().includes(searchTerm)) {
                // Update the search count for this keyword
                if (gKeywordSearchCountMap[keyword]) {
                    gKeywordSearchCountMap[keyword]++
                } else {
                    // Initialize the count for this keyword if it doesn't exist
                    gKeywordSearchCountMap[keyword] = 1
                }
                return true
            }
            return false
        })
    })
    renderGallery(filteredImages) // Render gallery with filtered images
}

