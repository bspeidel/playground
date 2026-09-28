# Playground

[![CI/CD](https://github.com/bspeidel/playground/actions/workflows/ci.yml/badge.svg)](https://github.com/bspeidel/playground/actions/workflows/ci.yml)

A modern Angular sandbox application built with **Angular 22**, **Angular Material 3**, and **Zoneless Change Detection**.

🌐 **Live Demo**: [https://bspeidel.github.io/playground/](https://bspeidel.github.io/playground/)

---

## 🚀 Features & Tech Stack

- **Angular 22 (`^22.2.0`)**: Modern standalone architecture powered by `@angular/build` (Vite/esbuild application builder).
- **Zoneless Change Detection**: Configured using `provideZonelessChangeDetection()` and `ChangeDetectionStrategy.OnPush` for optimal reactivity without Zone.js.
- **Angular Material 3 (`^22.2.0`)**: Material Design 3 theming with Azure/Blue palettes and dynamic Dark/Light theme switching.
- **Signals & Advanced Reactivity**: Reactive state management with `signal()`, `computed()`, and Angular 22 `linkedSignal()` and `resource()` APIs.
- **Web Worker**: The virtual scroll demo generates 50k–100k telemetry records off the main thread.
- **TypeScript 6 (`~6.0.3`)**: Strong typing and modern ECMAScript compilation.
- **Jest & jest-preset-angular**: Fast, modern headless unit test execution with Zoneless testing support (`setupZonelessTestEnv`).
- **CI/CD & DX**: Pre-commit validation via Husky & lint-staged, ESLint (@angular-eslint), Prettier, Dependabot, and a GitHub Actions CI workflow.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── pages/
│   │   ├── overview/        # Welcome & environment status
│   │   ├── signals-demo/    # Signals, computed, async zoneless demo & reactive cart
│   │   ├── material-demo/   # Material Design 3 interactive showcase
│   │   ├── defer-demo/      # Deferrable views (@defer) interactive demo
│   │   ├── api-explorer/    # resource(), fetch, AbortSignal & input debouncing
│   │   ├── table-demo/      # Interactive Material 3 Data Table, KPIs, sorting & export
│   │   ├── kanban-demo/     # Interactive CDK Drag & Drop Kanban board with connected lists
│   │   ├── forms-demo/      # Typed Reactive Forms, async validation & dynamic FormArray
│   │   ├── virtual-scroll-demo/ # CDK Virtual Scrolling + Web Worker data generation
│   │   ├── charts-demo/     # Native reactive SVG charts (Donut, Bar chart, Sparklines)
│   │   ├── stepper-demo/    # Cloud deployment wizard & MatStepper M3 with live cost calculator
│   │   └── tree-demo/       # Project file explorer & hierarchical MatTree with code previewer
│   ├── services/
│   │   ├── theme.service.ts     # Reactive Material 3 Dark/Light mode manager
│   │   └── github-api.service.ts # GitHub search: URL building, error mapping, abort bookkeeping
│   ├── app.config.ts        # Application configuration (zoneless, router, error listeners)
│   ├── app.routes.ts        # Application route definitions (lazy-loaded pages)
│   ├── app.ts               # App shell component (navigation & layout)
│   ├── app.html             # Shell template (toolbar, router-outlet, footer)
│   ├── app.scss             # Layout styles
│   └── app.spec.ts          # Unit tests for the root component
├── public/                  # Static assets (favicons, icons, etc.)
├── styles.scss              # Global styles & Angular Material 3 theme configuration
├── main.ts                  # Application bootstrap entry point
└── index.html               # Main HTML document (meta tags + pre-paint theme script)
```

---

## 🛠️ Getting Started

### Prerequisites

Node.js **22** (see `.nvmrc`) and **npm**. The `engines` field enforces this.

### Installation

```bash
npm install
```

---

## 💻 Available Scripts

```bash
npm start              # dev server on http://localhost:4200/
npm run build          # production build
npm run build:gh-pages # production build with --base-href /playground/
npm run watch          # watch-mode build
npm test               # unit tests (Jest)
npm run test:watch     # unit tests in watch mode
npm run test:coverage  # unit tests + coverage (enforces thresholds)
npm run lint           # ESLint (@angular-eslint)
npm run typecheck      # tsc --noEmit
npm run format         # Prettier write
npm run format:check   # Prettier check
```

`npm run test:coverage` fails the build if global coverage drops below the
thresholds declared in `jest.config.js`.

---

## 🧩 Code Scaffolding

```bash
ng generate component components/my-component
ng generate --help
```

---

## 📚 Documentation & Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material 3 Theming](https://material.angular.dev/guide/theming)
- [Angular Zoneless Guide](https://angular.dev/guides/zoneless)
- [Angular CLI Overview & Command Reference](https://angular.dev/tools/cli)

