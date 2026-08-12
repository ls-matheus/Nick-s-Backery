# Arquitetura de Software - Nick's Bakery

Visão geral da estrutura do projeto **Nick's Bakery**.

---

## 🧩 Camadas do Sistema

### 1. Entrypoint (`main.html`)
Ponto de entrada que carrega os estilos em `Styles/Desktop/` e os scripts de interação em `Backend/`.

### 2. Navegação Assíncrona (`Backend/NavSystem.js`)
- Roteador dinâmico client-side que carrega as páginas contidas em `Nav/*.html`.
- Sistema de movimentação suave do indicador rosa da barra de navegação.
- Cálculo de interpolação LERP e tilt 3D para os ícones decorativos.

### 3. Engine de Efeito Líquido (`Backend/liquid.js`)
- Renderização de partículas Canvas 2D interativas.
- Utilização do filtro SVG `#gooey` para efeito de fusão líquida sobre o avatar.

### 4. Estilos (`Styles/Desktop/`)
- `NavUniversal.css`: Menu com efeito glassmorphism e iluminação de spotlight.
- `Home.css`: Estrutura responsiva da tela principal.
- `imgs.css`: Animações e posicionamento dos ícones flutuantes.
- `DesktopView.css`: Canvas container e definições de layout.
