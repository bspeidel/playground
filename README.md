# Playground

A modern Angular sandbox application built with **Angular 22**, **Angular Material 3**, and **Zoneless Change Detection**.

---

## 🚀 Features & Tech Stack

- **Angular 22 (`^22.2.0`)**: Modern standalone architecture powered by `@angular/build` (Vite/esbuild application builder).
- **Zoneless Change Detection**: Configured using `provideZonelessChangeDetection()` and `ChangeDetectionStrategy.Eager` for high-performance reactivity without Zone.js.
- **Angular Material 3 (`^22.2.0`)**: Styled with Material Design 3 using `@angular/material` theming mixins, Azure/Blue palettes, and system CSS tokens.
- **Signals**: Reactive state management with Angular Signals (`signal()`).
- **TypeScript 6 (`~6.0.3`)**: Strong typing and modern ECMAScript compilation.
- **Jest & jest-preset-angular**: Fast, modern headless unit test execution with Zoneless testing support (`setupZonelessTestEnv`).

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── pages/
│   │   ├── overview/        # Welcome & environment status
│   │   ├── signals-demo/    # Signals, computed, async zoneless demo & reactive cart
│   │   ├── material-demo/   # Material Design 3 interactive showcase
│   │   └── defer-demo/      # Deferrable views (@defer) interactive demo
│   ├── app.config.ts        # Application configuration (zoneless, router, error listeners)
│   ├── app.routes.ts        # Application route definitions (lazy-loaded pages)
│   ├── app.ts               # App shell component (navigation & layout)
│   ├── app.html             # Shell template (toolbar, router-outlet, footer)
│   ├── app.scss             # Layout styles
│   └── app.spec.ts          # Unit tests for the root component
├── public/                  # Static assets (favicons, icons, etc.)
├── styles.scss              # Global styles & Angular Material 3 theme configuration
├── main.ts                  # Application bootstrap entry point
└── index.html               # Main HTML document
```

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have **Node.js** (LTS recommended) and **npm** installed on your system.

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## 💻 Available Scripts

### Development Server

Run the development server locally:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build

Compile the application for production:

```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/playground` directory, optimized for performance and speed.

### Development Watch Mode

Build and watch for file changes during development:

```bash
npm run watch
```

### Running Unit Tests

Execute unit tests via [Jest](https://jestjs.io/) and `jest-preset-angular`:

```bash
# Run tests
npm test

# Run tests in interactive watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## 🧩 Code Scaffolding

Generate new components, directives, pipes, or services with the Angular CLI:

```bash
# Generate a new component
ng generate component components/my-component

# List available schematics
ng generate --help
```

---

## 📚 Documentation & Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material 3 Theming](https://material.angular.dev/guide/theming)
- [Angular Zoneless Guide](https://angular.dev/guides/zoneless)
- [Angular CLI Overview & Command Reference](https://angular.dev/tools/cli)
