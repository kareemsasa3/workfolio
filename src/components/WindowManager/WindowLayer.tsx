import React, { Suspense, useEffect, useMemo } from "react";
import { useWindowManager } from "../../contexts/WindowManagerContext";
import AppWindow from "./AppWindow";

const TILE_POSITIONS = [
  { x: 20, y: 20 },
  { x: () => window.innerWidth / 2 + 10, y: 20 },
  { x: 20, y: () => window.innerHeight / 2 + 10 },
  { x: () => window.innerWidth / 2 + 10, y: () => window.innerHeight / 2 + 10 },
];

export const WindowLayer: React.FC = () => {
  const {
    windows,
    closeWindow,
    focusWindow,
    getAppDefinition,
    minimizeWindow,
  } = useWindowManager();

  // Listen to AppWindow minimize events to mark window minimized in context
  useEffect(() => {
    const onMin = (e: Event) => {
      const id = (e as CustomEvent).detail?.id as string | undefined;
      if (id) minimizeWindow(id);
    };
    window.addEventListener("appwindow:minimize", onMin as EventListener);
    return () =>
      window.removeEventListener("appwindow:minimize", onMin as EventListener);
  }, [minimizeWindow]);

  // Compute z-order by array order
  const withZ = useMemo(
    () => windows.map((w, idx) => ({ ...w, zIndex: 2000 + idx })),
    [windows]
  );

  return (
    <>
      {withZ.map((w, idx) => {
        const def = getAppDefinition(w.appId);
        if (!def) return null;

        // Close helper
        const handleClose = () => closeWindow(w.id);
        const handleFocus = () => focusWindow(w.id);

        const content = def.renderContent(w.id, { close: handleClose });

        return (
          <AppWindow
            key={w.id}
            id={w.id}
            title={def.title}
            initialWidth={def.initialWidth}
            initialHeight={def.initialHeight}
            initialPosition={w.initialPosition}
            zIndex={2000 + idx}
            onClose={handleClose}
            onFocus={handleFocus}
          >
            <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
              {content}
            </Suspense>
          </AppWindow>
        );
      })}
    </>
  );
};

export default WindowLayer;
