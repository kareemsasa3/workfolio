import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories and files to ignore
const IGNORE_PATTERNS = [
  "node_modules",
  "dist",
  "build",
  ".git",
  ".env",
  ".DS_Store",
  "package-lock.json",
  "yarn.lock",
  "*.log",
  "*.tmp",
  "*.cache",
  ".vscode",
  ".idea",
  "coverage",
  ".nyc_output",
  "*.min.js",
  "*.min.css",
];

function shouldIgnore(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  return IGNORE_PATTERNS.some((pattern) => {
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace("*", ".*"));
      return regex.test(relativePath);
    }
    return relativePath.includes(pattern);
  });
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeInBytes = stats.size;

    if (sizeInBytes < 1024) return `${sizeInBytes}B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)}K`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)}M`;
  } catch (error) {
    return "0B";
  }
}

function getFileDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  } catch (error) {
    return "Jan 01 00:00";
  }
}

function readFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content.split("\n");
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error.message);
    return ["// Error reading file content"];
  }
}

function buildFileTree(dirPath, relativePath = "") {
  const items = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const itemRelativePath = path.join(relativePath, entry.name);

      if (shouldIgnore(fullPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        const children = buildFileTree(fullPath, itemRelativePath);
        if (children.length > 0) {
          items.push({
            name: entry.name,
            type: "directory",
            permissions: "drwxr-xr-x",
            size: "4096",
            date: getFileDate(fullPath),
            path: itemRelativePath,
            children,
          });
        }
      } else if (entry.isFile()) {
        const content = readFileContent(fullPath);
        items.push({
          name: entry.name,
          type: "file",
          permissions: "-rw-r--r--",
          size: getFileSize(fullPath),
          date: getFileDate(fullPath),
          path: itemRelativePath,
          content,
        });
      }
    }
  } catch (error) {
    console.warn(
      `Warning: Could not read directory ${dirPath}:`,
      error.message
    );
  }

  return items.sort((a, b) => {
    // Directories first, then files, both alphabetically
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

function generateSourceCodeData() {
  const projectRoot = path.resolve(__dirname, "..");
  const outputPath = path.join(projectRoot, "src", "data", "sourceCode.json");

  console.log("🔍 Scanning project directory...");
  const fileTree = buildFileTree(projectRoot);

  const sourceCodeData = {
    generatedAt: new Date().toISOString(),
    projectRoot: path.basename(projectRoot),
    fileTree,
    totalFiles: countFiles(fileTree),
    totalDirectories: countDirectories(fileTree),
  };

  // Ensure the output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the JSON file
  fs.writeFileSync(outputPath, JSON.stringify(sourceCodeData, null, 2));

  console.log(
    `✅ Generated source code tree with ${sourceCodeData.totalFiles} files and ${sourceCodeData.totalDirectories} directories`
  );
  console.log(`📁 Output saved to: ${outputPath}`);

  return sourceCodeData;
}

function countFiles(items) {
  let count = 0;
  for (const item of items) {
    if (item.type === "file") {
      count++;
    } else if (item.children) {
      count += countFiles(item.children);
    }
  }
  return count;
}

function countDirectories(items) {
  let count = 0;
  for (const item of items) {
    if (item.type === "directory") {
      count++;
      if (item.children) {
        count += countDirectories(item.children);
      }
    }
  }
  return count;
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateSourceCodeData();
  } catch (error) {
    console.error("❌ Error generating source code tree:", error);
    process.exit(1);
  }
}
