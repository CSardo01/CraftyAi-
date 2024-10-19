document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const overlay = document.getElementById('image-overlay');
    const overlayImage = document.getElementById('overlay-image');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDescription = document.getElementById('overlay-description');
    const closeOverlay = document.getElementById('close-overlay');
    const prevImage = document.getElementById('prev-image');
    const nextImage = document.getElementById('next-image');

    let currentCentralImages = [];
    let currentImageIndex = 0;

    // Fetch the JSON data
    fetch('gallery-data.json')
        .then(response => response.json())
        .then(data => {
            // Generate the gallery structure
            data.categories.forEach(category => {
                const section = document.createElement('section');
                section.id = category.name.toLowerCase().replace(/\s+/g, '-');
                section.className = 'section category';

                const heading = document.createElement('h1');
                heading.textContent = category.name;
                section.appendChild(heading);

                const bentoContainer = document.createElement('div');
                bentoContainer.className = 'bento-container';

                category.bentoGrids.forEach(grid => {
                    const bentoGrid = document.createElement('div');
                    bentoGrid.className = `bento-grid ${grid.layout}`;

                    grid.images.forEach(image => {
                        const gridItem = document.createElement('div');
                        gridItem.className = `grid-item ${image.type}`;

                        const img = document.createElement('img');
                        img.src = image.src;
                        img.alt = image.alt;

                        if (image.type === 'central') {
                            img.addEventListener('click', () => showOverlay(image));
                            currentCentralImages.push(image);
                        }

                        gridItem.appendChild(img);
                        bentoGrid.appendChild(gridItem);
                    });

                    bentoContainer.appendChild(bentoGrid);
                });

                section.appendChild(bentoContainer);
                galleryContainer.appendChild(section);
            });

            // Add event listeners for hover effects
            const bentoGrids = document.querySelectorAll('.bento-grid');
            bentoGrids.forEach(grid => {
                const centralItem = grid.querySelector('.grid-item.central');
                const secondaryItems = grid.querySelectorAll('.grid-item.secondary');

                function addHoveredClass() {
                    secondaryItems.forEach(item => item.classList.add('hovered'));
                    centralItem.classList.add('hovered');
                }

                function removeHoveredClass() {
                    secondaryItems.forEach(item => item.classList.remove('hovered'));
                    centralItem.classList.remove('hovered');
                }

                centralItem.addEventListener('mouseenter', addHoveredClass);
                centralItem.addEventListener('mouseleave', removeHoveredClass);
            });
        })
        .catch(error => console.error('Error fetching gallery data:', error));

    function showOverlay(image) {
        overlayImage.src = image.src;
        overlayTitle.textContent = image.title;
        overlayDescription.textContent = image.description;
        overlay.style.display = 'flex';
        currentImageIndex = currentCentralImages.findIndex(img => img.src === image.src);
    }

    function hideOverlay() {
        overlay.style.display = 'none';
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + currentCentralImages.length) % currentCentralImages.length;
        showOverlay(currentCentralImages[currentImageIndex]);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentCentralImages.length;
        showOverlay(currentCentralImages[currentImageIndex]);
    }

    closeOverlay.addEventListener('click', hideOverlay);
    prevImage.addEventListener('click', showPreviousImage);
    nextImage.addEventListener('click', showNextImage);
});