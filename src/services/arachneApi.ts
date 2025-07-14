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
  results?: any;
  error?: string;
}

// Configuration - update this with your deployed Arachne instance URL
const ARACHNE_BASE_URL = "https://your-arachne-instance.com"; // TODO: Update with actual URL

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
    const response = await fetch(`${ARACHNE_BASE_URL}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls } as ScrapeJobRequest),
    });

    if (!response.ok) {
      throw new ArachneApiError(
        `Failed to submit scrape job: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data as ScrapeJobResponse;
  } catch (error) {
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
    const response = await fetch(
      `${ARACHNE_BASE_URL}/scrape/status?id=${encodeURIComponent(jobId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new ArachneApiError(
        `Failed to get scrape status: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data as ScrapeStatusResponse;
  } catch (error) {
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
