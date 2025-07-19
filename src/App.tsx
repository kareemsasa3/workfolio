import { Routes, Route } from "react-router-dom";
import { AppProviders } from "./providers";
import Layout from "./components/Layout/Layout";
import {
  mainRoutes,
  topLevelRoutes,
  defaultRoute,
  notFoundRoute,
} from "./routes";

function App() {
  return (
    <AppProviders>
      <Routes>
        {/* The Layout route wraps all other pages */}
        <Route path="/" element={<Layout />}>
          {/* The 'index' route is the default page for the parent's path ("/") */}
          <Route index={defaultRoute.index} element={defaultRoute.element} />

          {/* All other pages - Suspense boundaries are now handled in Layout */}
          {mainRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Catch-all route for 404 pages */}
          <Route path={notFoundRoute.path} element={notFoundRoute.element} />
        </Route>

        {/* Render top-level routes that don't use the main Layout */}
        {topLevelRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </AppProviders>
  );
}

export default App;
