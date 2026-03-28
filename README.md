> [!IMPORTANT]
> The initial state of this project was suboptimal, so I used AI to quickly overhaul the design and backend. I’d recommend focusing on my more polished projects instead.

<div align="center">
  <img src="public/favicon.ico" width="80" alt="Graham logo" />
  <h1>Graham</h1>
  <p><b>Modern Nuxt 3 Web App for Fast Site Search & API Integration</b></p>
  <a href="https://nuxt.com/" target="_blank"><img src="https://img.shields.io/badge/Nuxt-3-green?logo=nuxtdotjs" alt="Nuxt 3" /></a>
  <a href="https://vuejs.org/" target="_blank"><img src="https://img.shields.io/badge/Vue-3-42b883?logo=vue.js" alt="Vue 3" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-4+-3178c6?logo=typescript" alt="TypeScript" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</div>

---

> **Graham** is a modern, fast, and extensible web application built with Nuxt 3, Vue 3, and TypeScript. It features a clean UI, server-side rendering, custom API endpoints, and a component-based architecture for rapid site search and data integration.

---

## 🚀 Features

- ⚡ **Blazing Fast Search** — Instant search experience with custom endpoints
- 🧩 **Component-Based** — Modular, maintainable codebase
- 🌐 **SSR & API** — Server-side rendering and flexible API routes
- 🎨 **Customizable Styles** — Easily tweak styles in `assets/css/main.css`
- 🛠️ **TypeScript Support** — Type-safe development
- 📁 **Simple Structure** — Easy to navigate and extend

## 📂 Project Structure

```
├── app.vue                # Root app component
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── assets/
│   └── css/
│       └── main.css       # Main styles
├── components/
│   └── searchInput.vue    # Search input component
├── pages/
│   ├── index.vue          # Home page
│   └── search.vue         # Search page
├── public/
│   ├── favicon.ico        # App icon
│   └── robots.txt         # robots.txt
├── server/
│   ├── tsconfig.json      # Server TypeScript config
│   └── api/
│       ├── fetchQuick.get.ts # Quick search API
│       └── fetchSites.get.ts # Sites API
```

## 🛠️ Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start development server:**
   ```sh
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Run production server

## 🔌 API Endpoints

Custom endpoints are located in `server/api/`:

- `fetchQuick.get.ts` — Fast search
- `fetchSites.get.ts` — Get sites list

### Add a New API Endpoint

1. Create a new file in `server/api/` named `<endpoint>.get.ts` or `<endpoint>.post.ts`.
2. Implement your handler using Nuxt 3 API conventions.

## 🧱 Components

- `components/searchInput.vue` — Search input field

## 🗂️ Pages

- `/` — Home page
- `/search` — Search page

## 🎨 Styles

- Main styles: `assets/css/main.css`

## ⚙️ Requirements

- Node.js 18+
- npm 9+

## 🤝 Contributing

Pull requests and issues are welcome! Feel free to fork the repo and submit improvements.

## 📄 License

MIT
