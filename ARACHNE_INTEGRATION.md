# Arachne Integration - Web Scraping in the Terminal

This document describes the integration between the workfolio terminal and the Arachne web scraping service.

## Overview

The terminal now includes a `curl` command that allows users to submit web scraping jobs to the Arachne service. This demonstrates full-stack capabilities by connecting the frontend terminal interface to a deployed backend service.

## Architecture

### Components

1. **API Client** (`src/services/arachneApi.ts`)
   - Handles communication with the Arachne service
   - Provides `submitScrapeJob()` and `getScrapeStatus()` functions
   - Includes proper error handling and TypeScript types

2. **CurlCommand** (`src/hooks/useTerminal.ts`)
   - Implements the `curl` command in the terminal
   - Parses URLs from command arguments
   - Submits jobs and manages job state

3. **Polling System** (`src/hooks/useTerminal.ts`)
   - Automatically polls active jobs every 2 seconds
   - Updates job status and progress in real-time
   - Handles job completion and failure

4. **State Management**
   - Tracks active scraping jobs in terminal state
   - Updates history entries with live progress
   - Manages job lifecycle (submitted → running → completed/failed)

## Usage

### Basic Usage

```bash
# Scrape a single URL
curl https://example.com

# Scrape multiple URLs
curl https://google.com https://github.com https://news.ycombinator.com
```

### Command Flow

1. **Job Submission**: User runs `curl` with URLs
2. **Immediate Feedback**: Terminal shows job ID and success message
3. **Live Updates**: Progress updates every 2 seconds
4. **Completion**: Results saved as JSON file
5. **Post-Processing**: User can view results with `cat` or search with `grep`

### Example Session

```bash
$ curl https://news.ycombinator.com
🌐 Submitting job for 1 URL... Success! Job ID: abc123

# After a few seconds, the status updates:
🔄 Scraping in progress... 45%

# When completed:
✅ Scrape completed! Results saved to: scraping_results/job_abc123.json

# User can then view results:
$ cat scraping_results/job_abc123.json
$ grep "title" scraping_results/job_abc123.json
```

## API Contract

The integration uses the exact API contract from the Arachne README:

### Submit Job
- **Endpoint**: `POST /scrape`
- **Request**: `{ "urls": ["https://url1.com", "https://url2.com"] }`
- **Response**: `{ "job_id": "string" }`

### Check Status
- **Endpoint**: `GET /scrape/status?id=<job_id>`
- **Response**: `{ "status": "submitted|running|completed|failed", "progress": number, "results": any, "error": string }`

## Configuration

Update the `ARACHNE_BASE_URL` in `src/services/arachneApi.ts` with your deployed Arachne instance URL:

```typescript
const ARACHNE_BASE_URL = 'https://your-arachne-instance.com';
```

## Features

### Real-time Progress Updates
- Jobs show live progress with percentage
- Status updates every 2 seconds
- Visual indicators (🔄, ✅, ❌) for different states

### Error Handling
- Network errors are caught and displayed
- HTTP errors show appropriate messages
- Failed jobs are automatically cleaned up

### Integration with Terminal Commands
- Results saved as JSON files
- Can be viewed with `cat` command
- Can be searched with `grep` command
- Can be processed with `wc` command

### State Persistence
- Active jobs persist across terminal sessions
- Job history is saved to localStorage
- Automatic cleanup of completed/failed jobs

## Technical Details

### Async Command Support
The terminal now supports async commands through the updated `Command` interface:

```typescript
execute: (...args) => CommandResult | Promise<CommandResult>
```

### Job State Management
```typescript
interface ActiveScrapeJob {
  jobId: string;
  status: 'submitted' | 'running' | 'completed' | 'failed';
  progress?: number;
  historyEntryId: number;
  urls: string[];
  startTime: number;
  results?: any;
  error?: string;
}
```

### Polling Logic
- Only polls active jobs (not completed/failed)
- Handles network errors gracefully
- Updates both job state and history entries
- Automatic cleanup with timeouts

## Future Enhancements

1. **File System Integration**: Create virtual files for scraping results
2. **Job Management**: Add commands to list and cancel jobs
3. **Result Processing**: Add commands to filter and transform results
4. **Batch Operations**: Support for scraping entire directories of URLs
5. **Caching**: Cache results to avoid re-scraping

## Testing

The integration includes comprehensive error handling and can be tested with:

1. Valid URLs to verify successful scraping
2. Invalid URLs to test error handling
3. Network disconnection to test resilience
4. Multiple concurrent jobs to test state management

## Security Considerations

- URLs are validated before submission
- No sensitive data is stored in localStorage
- API calls use proper error handling
- Job IDs are used for tracking, not user data

This integration showcases the ability to build sophisticated full-stack applications with real-time features, proper error handling, and seamless user experience. 