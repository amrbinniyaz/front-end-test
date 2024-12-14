// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to create slides
async function createSlides() {
    try {
        const response = await fetch('src/js/data.json');
        const data = await response.json();
        
        // Filter items with titles and shuffle them
        const validItems = data.items.filter(item => item.title.trim() !== '');
        const shuffledItems = shuffleArray(validItems);
        const selectedItems = shuffledItems.slice(0, 3);
        
        const container = document.querySelector('.horizontal-container');
        
        // Create slides
        selectedItems.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.id = `slide${index + 1}`;
            
            slide.innerHTML = `
                <div class="content">
                    <h2>${item.title}</h2>
                    <p class="slide-description">${item.description}</p>
                    <img src="${item.image}?q=80&w=3540&auto=format&fit=crop" alt="${item.title}">
                </div>
            `;
            
            container.appendChild(slide);
        });
        
        // Initialize GSAP animations
        initializeAnimations();
    } catch (error) {
        console.error('Error loading slides:', error);
    }
}

// Function to initialize GSAP animations
function initializeAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const horizontalContainer = document.querySelector('.horizontal-container');
    const slides = gsap.utils.toArray('.slide');
    const totalWidth = slides.length * window.innerWidth;

    // Create the horizontal scroll animation
    gsap.to(horizontalContainer, {
        x: -totalWidth + window.innerWidth,
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-section",
            start: "top top",
            end: `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        }
    });

    // Add animations to slides
    slides.forEach((slide) => {
        // Animate the heading
        gsap.fromTo(slide.querySelector('h2'),
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: slide,
                    start: "left center",
                    end: "right center",
                    scrub: true,
                    toggleActions: "play reverse play reverse"
                }
            }
        );

        // Animate the description
        gsap.fromTo(slide.querySelector('.slide-description'),
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: slide,
                    start: "left center",
                    end: "right center",
                    scrub: true,
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    });
}

// Add click event for scroll-down arrow
document.querySelector('.scroll-down').addEventListener('click', () => {
    const verticalSection = document.querySelector('.vertical-section');
    verticalSection.scrollIntoView({ behavior: 'smooth' });
});

// Initialize slides when the page loads
document.addEventListener('DOMContentLoaded', createSlides);
