/**
 * @fileoverview Main Application Entrypoint for Nick's Bakery.
 * Bootstraps SPA Router, 3D Parallax Tilt, and Liquid Ink Canvas simulation via Barrel Export.
 */

import { Router, LiquidCanvasEngine, ParallaxEngine, OrientationEngine } from './core/index.js?v=1.0.4';

document.addEventListener('DOMContentLoaded', () => {
    // Security & UX settings (disable dragging/selecting)
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());

    // Initialize core engines
    new OrientationEngine();
    const parallax = new ParallaxEngine();
    new LiquidCanvasEngine('ink-canvas');

    const router = new Router({
        renderSelector: '.renderPage',
        navItemSelector: '.item',
        indicatorSelector: '.nav-indicator',
        navBarSelector: '.barra',
        onPageLoaded: () => {
            parallax.startLoop();
        }
    });

    // Initial page load
    router.loadPage('Home');
});
