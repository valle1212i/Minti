# Minti Wellness Website

A modern, elegant wellness company website built with React, inspired by premium wellness destinations like Yasuragi, COMO Shambhala Estate, and Lanserhof.

## Features

- **Modern React Architecture**: Built with React 18 and React Router for seamless navigation
- **Responsive Design**: Fully responsive layout that works beautifully on all devices
- **Elegant UI/UX**: Clean, minimalist design with spacious layouts and beautiful typography
- **Multiple Pages**: Home, About, Services, Gallery, and Contact pages
- **Interactive Components**: Image galleries with lightbox, contact forms, and smooth animations

## Design Inspiration

The website design is inspired by:
- **Yasuragi**: Minimalist Japanese-inspired aesthetics, clean layouts, and serene imagery
- **COMO Shambhala Estate**: Luxurious full-width images and immersive experiences
- **Lanserhof**: Modern clarity and focus on health and wellness

## Key Design Elements

- **Typography**: Playfair Display for headings, Inter for body text
- **Color Palette**: Natural greens (#5a7c65), neutral grays, and whites
- **Layout**: Spacious sections with ample white space
- **Images**: Large, high-quality placeholder areas ready for real images
- **Navigation**: Fixed top navigation with smooth scrolling
- **Buttons**: Subtle, elegant buttons with hover effects

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
Minti/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── About.js
│   │   ├── About.css
│   │   ├── Services.js
│   │   ├── Services.css
│   │   ├── Gallery.js
│   │   ├── Gallery.css
│   │   ├── Contact.js
│   │   └── Contact.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Customization

### Adding Real Images

Replace the placeholder divs with actual image tags:
```jsx
<img src="/path/to/image.jpg" alt="Description" />
```

### Updating Colors

The main color scheme uses CSS variables. Update the color values in the CSS files:
- Primary green: `#5a7c65`
- Text dark: `#2c2c2c`
- Text light: `#555`

### Modifying Content

All content is in the component files. Simply edit the JSX in each page component to update text, add sections, or modify layouts.

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- CSS3 (Custom styling)
- Google Fonts (Inter & Playfair Display)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Contact

For questions or support, please contact the development team.

