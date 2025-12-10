import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWindowManagement } from "../../hooks/useWindowManagement";
import "./AppWindow.css";

interface AppWindowProps {
  id: string;
  title: string;
  initialWidth: number;
  initialHeight: number;
  initialPosition?: { x: number; y: number };
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

const MIN_WIDTH = 360;
const MIN_HEIGHT = 240;

export const AppWindow: React.FC<AppWindowProps> = ({
  id,
  title,
  initialWidth,
  initialHeight,
  initialPosition,
  zIndex,
  onClose,
  onFocus,
  children,
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

  const wm = useWindowManagement({
    initialWidth,
    initialHeight,
    isIntro: false,
    onClose,
    initialPosition,
    maximizeOffsets: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  // Toggle a body class when any window enters fullscreen (maximized)
  useEffect(() => {
    const cls = "os-fullscreen";
    if (wm.isMaximized) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => {
      document.body.classList.remove(cls);
    };
  }, [wm.isMaximized]);

  useEffect(() => {
    wm.setDimensions(width, height);
  }, [width, height]);

  // Resizing state
  const [isResizing, setIsResizing] = useState<
    null | "right" | "bottom" | "corner"
  >(null);
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    startWidth: width,
    startHeight: height,
  });

  const onResizeStart = useCallback(
    (e: React.MouseEvent, mode: "right" | "bottom" | "corner") => {
      if (wm.isMaximized) return;
      e.stopPropagation();
      setIsResizing(mode);
      resizeStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        startWidth: width,
        startHeight: height,
      };
      onFocus();
    },
    [width, height, onFocus, wm.isMaximized]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const dx = e.clientX - resizeStartRef.current.mouseX;
      const dy = e.clientY - resizeStartRef.current.mouseY;
      if (isResizing === "right") {
        setWidth(Math.max(MIN_WIDTH, resizeStartRef.current.startWidth + dx));
      } else if (isResizing === "bottom") {
        setHeight(
          Math.max(MIN_HEIGHT, resizeStartRef.current.startHeight + dy)
        );
      } else if (isResizing === "corner") {
        setWidth(Math.max(MIN_WIDTH, resizeStartRef.current.startWidth + dx));
        setHeight(
          Math.max(MIN_HEIGHT, resizeStartRef.current.startHeight + dy)
        );
      }
    },
    [isResizing]
  );

  const onMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(null);
      wm.setDimensions(width, height);
    }
  }, [isResizing, width, height]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isResizing, onMouseMove, onMouseUp]);

  const containerStyle: React.CSSProperties = useMemo(() => {
    const style: React.CSSProperties = {
      ...wm.containerStyles,
      zIndex,
    };
    if (!wm.isMaximized) {
      style.width = width;
      style.height = height;
    }
    return style;
  }, [wm.containerStyles, width, height, zIndex, wm.isMaximized]);

  // Temporary fullscreen hint
  const [showFsHint, setShowFsHint] = useState(false);
  useEffect(() => {
    let timer: number | undefined;
    if (wm.isMaximized) {
      setShowFsHint(true);
      timer = window.setTimeout(() => setShowFsHint(false), 2000);
    } else {
      setShowFsHint(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [wm.isMaximized]);

  return (
    <div
      className={`app-window-container ${wm.isMaximized ? "maximized" : ""} ${
        wm.isDragging ? "dragging" : ""
      } ${wm.isMinimized ? "minimizing" : ""}`}
      style={containerStyle}
      onMouseDown={onFocus}
      onKeyDown={(e) => {
        if (e.key === "Escape" && wm.isMaximized) {
          wm.handleMaximize();
        }
      }}
      tabIndex={0}
    >
      {wm.isMaximized && showFsHint && (
        <div className="fullscreen-hint">Press Esc to exit full screen</div>
      )}
      <div className="app-window-header" onMouseDown={wm.handleMouseDown}>
        <div className="app-window-buttons">
          <button
            className="app-window-button close"
            onClick={wm.handleClose}
            aria-label={`Close ${title}`}
          />
          <button
            className="app-window-button minimize"
            onClick={() => {
              if (wm.isMaximized) wm.handleMaximize();
              // Delegate to WindowManager to mark minimized
              try {
                // Custom event for WindowLayer/Context to catch if needed
                const ev = new CustomEvent("appwindow:minimize", {
                  detail: { id },
                });
                window.dispatchEvent(ev);
              } catch {}
              wm.handleMinimize();
            }}
            aria-label={`Minimize ${title}`}
          />
          <button
            className="app-window-button maximize"
            onClick={wm.handleMaximize}
            aria-label={
              wm.isMaximized ? `Restore ${title}` : `Maximize ${title}`
            }
            title={wm.isMaximized ? "Restore" : "Maximize"}
          />
        </div>
        <div className="app-window-title">{title}</div>
      </div>

      <div className="app-window-body">{children}</div>

      {/* Resize handles */}
      <div
        className="resize-handle handle-right"
        onMouseDown={(e) => onResizeStart(e, "right")}
      />
      <div
        className="resize-handle handle-bottom"
        onMouseDown={(e) => onResizeStart(e, "bottom")}
      />
      <div
        className="resize-handle handle-corner"
        onMouseDown={(e) => onResizeStart(e, "corner")}
      />
    </div>
  );
};

export default AppWindow;
