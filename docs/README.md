# 🚀 Workfolio - Interactive Developer Portfolio

[Live Site](https://kareemsasa.dev)

An innovative, interactive portfolio that transforms the traditional resume into a living, breathing development environment. Built with React, TypeScript, and a passion for pushing the boundaries of what's possible in the browser.

## 🏗️ Architecture

This front-end application is part of a broader portfolio of independent projects.

## ✨ Current Features

### 🖥️ Interactive Terminal

- **Full Unix-like Experience**: Complete command system with `ls`, `cd`, `cat`, `grep`, `vim`, and more
- **Real-time Process Monitoring**: `top` command with live system simulation
- **Command History**: Full command history with reverse search capabilities

### 📁 Virtual File System

- **Complete Project Structure**: Navigate through 136+ files and 44 directories
- **Real Source Code**: Browse the actual project source code in the terminal
- **Syntax Highlighting**: Full support for TypeScript, JavaScript, CSS, JSON, and more
- **Vim-like Editor**: `vim <filepath>` opens files in a syntax-highlighted editor

### 🎨 Matrix Aesthetic

- **Cohesive Design**: Dark theme with green accents inspired by "The Matrix"
- **Smooth Animations**: Framer Motion-powered transitions and effects
- **Responsive Layout**: Optimized for desktop and mobile experiences
- **Accessibility**: Keyboard navigation and screen reader support

## 🎯 What This Demonstrates

- **Advanced State Management**: Complex terminal state with Redux-style actions
- **File System Virtualization**: Complete project structure in the browser
- **Real-time UI**: Live process monitoring and dynamic content updates
- **Code Quality**: TypeScript, comprehensive error handling, and clean architecture
- **User Experience**: Intuitive interface that feels like a real development environment

## 🚀 Future Vision

This project is just the beginning! Check out the **[FUTURE_PLANS.md](./FUTURE_PLANS.md)** for an ambitious roadmap that includes:

- **Full IDE Integration**: Monaco editor with multi-tab interface
- **Live CSS Editing**: Real-time style modifications
- **Tools Suite**: Universal converter, flowchart creator, image editor
- **Multi-tenant Platform**: Collaborative features with user authentication

The vision is to transform this portfolio into a comprehensive "Productivity OS" in the browser.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository

   ### `git clone https://github.com/kareemsasa3/workfolio.git`

2. Install dependencies

   ### `npm install`

3. Run the development server
   ### `npm run dev`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# Available Scripts (Vite)

In the project directory, you can run any of the following scripts:

### `npm run dev`

Starts the Vite development server.

### `npm run build`

Builds the app for production to the `build` folder (configured via Vite).

### `npm run preview`

Locally preview the production build.

### `npm run lint`

Run ESLint on the codebase.

## Learn More

See the Vite docs: https://vitejs.dev/guide/

## Dev vs Prod

- Development (Docker Compose):

  - Command: `docker compose -f infrastructure/docker-compose.yml -f infrastructure/dev/docker-compose.dev.yml up --build`
  - Nginx: HTTP-only `infrastructure/nginx/conf.d/default.dev.conf`
  - Proxies:
    - `/` → `workfolio:80`
  - Frontend local dev: `npm run dev` in `workfolio/` also works

- Production (Docker Compose):
  - Command: `docker compose -f infrastructure/docker-compose.yml -f infrastructure/prod/docker-compose.prod.yml up -d`
  - Nginx: HTTPS templated config `infrastructure/nginx/conf.d/default.conf.template` (rendered at container start)
  - Proxies: same paths as development
  - Frontend image served by Nginx; no dev server in production
