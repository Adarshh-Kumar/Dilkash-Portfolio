// ---- Custom Cursor ----
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, .btn, .magnet, .project-card, .tool-item');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Quick move for inner dot
    gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out'
    });
});

// Smooth follow for outer ring
gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    gsap.set(follower, { x: cursorX, y: cursorY });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        if(link.classList.contains('magnet')) {
            cursor.classList.add('magnet-active');
        }
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        cursor.classList.remove('magnet-active');
        gsap.to(link, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    });
    
    // Magnetic Pull Effect
    if(link.classList.contains('magnet')) {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            gsap.to(link, {
                x: relX * 0.3,
                y: relY * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
});

// ---- Loading Screen & Intro Animation ----
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    tl.to('#loader', {
        opacity: 0,
        duration: 1,
        ease: 'power3.inOut',
        onComplete: () => {
            document.getElementById('loader').style.display = 'none';
        }
    })
    .from('.navbar', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.5")
    .from('.hero .subtitle', { y: 20, opacity: 0, duration: 1 }, "-=0.8")
    .from('.hero .title', { y: 20, opacity: 0, duration: 1 }, "-=0.8")
    .from('.typing-container', { opacity: 0, duration: 1 }, "-=0.6")
    .from('.cta-group, .tagline', { y: 20, opacity: 0, duration: 1, stagger: 0.2 }, "-=0.8");
});

// ---- Navbar Scroll Effect ----
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// ---- Typing Effect ----
const typedSpan = document.getElementById("typing-text");
const textArray = ["Python", "SQL", "Power BI", "Data Analysis", "Machine Learning"];
const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}
setTimeout(type, newTextDelay + 1000);

// ---- GSAP ScrollTrigger Animations ----
gsap.registerPlugin(ScrollTrigger);

// Reveal Sections
document.querySelectorAll('.section-title').forEach(title => {
    gsap.to(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });
});

// About Cards Reveal
gsap.to('.about-card', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// Skills Progress Bar Fill
document.querySelectorAll('.skill-item').forEach(item => {
    const progress = item.querySelector('.progress');
    const width = progress.getAttribute('data-width');
    gsap.to(progress, {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        width: width,
        duration: 1.5,
        ease: 'power2.out'
    });
});

// Timeline Journey items
gsap.from('.timeline-item', {
    scrollTrigger: { trigger: '.timeline-container', start: 'top 80%' },
    x: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// Project Cards Tilt Effect (Vanilla JS + GSAP)
document.querySelectorAll('.project-card.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max tilt rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: 'power1.out',
            duration: 0.5
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            ease: 'power2.out',
            duration: 1
        });
    });
});

// ---- Three.js Background Animation (Nodes/Particles) ----
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 150;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particle system setup
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 300; // Increased for a denser network look
const posArray = new Float32Array(particlesCount * 3);

// Fill particles
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 350; // Spread wide across X,Y,Z
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Particle Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 1.5,
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

// Optional: Subtle connection lines logic inside render loop would be heavy, 
// so we will animate the mesh rotation based on scroll and mouse.

// Mouse interaction tracking for background
let bgMouseX = 0;
let bgMouseY = 0;

document.addEventListener('mousemove', (event) => {
    bgMouseX = event.clientX / window.innerWidth - 0.5;
    bgMouseY = event.clientY / window.innerHeight - 0.5;
});

// Scroll interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animateBg() {
    requestAnimationFrame(animateBg);
    const elapsedTime = clock.getElapsedTime();
    
    // Slow continuous rotation
    particleMesh.rotation.y = elapsedTime * 0.05;
    particleMesh.rotation.x = elapsedTime * 0.02;
    
    // Interactive parallax element based on mouse and scroll
    gsap.to(camera.position, {
        x: bgMouseX * 50,
        y: bgMouseY * 50 - (scrollY * 0.05),
        duration: 2,
        ease: "power2.out"
    });
    
    // Dynamic color pulsing across vertices
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < particlesCount; i++) {
        // Subtle drift
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime + positions[i3]) * 0.02; 
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start Background animation
animateBg();

// Form Submit Handling
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.querySelector('.form-status');
    const btn = document.querySelector('.submit-btn');
    
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
    
    setTimeout(() => {
        status.innerHTML = `<span style="color: #00f2fe;"><i class="fas fa-check-circle"></i> Message sent successfully!</span>`;
        btn.innerHTML = `<span>Send Message</span><i class="fas fa-paper-plane"></i>`;
        e.target.reset();
        setTimeout(() => { status.innerHTML = ''; }, 3000);
    }, 1500);
});
