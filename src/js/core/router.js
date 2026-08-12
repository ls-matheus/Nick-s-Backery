/**
 * @fileoverview Single Page Application (SPA) Router Engine for Nick's Bakery.
 * Controls client-side page navigation, smooth pill transitions, and page state.
 * @module core/router
 */

export class Router {
    constructor(options = {}) {
        this.renderPage = document.querySelector(options.renderSelector || '.renderPage');
        this.navItems = document.querySelectorAll(options.navItemSelector || '.item');
        this.indicator = document.querySelector(options.indicatorSelector || '.nav-indicator');
        this.navBar = document.querySelector(options.navBarSelector || '.barra');
        this.onPageLoaded = options.onPageLoaded || (() => {});

        this.init();
    }

    init() {
        this.bindEvents();
        
        // Initial pill synchronization
        const syncInitial = () => {
            const activeItem = document.querySelector('.item.active');
            if (activeItem) {
                this.updateIndicator(activeItem, 400);
            }
        };

        if (document.readyState === 'complete') {
            syncInitial();
        } else {
            window.addEventListener('load', syncInitial);
        }
        setTimeout(syncInitial, 150);
    }

    bindEvents() {
        const lista = this.navBar ? this.navBar.querySelector('.lista') : null;
        const container = lista || this.navBar;

        this.navItems.forEach(item => {
            const handleSelect = (e) => {
                if (e.type === 'click' || e.type === 'touchstart') {
                    if (e.cancelable) e.preventDefault();
                }

                this.navItems.forEach(i => i.classList.remove('active', 'is-hovered'));
                item.classList.add('active');

                if (container) container.classList.remove('has-hover');
                if (this.navBar) this.navBar.classList.remove('has-hover');

                const page = item.getAttribute('data-page');
                this.loadPage(page);
                this.updateIndicator(item, 380);
            };

            item.addEventListener('click', handleSelect);
            item.addEventListener('touchstart', handleSelect, { passive: false });

            item.addEventListener('mouseenter', () => {
                if (container) container.classList.add('has-hover');
                if (this.navBar) this.navBar.classList.add('has-hover');
                
                this.navItems.forEach(i => i.classList.remove('is-hovered'));
                item.classList.add('is-hovered');
                this.updateIndicator(item, 380);
            });
        });

        if (container) {
            container.addEventListener('mouseleave', () => {
                if (container) container.classList.remove('has-hover');
                if (this.navBar) this.navBar.classList.remove('has-hover');
                
                this.navItems.forEach(i => i.classList.remove('is-hovered'));
                
                const activeItem = document.querySelector('.item.active');
                if (activeItem) {
                    this.updateIndicator(activeItem, 380);
                }
            });
        }

        window.addEventListener('resize', () => {
            const activeItem = document.querySelector('.item.active');
            if (activeItem) {
                this.moveIndicator(activeItem);
            }
        });

        if (this.navBar) {
            this.navBar.addEventListener('mousemove', (e) => {
                const rect = this.navBar.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.navBar.style.setProperty('--mouse-x', `${x}px`);
                this.navBar.style.setProperty('--mouse-y', `${y}px`);
            });
        }
    }

    moveIndicator(activeItem) {
        if (!this.indicator || !activeItem || !this.navBar) return;
        
        const rect = activeItem.getBoundingClientRect();
        const navRect = this.navBar.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) return;
        
        this.indicator.style.width = `${rect.width}px`;
        this.indicator.style.left = `${rect.left - navRect.left}px`;
    }

    updateIndicator(targetItem, duration = 380) {
        if (!targetItem) return;
        this.currentTargetItem = targetItem;

        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }

        const startTime = performance.now();
        const step = (now) => {
            if (!this.currentTargetItem) return;
            this.moveIndicator(this.currentTargetItem);

            if (now - startTime < duration) {
                this.animFrameId = requestAnimationFrame(step);
            } else {
                this.moveIndicator(this.currentTargetItem);
            }
        };

        this.animFrameId = requestAnimationFrame(step);
    }

    async loadPage(pageName) {
        if (!this.renderPage) return;

        try {
            // Try fetching from src/pages directory with cache buster
            let response = await fetch(`src/pages/${pageName}.html?v=${Date.now()}`);
            if (!response.ok) {
                response = await fetch(`src/pages/${pageName.toLowerCase()}.html?v=${Date.now()}`);
            }
            if (!response.ok) throw new Error('Página não encontrada');
            
            const html = await response.text();
            
            this.renderPage.style.opacity = '0';
            setTimeout(() => {
                this.renderPage.innerHTML = html;
                this.renderPage.style.opacity = '1';
                this.renderPage.style.transition = 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
                
                this.onPageLoaded(pageName);
            }, 150);
            
        } catch (err) {
            console.error('Erro ao carregar página:', err);
            this.renderPage.innerHTML = `<div style="padding: 20px; color: #ff4444; text-align: center;">
                <h3>Erro ao carregar "${pageName}"</h3>
                <p>Verifique se o arquivo src/pages/${pageName}.html existe.</p>
            </div>`;
            this.renderPage.style.opacity = '1';
        }
    }
}
