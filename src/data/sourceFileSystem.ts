import { FileSystemItem } from "../types/terminal";
import { getSourceCodeData } from "./lazySourceCode";

// Convert the source code data to the FileSystemItem format
function convertSourceCodeToFileSystem(items: any[]): FileSystemItem[] {
  return items.map((item) => ({
    name: item.name,
    type: item.type,
    permissions: item.permissions,
    size: item.size,
    date: item.date,
    path: item.path,
    children: item.children
      ? convertSourceCodeToFileSystem(item.children)
      : undefined,
  }));
}

// Get the file system structure from source code (lazy loaded)
export async function getSourceFileSystem(): Promise<FileSystemItem[]> {
  const sourceCodeData = await getSourceCodeData();
  return convertSourceCodeToFileSystem(sourceCodeData.fileTree);
}

// Helper function to find a file by path in the source code data
export async function findFileByPath(targetPath: string): Promise<any | null> {
  const sourceCodeData = await getSourceCodeData();

  function searchInItems(items: any[], path: string): any | null {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = searchInItems(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  return searchInItems(sourceCodeData.fileTree, targetPath);
}

// Helper function to get file content by path
export async function getSourceFileContent(
  path: string
): Promise<string[] | null> {
  const file = await findFileByPath(path);
  return file?.content || null;
}

// Helper function to get directory contents by path
export async function getDirectoryContents(
  dirPath: string
): Promise<FileSystemItem[] | null> {
  const sourceCodeData = await getSourceCodeData();

  function findDirectory(items: any[], path: string): any | null {
    for (const item of items) {
      if (item.path === path && item.type === "directory") {
        return item;
      }
      if (item.children) {
        const found = findDirectory(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  const dir = findDirectory(sourceCodeData.fileTree, dirPath);
  return dir ? convertSourceCodeToFileSystem(dir.children || []) : null;
}

// Helper function to check if a path exists
export async function pathExists(path: string): Promise<boolean> {
  const file = await findFileByPath(path);
  return file !== null;
}

// Helper function to get file extension
export function getFileExtension(path: string): string {
  const lastDotIndex = path.lastIndexOf(".");
  return lastDotIndex > 0 ? path.substring(lastDotIndex + 1) : "";
}

// Helper function to get syntax highlighting language based on file extension
export function getSyntaxLanguage(path: string): string {
  const ext = getFileExtension(path).toLowerCase();

  const languageMap: { [key: string]: string } = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    css: "css",
    scss: "scss",
    sass: "sass",
    html: "markup",
    htm: "markup",
    md: "markdown",
    txt: "text",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "cpp",
    hpp: "cpp",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    yml: "yaml",
    yaml: "yaml",
    toml: "toml",
    xml: "markup",
    svg: "markup",
    sql: "sql",
    gitignore: "gitignore",
    dockerfile: "dockerfile",
    makefile: "makefile",
  };

  return languageMap[ext] || "text";
}
