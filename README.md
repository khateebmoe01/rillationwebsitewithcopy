# Rillation Revenue Website

A modern, responsive website for Rillation Revenue built with React and Vite.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📦 Deployment

The project is ready to deploy to various hosting platforms:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect the Vite configuration
4. Deploy!

### Netlify
1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Netlify will use the `netlify.toml` configuration
4. Deploy!

### Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure your server to serve `index.html` for all routes (SPA routing)

## 🎨 Typography

The project uses custom fonts:
- **Headline**: Cooper BT
- **Subheadline**: Asket-Light
- **Paragraph**: Univers Pro 53 Extended

Make sure to include the font files in your project or configure a font service.

## 📁 Project Structure

```
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── App.jsx      # Main app component
│   └── index.css    # Global styles
└── dist/            # Production build (generated)
```
