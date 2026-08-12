/**
 * @fileoverview Gyroscope & Physical Device Orientation Engine for Nick's Bakery.
 * Detects physical smartphone/tablet rotation via Gyroscope and Mobile Screen Orientation.
 * Excludes desktop PCs completely so window resizing never triggers the overlay.
 * @module core/orientation
 */

export class OrientationEngine {
    constructor() {
        this.overlay = document.querySelector('.rotate-screen-overlay');
        
        // Strictly detect if client is a real mobile/tablet device
        this.isMobileDevice = this.detectMobile();

        this.init();
    }

    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;
        const isMobileUA = mobileRegex.test(userAgent);
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const hasWindowOrientation = typeof window.orientation !== 'undefined';

        // macOS iPads report Macintosh in UA, but have touch + maxTouchPoints > 1
        const isIPad = /Macintosh/i.test(userAgent) && hasTouch && navigator.maxTouchPoints > 1;

        return isMobileUA || isIPad || (hasTouch && hasWindowOrientation);
    }

    init() {
        if (!this.overlay) return;

        // If it's a desktop PC, ensure overlay is permanently hidden
        if (!this.isMobileDevice) {
            this.hideOverlay();
            return;
        }

        this.bindEvents();
        this.checkOrientation();
    }

    bindEvents() {
        // Screen Orientation API
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => this.checkOrientation());
        }

        // Legacy orientationchange for iOS / Mobile
        window.addEventListener('orientationchange', () => this.checkOrientation());

        // Gyroscope / DeviceOrientation API
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => this.handleGyroscope(e), true);
        }

        window.addEventListener('resize', () => this.checkOrientation());
    }

    handleGyroscope(event) {
        if (!this.isMobileDevice) return;

        const gamma = event.gamma;
        const beta = event.beta;

        if (gamma === null || beta === null) return;

        // Gyroscope tilt: held horizontally on side (gamma > 45° and beta < 45°)
        const isGyroLandscape = Math.abs(gamma) > 45 && Math.abs(beta) < 45;

        if (isGyroLandscape) {
            this.showOverlay();
        } else {
            this.checkOrientation();
        }
    }

    checkOrientation() {
        // Strictly exclude Desktop PCs
        if (!this.isMobileDevice) {
            this.hideOverlay();
            return;
        }

        let isLandscape = false;

        // 1. Mobile legacy window.orientation (90 or -90 deg)
        if (typeof window.orientation !== 'undefined') {
            isLandscape = Math.abs(window.orientation) === 90;
        }
        // 2. Screen Orientation API on Mobile
        else if (screen.orientation && screen.orientation.type) {
            isLandscape = screen.orientation.type.includes('landscape');
        }
        // 3. Fallback mobile viewport check
        else {
            isLandscape = window.innerWidth > window.innerHeight;
        }

        if (isLandscape) {
            this.showOverlay();
        } else {
            this.hideOverlay();
        }
    }

    showOverlay() {
        if (this.overlay && this.isMobileDevice) {
            document.body.classList.add('is-landscape-blocked');
            this.overlay.style.display = 'flex';
        }
    }

    hideOverlay() {
        if (this.overlay) {
            document.body.classList.remove('is-landscape-blocked');
            this.overlay.style.display = 'none';
        }
    }
}
