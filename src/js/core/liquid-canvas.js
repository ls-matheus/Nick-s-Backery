/**
 * @fileoverview Liquid Ink Canvas Simulation Engine for Nick's Bakery.
 * Handles 2D particle dynamics and real-time SVG gooey canvas masking over avatar images.
 * @module core/liquid-canvas
 */

export class LiquidCanvasEngine {
    constructor(canvasId = 'ink-canvas') {
        this.canvasBg = document.getElementById(canvasId);
        if (!this.canvasBg) return;

        this.ctxBg = this.canvasBg.getContext('2d');
        this.particles = [];
        this.maxParticles = 90;
        
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.lastMouseX = -1000;
        this.lastMouseY = -1000;

        this.init();
    }

    init() {
        this.setupForegroundCanvas();
        this.resize();
        this.bindEvents();
        this.animate();
    }

    setupForegroundCanvas() {
        this.canvasFg = document.createElement('canvas');
        this.canvasFg.id = 'ink-canvas-fg';
        this.canvasFg.style.position = 'fixed';
        this.canvasFg.style.top = '0';
        this.canvasFg.style.left = '0';
        this.canvasFg.style.pointerEvents = 'none';
        this.canvasFg.style.filter = "url('#gooey')";
        this.canvasFg.style.opacity = '0.85';
        this.canvasFg.style.zIndex = '10';
        document.body.appendChild(this.canvasFg);

        this.ctxFg = this.canvasFg.getContext('2d');
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        if (this.canvasBg) {
            this.canvasBg.width = this.width;
            this.canvasBg.height = this.height;
        }
        if (this.canvasFg) {
            this.canvasFg.width = this.width;
            this.canvasFg.height = this.height;
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 200));

        const handlePointer = (clientX, clientY) => {
            if (this.mouseX === -1000 || this.mouseY === -1000) {
                this.mouseX = clientX;
                this.mouseY = clientY;
                this.lastMouseX = clientX;
                this.lastMouseY = clientY;
                this.createParticle(clientX, clientY);
                return;
            }

            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
            this.mouseX = clientX;
            this.mouseY = clientY;

            const dx = this.mouseX - this.lastMouseX;
            const dy = this.mouseY - this.lastMouseY;
            const distance = Math.hypot(dx, dy);

            // Se o mouse saltar mais de 150px (teleporte/reentrada), ignora a interpolação em linha rosa
            if (distance > 150) {
                this.createParticle(this.mouseX, this.mouseY);
                return;
            }

            const steps = Math.max(1, Math.floor(distance / 10));
            for (let i = 0; i < steps; i++) {
                const x = this.lastMouseX + dx * (i / steps);
                const y = this.lastMouseY + dy * (i / steps);
                this.createParticle(x, y);
            }
            this.createParticle(this.mouseX, this.mouseY);
        };

        document.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));
        document.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
            this.lastMouseX = -1000;
            this.lastMouseY = -1000;
        });

        document.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                handlePointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        document.addEventListener('touchend', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
            this.lastMouseX = -1000;
            this.lastMouseY = -1000;
        });
    }

    createParticle(x, y) {
        if (this.particles.length > this.maxParticles) {
            this.particles.shift();
        }
        
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 15 + Math.random() * 15,
            opacity: 0.8,
            decay: 0.015 + Math.random() * 0.01
        });
    }

    animate() {
        this.ctxBg.clearRect(0, 0, this.width, this.height);
        this.ctxFg.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.radius += 0.2; 
            p.opacity -= p.decay;
            
            if (p.opacity <= 0) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }
            
            this.ctxBg.beginPath();
            this.ctxBg.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctxBg.fillStyle = `rgba(255, 133, 161, ${p.opacity})`;
            this.ctxBg.fill();
        }

        const img = document.querySelector('.principal-img.base-img');
        if (img) {
            img.style.opacity = '0';
            const rect = img.getBoundingClientRect();
            
            this.ctxFg.globalCompositeOperation = 'source-over';
            this.ctxFg.drawImage(img, rect.left, rect.top, rect.width, rect.height);
            
            this.ctxFg.globalCompositeOperation = 'destination-out';
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                this.ctxFg.beginPath();
                this.ctxFg.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctxFg.fillStyle = `rgba(0, 0, 0, ${p.opacity})`;
                this.ctxFg.fill();
            }
            this.ctxFg.globalCompositeOperation = 'source-over';
            
            this.canvasFg.style.webkitMaskImage = `linear-gradient(to bottom, black 84%, transparent 100%), url('${img.getAttribute('src')}')`;
            this.canvasFg.style.webkitMaskPosition = `${rect.left}px ${rect.top}px, ${rect.left}px ${rect.top}px`;
            this.canvasFg.style.webkitMaskSize = `${rect.width}px ${rect.height}px, ${rect.width}px ${rect.height}px`;
            this.canvasFg.style.webkitMaskRepeat = 'no-repeat, no-repeat';
            this.canvasFg.style.webkitMaskComposite = 'source-in';
            this.canvasFg.style.visibility = 'visible';
        } else {
            this.canvasFg.style.visibility = 'hidden';
        }
        
        requestAnimationFrame(() => this.animate());
    }
}
