// Arachne API Client
// Integration with the Arachne web scraping service

export interface ScrapeJobRequest {
  urls: string[];
}

export interface ScrapeJobResponse {
  job_id: string;
}

export interface ScrapeStatusResponse {
  status: "submitted" | "running" | "completed" | "failed";
  progress?: number;
  results?: unknown;
  error?: string;
  job?: {
    id: string;
    status: string;
    request: unknown;
    created_at: string;
    started_at?: string;
    completed_at?: string;
    progress: number;
    results?: unknown;
  };
  metrics?: unknown;
}

// Configuration - Arachne service proxied through nginx
const ARACHNE_BASE_URL = "/api/scrape"; // Nginx proxy endpoint

export class ArachneApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ArachneApiError";
  }
}

/**
 * Submit a new scraping job to Arachne
 * @param urls Array of URLs to scrape
 * @returns Promise with job_id
 */
export async function submitScrapeJob(
  urls: string[]
): Promise<ScrapeJobResponse> {
  try {
    console.log("Submitting scrape job to:", `${ARACHNE_BASE_URL}/scrape`);
    console.log("URLs:", urls);

    const response = await fetch(`${ARACHNE_BASE_URL}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls } as ScrapeJobRequest),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new ArachneApiError(
        `Failed to submit scrape job: ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const data = await response.json();
    console.log("Response data:", data);
    return data as ScrapeJobResponse;
  } catch (error) {
    console.error("Error in submitScrapeJob:", error);
    if (error instanceof ArachneApiError) {
      throw error;
    }
    throw new ArachneApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get the status of a scraping job
 * @param jobId The job ID returned from submitScrapeJob
 * @returns Promise with job status and results
 */
export async function getScrapeStatus(
  jobId: string
): Promise<ScrapeStatusResponse> {
  try {
    console.log("Getting scrape status for job:", jobId);
    console.log(
      "Status URL:",
      `${ARACHNE_BASE_URL}/scrape/status?id=${encodeURIComponent(jobId)}`
    );

    const response = await fetch(
      `${ARACHNE_BASE_URL}/scrape/status?id=${encodeURIComponent(jobId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Status error response:", errorText);
      throw new ArachneApiError(
        `Failed to get scrape status: ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const data = await response.json();
    console.log("Status response data:", data);
    return data as ScrapeStatusResponse;
  } catch (error) {
    console.error("Error in getScrapeStatus:", error);
    if (error instanceof ArachneApiError) {
      throw error;
    }
    throw new ArachneApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
