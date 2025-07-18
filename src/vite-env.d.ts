/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
