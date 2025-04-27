document.addEventListener('DOMContentLoaded', function() {
    // Review data - 5 different reviews with 5-star ratings
    const reviews = [
        {
            stars: 5,
            text: "Transformed our entire workflow! The integration was seamless and the results exceeded every expectation we set.",
            reviewer: "Sarah Johnson",
            company: "Tech Innovations Ltd."
        },
        {
            stars: 5,
            text: "The most intuitive platform we've ever used. Our team productivity increased by 40% within the first month of implementation.",
            reviewer: "Michael Chen",
            company: "Growth Ventures Inc."
        },
        {
            stars: 5,
            text: "Exceptional customer service paired with a powerful product. It's rare to find both in one package, but they delivered perfectly.",
            reviewer: "Taylor Rodriguez",
            company: "Summit Solutions"
        },
        {
            stars: 5,
            text: "This solution solved problems we didn't even know we had. The analytics capability alone has transformed our decision-making process.",
            reviewer: "Alex Morgan",
            company: "Insight Analytics"
        },
        {
            stars: 5,
            text: "Worth every penny! The ROI has been incredible, and the platform continues to evolve with new features that consistently add value.",
            reviewer: "Jordan Smith",
            company: "Forward Enterprises"
        }
    ];

    const carouselContainer = document.getElementById('reviewCarousel');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    let currentIndex = 0;
    let autoRotateInterval;
    let isPaused = false;
    let isAnimating = false;

    // Initialize the carousel
    function initCarousel() {
        // Create review cards
        reviews.forEach((review, index) => {
            // Create review card
            const card = document.createElement('div');
            card.className = `review-card ${index === 0 ? 'active' : ''}`;
            
            // Create stars
            const starsDiv = document.createElement('div');
            starsDiv.className = 'stars';
            for (let i = 0; i < review.stars; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.innerHTML = '<i class="fas fa-star"></i>';
                starsDiv.appendChild(star);
            }
            
            // Create review text
            const textDiv = document.createElement('div');
            textDiv.className = 'review-text';
            textDiv.textContent = review.text;
            
            // Create reviewer info
            const reviewerDiv = document.createElement('div');
            reviewerDiv.className = 'reviewer';
            reviewerDiv.textContent = review.reviewer;
            
            const companyDiv = document.createElement('div');
            companyDiv.className = 'company';
            companyDiv.textContent = review.company;
            
            // Append all elements to the card
            card.appendChild(starsDiv);
            card.appendChild(textDiv);
            card.appendChild(reviewerDiv);
            card.appendChild(companyDiv);
            
            // Append the card to the carousel
            carouselContainer.appendChild(card);
            
            // Create indicator for this review
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index;
            
            // Add click event to indicator
            indicator.addEventListener('click', () => {
                if (isAnimating) return;
                goToSlide(index);
                resetAutoRotate();
            });
            
            indicatorsContainer.appendChild(indicator);
        });

        // Create carousel controls
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'carousel-controls';
        
        const prevBtn = document.createElement('div');
        prevBtn.className = 'control-btn prev-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            prevSlide();
            resetAutoRotate();
        });
        
        const nextBtn = document.createElement('div');
        nextBtn.className = 'control-btn next-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            nextSlide();
            resetAutoRotate();
        });
        
        controlsDiv.appendChild(prevBtn);
        controlsDiv.appendChild(nextBtn);
        
        // Append controls to the carousel container
        const carouselContainerParent = carouselContainer.parentElement;
        carouselContainerParent.appendChild(controlsDiv);

        // Add pause on hover events
        carouselContainer.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            isPaused = false;
            resetAutoRotate();
        });

        // Set initial slide adjacents for 3D effect
        updateAdjacentSlides();

        // Start auto-rotation
        startAutoRotate();

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;
            
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoRotate();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoRotate();
            }
        });

        // Add swipe support for touch devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            if (isAnimating) return;
            
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next slide
                nextSlide();
                resetAutoRotate();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous slide
                prevSlide();
                resetAutoRotate();
            }
        }
    }

    // Function to go to a specific slide
    function goToSlide(index) {
        if (currentIndex === index) return;
        
        isAnimating = true;
        
        const reviewCards = document.querySelectorAll('.review-card');
        const indicators = document.querySelectorAll('.indicator');
        
        // Remove all special classes
        reviewCards.forEach(card => {
            card.classList.remove('active', 'prev', 'next');
        });
        
        // Remove active class from current indicator
        indicators[currentIndex].classList.remove('active');
        
        // Update current index
        currentIndex = index;
        
        // Add active class to new slide and indicator
        reviewCards[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
        
        // Update adjacent slides for 3D effect
        updateAdjacentSlides();
        
        // Reset animation state after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Match with the CSS transition duration
    }

    // Function to update adjacent slides for 3D effect
    function updateAdjacentSlides() {
        const reviewCards = document.querySelectorAll('.review-card');
        const totalSlides = reviewCards.length;
        
        // Calculate prev and next indices
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        const nextIndex = (currentIndex + 1) % totalSlides;
        
        // Add prev and next classes
        reviewCards[prevIndex].classList.add('prev');
        reviewCards[nextIndex].classList.add('next');
    }

    // Function to go to the next slide
    function nextSlide() {
        if (isPaused || isAnimating) return;
        
        const reviewCards = document.querySelectorAll('.review-card');
        let nextIndex = (currentIndex + 1) % reviewCards.length;
        goToSlide(nextIndex);
    }

    // Function to go to the previous slide
    function prevSlide() {
        if (isPaused || isAnimating) return;
        
        const reviewCards = document.querySelectorAll('.review-card');
        let prevIndex = (currentIndex - 1 + reviewCards.length) % reviewCards.length;
        goToSlide(prevIndex);
    }

    // Function to start auto-rotation
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            if (!isPaused && !isAnimating) {
                nextSlide();
            }
        }, 3000);
    }

    // Function to reset auto-rotation (after user interaction)
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    // Add a subtle entrance animation when page loads
    function addEntranceAnimation() {
        const carouselElement = document.querySelector('.review-carousel-container');
        carouselElement.style.opacity = '0';
        carouselElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            carouselElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            carouselElement.style.opacity = '1';
            carouselElement.style.transform = 'translateY(0)';
        }, 300);
    }

    // Initialize the carousel
    initCarousel();
    addEntranceAnimation();
});
