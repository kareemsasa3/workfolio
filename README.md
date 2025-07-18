# 🚀 Workfolio - Interactive Developer Portfolio

[Live Demo](https://kareemsasadev.netlify.app)

An innovative, interactive portfolio that transforms the traditional resume into a living, breathing development environment. Built with React, TypeScript, and a passion for pushing the boundaries of what's possible in the browser.

## 🏗️ Architecture

This front-end application is part of a larger ecosystem of specialized, independently deployable services:

```
/your-projects/
├── workfolio/       # This repository - Front-end React application
├── ai-backend/      # AI microservice (standalone)
├── arachne/         # Web scraping service (standalone)
└── buildsync/       # Full-stack application (standalone)
```

Each service is designed to be independent while working together to create a comprehensive portfolio experience.

## ✨ Current Features

### 🖥️ Interactive Terminal
- **Full Unix-like Experience**: Complete command system with `ls`, `cd`, `cat`, `grep`, `vim`, and more
- **Real-time Process Monitoring**: `top` command with live system simulation
- **AI Chat Integration**: Built-in AI assistant for portfolio exploration
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

### 🤖 AI Integration
- **Standalone AI Service**: Connects to a dedicated AI backend microservice
- **Intelligent Chat**: AI assistant for portfolio exploration and help
- **Context-Aware**: AI understands the portfolio structure and available commands
- **Real-time Communication**: Seamless integration with the terminal interface

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
   ### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### 🤖 AI Backend Setup (Optional)

For full AI functionality, you'll need to run the standalone AI backend service:

1. Clone the AI backend repository:
   ```bash
   git clone https://github.com/yourusername/ai-backend.git
   cd ai-backend
   ```

2. Install dependencies and configure environment:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your AI API keys
   ```

3. Start the AI backend service:
   ```bash
   npm run dev
   ```

The AI backend will run on `http://localhost:3001` and the front-end will automatically connect to it.


# Available Scripts
In the project directory, you can run any of the following scripts:

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
