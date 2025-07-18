import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout/Layout";
import Terminal from "./components/Terminal";

// Lazy load all page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Games = lazy(() => import("./pages/Games"));
const SnakeGame = lazy(() => import("./pages/SnakeGame"));
const Info = lazy(() => import("./pages/Info"));
const Work = lazy(() => import("./pages/Work"));
const Education = lazy(() => import("./pages/Education"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Resume = lazy(() => import("./pages/Resume"));
const Contact = lazy(() => import("./pages/Contact"));
const AiConversations = lazy(() => import("./pages/AiConversations"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      color: "var(--text-color)",
    }}
  >
    Loading...
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* The Layout route wraps all other pages */}
          <Route path="/" element={<Layout />}>
            {/* The 'index' route is the default page for the parent's path ("/") */}
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <Home />
                </Suspense>
              }
            />

            {/* Terminal route */}
            <Route path="terminal" element={<Terminal isIntro={false} />} />

            {/* All your other pages with Suspense boundaries */}
            <Route
              path="projects"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Projects />
                </Suspense>
              }
            />
            <Route
              path="games"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Games />
                </Suspense>
              }
            />
            <Route
              path="games/snake"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SnakeGame />
                </Suspense>
              }
            />
            <Route
              path="work"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Work />
                </Suspense>
              }
            />
            <Route
              path="education"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Education />
                </Suspense>
              }
            />
            <Route
              path="certifications"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Certifications />
                </Suspense>
              }
            />
            <Route
              path="resume"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Resume />
                </Suspense>
              }
            />
            <Route
              path="contact"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="ai-conversations"
              element={
                <Suspense fallback={<PageLoader />}>
                  <AiConversations />
                </Suspense>
              }
            />
            <Route
              path="info"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Info />
                </Suspense>
              }
            />

            {/* Optional: A catch-all for 404 pages */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
