# Design System - Nick's Bakery

O Design System do **Nick's Bakery** segue a estética moderna **Glassmorphism**, com paleta de cores HSL viva, tipografia expressiva e microinterações fluidas.

---

## 🎨 Paleta de Cores (Tokens CSS)

| Variável | Valor HSL/Hex | Aplicação |
| :--- | :--- | :--- |
| `--color-primary` | `hsl(343, 91%, 73%)` | Botões primários, pílula de navegação, destaque de títulos |
| `--color-secondary` | `#ff85a1` | Gradientes e efeitos de hover |
| `--color-accent` | `#ff99ac` | Brilho e ícones decorativos |
| `--color-bg-body` | `#f8f9fa` | Fundo principal da aplicação |
| `--color-bg-glass` | `rgba(255, 255, 255, 0.45)` | Backdrop da barra de navegação com blur |
| `--color-text-main` | `#1a1a1a` | Texto de alta visibilidade e cabeçalhos |
| `--color-text-secondary` | `#4a4a4a` | Descrições e subtítulos |

---

## 🔤 Tipografia

- **Heading Accent**: `'Caveat', cursive` (Utilizado para títulos manuscritos informais).
- **Body & Interface**: `'Outfit', 'Inter', system-ui, sans-serif` (Tipografia limpa, geométrica e altamente legível).

---

## 💎 Efeitos Visuais & Interatividade

1. **Spotlight Border**: O container da navegação calcula a coordenada `--mouse-x` e `--mouse-y` para projetar um brilho radial na borda translúcida.
2. **Apple Glassmorphism**: Utilização de `backdrop-filter: blur(40px) saturate(180%)`.
3. **8pt Grid System**: Espaçamentos padronizados em escala modular (4px, 8px, 12px, 16px, 24px, 32px, 48px).
