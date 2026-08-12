const canvasBg = document.getElementById('ink-canvas');
const ctxBg = canvasBg.getContext('2d');

const canvasFg = document.createElement('canvas');
canvasFg.id = 'ink-canvas-fg';
canvasFg.style.position = 'fixed';
canvasFg.style.top = '0';
canvasFg.style.left = '0';
canvasFg.style.pointerEvents = 'none';
canvasFg.style.filter = "url('#gooey')";
canvasFg.style.opacity = '0.85';
canvasFg.style.zIndex = '10';
document.body.appendChild(canvasFg);

const ctxFg = canvasFg.getContext('2d');

let width, height;
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvasBg.width = width;
    canvasBg.height = height;
    canvasFg.width = width;
    canvasFg.height = height;
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));
resize();

const particles = [];
const maxParticles = 90; 

let mouseX = -1000;
let mouseY = -1000;
let lastMouseX = -1000;
let lastMouseY = -1000;

function handlePointer(clientX, clientY) {
    lastMouseX = mouseX === -1000 ? clientX : mouseX;
    lastMouseY = mouseY === -1000 ? clientY : mouseY;
    
    mouseX = clientX;
    mouseY = clientY;
    
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const distance = Math.hypot(dx, dy);
    
    const steps = Math.max(1, Math.floor(distance / 10)); 
    
    for (let i = 0; i < steps; i++) {
        const x = lastMouseX + dx * (i / steps);
        const y = lastMouseY + dy * (i / steps);
        createParticle(x, y);
    }
    createParticle(mouseX, mouseY);
}

document.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

function createParticle(x, y) {
    if (particles.length > maxParticles) {
        particles.shift();
    }
    
    particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 15 + Math.random() * 15,
        opacity: 0.8,
        decay: 0.015 + Math.random() * 0.01
    });
}

function animate() {
    ctxBg.clearRect(0, 0, width, height);
    ctxFg.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.radius += 0.2; 
        p.opacity -= p.decay;
        
        if (p.opacity <= 0) {
            particles.splice(i, 1);
            i--;
            continue;
        }
        
        ctxBg.beginPath();
        ctxBg.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctxBg.fillStyle = `rgba(255, 133, 161, ${p.opacity})`;
        ctxBg.fill();
    }
    
    const img = document.querySelector('.principal-img.base-img');
    if (img) {
        img.style.opacity = '0';
        
        const rect = img.getBoundingClientRect();
        
        ctxFg.globalCompositeOperation = 'source-over';
        ctxFg.drawImage(img, rect.left, rect.top, rect.width, rect.height);
        
        ctxFg.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctxFg.beginPath();
            ctxFg.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctxFg.fillStyle = `rgba(0, 0, 0, ${p.opacity})`;
            ctxFg.fill();
        }
        ctxFg.globalCompositeOperation = 'source-over';
        
        canvasFg.style.webkitMaskImage = `linear-gradient(to bottom, black 84%, transparent 100%), url('${img.getAttribute('src')}')`;
        canvasFg.style.webkitMaskPosition = `${rect.left}px ${rect.top}px, ${rect.left}px ${rect.top}px`;
        canvasFg.style.webkitMaskSize = `${rect.width}px ${rect.height}px, ${rect.width}px ${rect.height}px`;
        canvasFg.style.webkitMaskRepeat = 'no-repeat, no-repeat';
        canvasFg.style.webkitMaskComposite = 'source-in';
        canvasFg.style.visibility = 'visible';
    } else {
        canvasFg.style.visibility = 'hidden';
    }
    
    requestAnimationFrame(animate);
}

animate();
