// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let swiper = null;
let gsapAnimation = null;

// Initialize mobile slider
function initMobileSlider() {
    if (swiper === null) {
        swiper = new Swiper('.swiper', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            grabCursor: true,
            touchRatio: 1,
            loop: true
        });
    }
}

// Initialize desktop horizontal scroll
function initDesktopScroll() {
    if (gsapAnimation === null) {
        const container = document.querySelector('.horizontal-container');
        const slides = gsap.utils.toArray('.slide');
        const totalWidth = slides.length * window.innerWidth;
        
        // Reset container width for desktop
        container.style.width = `${totalWidth}px`;
        
        gsapAnimation = gsap.to(container, {
            x: -totalWidth + window.innerWidth,
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-section",
                start: "top top",
                end: () => `+=${totalWidth - window.innerWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });
    }
}

// Function to handle resize and initialization
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const container = document.querySelector('.horizontal-container');
    
    if (isMobile) {
        if (gsapAnimation) {
            gsapAnimation.scrollTrigger.kill();
            gsapAnimation.kill();
            gsapAnimation = null;
        }
        container.style.width = '100%';
        container.style.transform = '';
        initMobileSlider();
    } else {
        if (swiper) {
            swiper.destroy();
            swiper = null;
        }
        initDesktopScroll();
    }
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
        
        const container = document.querySelector('.swiper-wrapper');
        
        // Create slides
        selectedItems.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide swiper-slide';
            slide.id = `slide${index + 1}`;
            
            slide.innerHTML = `
                <div class="content">
                    <h2>${item.title}</h2>
                    <p class="slide-description">${item.description}</p>
                    <img class="lazyload" 
                         src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" 
                         data-src="${item.image}?q=80&w=3540&auto=format&fit=crop" 
                         alt="${item.title}">
                </div>
            `;
            
            container.appendChild(slide);
        });
        
        // Initialize based on screen size
        handleResize();
    } catch (error) {
        console.error('Error loading slides:', error);
    }
}

// Initialize carousel list and GSAP animations
async function initCarouselList() {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=10');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const carouselList = document.querySelector('.carousel-list');
        if (!carouselList) {
            return;
        }

        // Clear existing items
        carouselList.innerHTML = '';
        
        // Transform and create carousel items from products
        if (!data.products || !Array.isArray(data.products)) {
            return;
        }

        data.products.forEach((product, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            carouselItem.innerHTML = `
                <div class="item-image">
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>
                <div class="item-content">
                    <a href="#product-${product.id}" target="_blank">${product.title}</a>
                </div>
            `;
            carouselList.appendChild(carouselItem);
        });
        
        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Make left section sticky only on desktop
        if (window.innerWidth > 768) {
            gsap.to("#sticky_section", {
                scrollTrigger: {
                    trigger: ".sticky__left",
                    start: "top top",
                    endTrigger: ".items__col",
                    end: "bottom bottom",
                    pin: true,
                    pinSpacing: true
                }
            });
        }

        // Animate carousel items on scroll
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: false,
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.1
            });
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize both sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    swiperScript.onload = () => {
        createSlides();
        initCarouselList();
    };
    document.body.appendChild(swiperScript);
});

// Handle resize events
window.addEventListener('resize', handleResize);

// Add click event for scroll-down arrow
document.querySelector('.scroll-down').addEventListener('click', () => {
    const verticalSection = document.querySelector('.vertical-section');
    verticalSection.scrollIntoView({ behavior: 'smooth' });
});
