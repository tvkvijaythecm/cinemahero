# Cinematic Portfolio Hero

A premium, Apple-level cinematic portfolio hero section built with Next.js 14, Three.js, and GSAP.

## Tech Stack

- **Next.js 14** App Router
- **React 18**
- **Three.js** — custom GLSL shader particle / bokeh layer
- **GSAP** — cinematic entrance animation timeline
- **CSS Modules** — scoped, themeable styles
- **Google Fonts** — Bebas Neue + Cormorant Garamond + Inter

## Features

- 🎬 **Dual video layers** — blurred ambient background + crisp foreground
- ✨ **Three.js bokeh particles** — warm orange + soft white, additive blending, mouse parallax
- 🎞️ **GSAP entrance timeline** — staggered reveal with expo/power easing
- 🖱️ **Custom cursor** — smooth ring with hover expansion
- 🔉 **Sound/play controls** — glassmorphism buttons with auto-hiding hint
- 📱 **Fully responsive** — mobile-optimised layout
- ⚡ **GPU optimised** — requestAnimationFrame loop, proper Three.js cleanup

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add your video**
   ```
   /public/video/hero.mp4
   ```
   Place your talking-head video here. The component references `/video/hero.mp4`.

3. **Personalise content**
   Open `src/components/VideoIntro/VideoIntro.jsx` and update:
   - Name (`.nameFirst`, `.nameLast`)
   - Tagline
   - Role description
   - Stats

4. **Run dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build && npm start
   ```

## File Structure

```
src/
├── app/
│   ├── layout.jsx        # Root layout + Google Fonts
│   ├── page.jsx          # Home page
│   └── globals.css       # Reset + custom cursor styles
└── components/
    ├── VideoIntro/
    │   ├── VideoIntro.jsx        # Main hero component
    │   └── VideoIntro.module.css # Cinematic styles
    ├── CinematicLayer/
    │   ├── CinematicLayer.jsx    # Three.js bokeh particles
    │   └── CinematicLayer.module.css
    └── Cursor/
        └── Cursor.jsx            # Custom magnetic cursor
```

## Customisation

### Colours
Edit CSS variables in `globals.css`:
```css
--orange: #E8783A;      /* Warm accent */
--glass: rgba(255,255,255,0.06);  /* Button fill */
```

### Particles
In `CinematicLayer.jsx`, tweak:
- `COUNT` — number of particles (default 220)
- `sizes` range — particle size (default 5–27px)
- `speeds` range — drift speed (default 0.12–0.47)
- GLSL `vAlpha` in fragmentShader — overall opacity

### Typography
Swap font variables in `layout.jsx` using any [Google Fonts](https://fonts.google.com) pairing.
