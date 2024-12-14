gsap.registerPlugin(ScrollTrigger);

// Calculate the total width of horizontal slides
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
slides.forEach((slide, i) => {
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
            opacity: 0.9,
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

    // Add a subtle zoom effect to images
    gsap.fromTo(slide.querySelector('img'),
        {
            scale: 1.1
        },
        {
            scale: 1,
            duration: 1,
            scrollTrigger: {
                trigger: slide,
                start: "left right",
                end: "right left",
                scrub: true
            }
        }
    );
});
