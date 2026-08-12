/**
 * @fileoverview Interactive 3D Parallax & Spotlight Engine for Nick's Bakery.
 * Controls 3D element tilt with LERP smoothing and spotlight text interactions.
 * @module core/parallax
 */

export class ParallaxEngine {
    constructor() {
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.parallaxLoop = null;

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const updatePointer = (clientX, clientY) => {
            this.mouseX = clientX;
            this.mouseY = clientY;

            const titleTxt = document.querySelector('.titulo-txt');
            if (titleTxt) {
                const rect = titleTxt.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                titleTxt.style.setProperty('--title-mouse-x', `${x}px`);
                titleTxt.style.setProperty('--title-mouse-y', `${y}px`);
            }
        };

        document.addEventListener('mousemove', (e) => {
            updatePointer(e.clientX, e.clientY);
        });

        document.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                updatePointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        document.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                updatePointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }

    startLoop() {
        if (this.parallaxLoop) cancelAnimationFrame(this.parallaxLoop);

        const icons = document.querySelectorAll('.icon');
        const radius = 250;
        const maxTilt = 45;

        icons.forEach(icon => {
            if (!icon.tiltState) {
                icon.tiltState = { currentX: 0, currentY: 0, targetX: 0, targetY: 0, targetScale: 1, currentScale: 1 };
            }
        });

        const updateTilt = () => {
            icons.forEach(icon => {
                const rect = icon.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = this.mouseX - centerX;
                const dy = this.mouseY - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < radius) {
                    const force = (radius - distance) / radius;
                    
                    icon.tiltState.targetX = -(dy / radius) * maxTilt * force;
                    icon.tiltState.targetY = (dx / radius) * maxTilt * force;
                    icon.tiltState.targetScale = 1 + (0.2 * force);
                } else {
                    icon.tiltState.targetX = 0;
                    icon.tiltState.targetY = 0;
                    icon.tiltState.targetScale = 1;
                }

                const lerpFactor = 0.12; 
                icon.tiltState.currentX += (icon.tiltState.targetX - icon.tiltState.currentX) * lerpFactor;
                icon.tiltState.currentY += (icon.tiltState.targetY - icon.tiltState.currentY) * lerpFactor;
                icon.tiltState.currentScale += (icon.tiltState.targetScale - icon.tiltState.currentScale) * lerpFactor;

                if (Math.abs(icon.tiltState.currentX) > 0.01 || Math.abs(icon.tiltState.currentY) > 0.01 || Math.abs(icon.tiltState.currentScale - 1) > 0.001) {
                    icon.style.setProperty('--rotX', `${icon.tiltState.currentX}deg`);
                    icon.style.setProperty('--rotY', `${icon.tiltState.currentY}deg`);
                    icon.style.setProperty('--tiltScale', icon.tiltState.currentScale);
                } else {
                    icon.style.removeProperty('--rotX');
                    icon.style.removeProperty('--rotY');
                    icon.style.removeProperty('--tiltScale');
                }
            });

            this.parallaxLoop = requestAnimationFrame(updateTilt);
        };
        
        updateTilt();
    }
}
