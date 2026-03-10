# Incept

A modern web application built with React, TypeScript, and Vite.

## Tech Stack

### Core

- **React** 19 — UI library
- **TypeScript** 5 — Type-safe JavaScript
- **Vite** 7 — Build tool with HMR

### Styling

- **SCSS/SASS** — CSS preprocessor with CSS Modules
- **Tailwind CSS** 4 — Utility-first CSS framework
- **Styled Components** — CSS-in-JS for component-scoped styles
- **styled-bootstrap-grid** — Bootstrap grid via styled-components

### State Management & Routing

- **Redux Toolkit** — State management
- **Redux Saga** — Side effects and async operations
- **React Router DOM** 7 — Client-side routing

### Animations & Utilities

- **Lottie Web** — Vector animations
- **clsx** — Conditional class name utility

### Code Quality

- **ESLint** 9 — Linting with TypeScript and React plugins
- **TypeScript strict mode** — Maximum type safety

### Deployment

- **Vercel** — Hosting and deployment

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── config/            # Environment configuration
├── constants/         # App constants and route definitions
├── helpers/           # Utility functions
├── hooks/             # Custom React hooks
├── layouts/           # Layout components
├── pages/             # Page components
├── routes/            # React Router configuration
├── store/             # Redux store, slices, sagas, selectors
├── styles/            # Global styles, SCSS abstracts
└── main.tsx           # App entry point
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | API base URL |
| `VITE_PUBLIC_STATICS_URL` | Static assets URL |
| `VITE_PUBLIC_ENV` | Environment identifier |

## License

Private
