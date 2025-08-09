import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          retry?: "auto" | "never";
        }
      ) => void;
      reset?: (el?: HTMLElement) => void;
    };
  }
}

interface TurnstileProps {
  onVerified: (sessionToken: string) => void;
  className?: string;
}

const Turnstile: React.FC<TurnstileProps> = ({
  onVerified,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as
      | string
      | undefined;

    // Dev fallback: if no site key, try backend dev-token
    if (!siteKey) {
      (async () => {
        try {
          const resp = await fetch(`/api/ai/auth/dev-token`, {
            method: "POST",
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.sessionToken) onVerified(data.sessionToken);
            else setError("Dev token unavailable");
          } else {
            setError("Dev token request failed");
          }
        } catch (e) {
          setError("Dev token request error");
        }
      })();
      setLoading(false);
      return;
    }

    function loadScript(): Promise<void> {
      if (window.turnstile) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Turnstile"));
        document.head.appendChild(script);
      });
    }

    let isMounted = true;
    setLoading(true);
    loadScript()
      .then(() => {
        if (!isMounted) return;
        if (window.turnstile && containerRef.current) {
          window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "auto",
            retry: "auto",
            callback: async (token: string) => {
              try {
                const resp = await fetch(`/api/ai/auth/turnstile`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token }),
                });
                if (!resp.ok) {
                  setError("Verification failed");
                  return;
                }
                const data = await resp.json();
                if (data.sessionToken) onVerified(data.sessionToken);
                else setError("Missing session token");
              } catch (e) {
                setError("Verification error");
              }
            },
            "error-callback": () => setError("Turnstile error"),
          });
        }
      })
      .catch(() => setError("Failed to load Turnstile"))
      .finally(() => setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [onVerified]);

  return (
    <div className={className}>
      <div ref={containerRef} />
      {loading && <div style={{ marginTop: 8 }}>Loading verification…</div>}
      {error && (
        <div style={{ marginTop: 8, color: "#ff6b6b" }}>
          {error}. Please refresh and try again.
        </div>
      )}
    </div>
  );
};

export default Turnstile;
