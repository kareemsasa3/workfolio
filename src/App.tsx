import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import Terminal from "./components/Terminal";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Games from "./pages/Games";
import SnakeGame from "./pages/SnakeGame";
import Info from "./pages/Info";
import Work from "./pages/Work";
import Education from "./pages/Education";
import Certifications from "./pages/Certifications";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* The Layout route wraps all other pages */}
          <Route path="/" element={<Layout />}>
            {/* The 'index' route is the default page for the parent's path ("/") */}
            <Route index element={<Home />} />

            {/* Terminal route */}
            <Route path="terminal" element={<Terminal isIntro={false} />} />

            {/* All your other pages */}
            <Route path="projects" element={<Projects />} />
            <Route path="games" element={<Games />} />
            <Route path="games/snake" element={<SnakeGame />} />
            <Route path="work" element={<Work />} />
            <Route path="education" element={<Education />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="resume" element={<Resume />} />
            <Route path="contact" element={<Contact />} />
            <Route path="info" element={<Info />} />

            {/* Optional: A catch-all for 404 pages */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
