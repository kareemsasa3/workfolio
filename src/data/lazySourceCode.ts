// Lazy loading for large source code data
let sourceCodeData: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

export async function getSourceCodeData(): Promise<any> {
  if (sourceCodeData) {
    return sourceCodeData;
  }

  if (isLoading && loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = import("./sourceCode.json")
    .then((module) => {
      sourceCodeData = module.default;
      isLoading = false;
      return sourceCodeData;
    })
    .catch((error) => {
      isLoading = false;
      console.error("Failed to load source code data:", error);
      throw error;
    });

  return loadPromise;
}

export function isSourceCodeLoaded(): boolean {
  return sourceCodeData !== null;
}
