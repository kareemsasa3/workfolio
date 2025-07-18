export interface ManPage {
  name: string;
  synopsis: string;
  description: string;
  options: Array<{
    flag: string;
    description: string;
  }>;
  examples: Array<{
    command: string;
    description: string;
  }>;
  seeAlso: string[];
}

export const manPages: Record<string, ManPage> = {
  ls: {
    name: "ls - list directory contents",
    synopsis: "ls [OPTION]... [FILE]...",
    description: `List information about the FILEs (the current directory by default). 
Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.

The ls command displays the contents of directories and information about files. 
When used without arguments, ls lists the files in the current directory.`,
    options: [
      {
        flag: "-a, --all",
        description: "do not ignore entries starting with . (hidden files)",
      },
      {
        flag: "-l",
        description: "use long listing format (permissions, owner, size, date)",
      },
      {
        flag: "-h, --human-readable",
        description:
          "with -l, print sizes in human readable format (e.g., 1K 234M 2G)",
      },
      {
        flag: "-t",
        description: "sort by modification time, newest first",
      },
      {
        flag: "-r, --reverse",
        description: "reverse order while sorting",
      },
    ],
    examples: [
      {
        command: "ls",
        description: "List files in current directory",
      },
      {
        command: "ls -l",
        description: "List files with detailed information",
      },
      {
        command: "ls -a",
        description: "List all files including hidden ones",
      },
      {
        command: "ls -la",
        description: "List all files with detailed information",
      },
    ],
    seeAlso: ["cd", "pwd", "cat"],
  },

  cd: {
    name: "cd - change directory",
    synopsis: "cd [DIRECTORY]",
    description: `Change the current working directory to DIRECTORY. The default 
DIRECTORY is the value of the HOME shell variable.

The cd command is used to navigate the file system. It changes the current 
working directory to the specified directory. If no directory is specified, 
cd changes to the home directory.`,
    options: [],
    examples: [
      {
        command: "cd",
        description: "Change to home directory",
      },
      {
        command: "cd projects",
        description: "Change to projects directory",
      },
      {
        command: "cd ..",
        description: "Change to parent directory",
      },
      {
        command: "cd /",
        description: "Change to root directory",
      },
    ],
    seeAlso: ["ls", "pwd"],
  },

  pwd: {
    name: "pwd - print working directory",
    synopsis: "pwd",
    description: `Print the full filename of the current working directory.

The pwd command displays the absolute pathname of the current working directory. 
This is useful for determining your current location in the file system.`,
    options: [],
    examples: [
      {
        command: "pwd",
        description: "Display current working directory",
      },
    ],
    seeAlso: ["ls", "cd"],
  },

  cat: {
    name: "cat - concatenate and display files",
    synopsis: "cat [OPTION]... [FILE]...",
    description: `Concatenate FILE(s) to standard output.

With no FILE, or when FILE is -, read standard input.

The cat command is used to display the contents of files. It can also be used 
to concatenate multiple files and display them together. When used in pipes, 
cat can read from standard input and pass data to other commands.`,
    options: [
      {
        flag: "-n, --number",
        description: "number all output lines",
      },
      {
        flag: "-A, --show-all",
        description: "equivalent to -vET",
      },
      {
        flag: "-E, --show-ends",
        description: "display $ at end of each line",
      },
    ],
    examples: [
      {
        command: "cat README.md",
        description: "Display contents of README.md",
      },
      {
        command: "cat file1.txt file2.txt",
        description: "Display contents of multiple files",
      },
      {
        command: "cat projects/workfolio/package.json | grep react",
        description: "Use cat in a pipe to search for 'react'",
      },
    ],
    seeAlso: ["grep", "wc", "ls"],
  },

  grep: {
    name: "grep - print lines matching a pattern",
    synopsis: "grep [OPTIONS] PATTERN [FILE]...",
    description: `Search for PATTERN in each FILE or standard input. PATTERN is, 
by default, a basic regular expression (BRE).

Grep searches the named input FILEs (or standard input if no files are named, 
or if a single hyphen-minus (-) is given as file name) for lines containing 
a match to the given PATTERN. By default, grep prints the matching lines.`,
    options: [
      {
        flag: "-i, --ignore-case",
        description: "ignore case distinctions in patterns and data",
      },
      {
        flag: "-n, --line-number",
        description: "prefix each line of output with the 1-based line number",
      },
      {
        flag: "-v, --invert-match",
        description: "select non-matching lines",
      },
      {
        flag: "-c, --count",
        description:
          "suppress normal output; instead print a count of matching lines",
      },
    ],
    examples: [
      {
        command: "grep 'React' README.md",
        description: "Search for 'React' in README.md",
      },
      {
        command: "grep -i 'typescript' *.ts",
        description:
          "Case-insensitive search for 'typescript' in all .ts files",
      },
      {
        command: "cat package.json | grep dependencies",
        description: "Use grep in a pipe to find dependencies",
      },
    ],
    seeAlso: ["cat", "wc", "ls"],
  },

  wc: {
    name: "wc - print newline, word, and byte counts",
    synopsis: "wc [OPTION]... [FILE]...",
    description: `Print newline, word, and byte counts for each FILE, and a total 
line if more than one FILE is specified. With no FILE, or when FILE is -, 
read standard input.

The wc command counts the number of lines, words, and characters in files. 
It can be used to analyze text files and is often used in combination with 
other commands through pipes.`,
    options: [
      {
        flag: "-l, --lines",
        description: "print the newline counts",
      },
      {
        flag: "-w, --words",
        description: "print the word counts",
      },
      {
        flag: "-c, --bytes",
        description: "print the byte counts",
      },
      {
        flag: "-m, --chars",
        description: "print the character counts",
      },
    ],
    examples: [
      {
        command: "wc README.md",
        description: "Count lines, words, and characters in README.md",
      },
      {
        command: "wc -l *.ts",
        description: "Count lines in all TypeScript files",
      },
      {
        command: "cat file.txt | grep 'error' | wc -l",
        description: "Count lines containing 'error' in file.txt",
      },
    ],
    seeAlso: ["cat", "grep", "ls"],
  },

  history: {
    name: "history - display command history",
    synopsis: "history",
    description: `Display the command history with line numbers.

The history command shows a numbered list of all commands that have been 
executed in the current terminal session. This is useful for reviewing 
previous commands and finding commands to reuse.`,
    options: [],
    examples: [
      {
        command: "history",
        description: "Display all command history",
      },
    ],
    seeAlso: ["help", "clear"],
  },

  help: {
    name: "help - display help information",
    synopsis: "help",
    description: `Display a summary of available commands and their basic usage.

The help command provides a quick reference for all available commands in 
the terminal. It shows command names and brief descriptions to help users 
understand what each command does.`,
    options: [],
    examples: [
      {
        command: "help",
        description: "Display help information for all commands",
      },
    ],
    seeAlso: ["man", "history"],
  },

  clear: {
    name: "clear - clear the terminal screen",
    synopsis: "clear",
    description: `Clear the terminal screen and scrollback buffer.

The clear command removes all text from the terminal display, providing 
a clean workspace. This is useful when the terminal becomes cluttered 
with output from previous commands.`,
    options: [],
    examples: [
      {
        command: "clear",
        description: "Clear the terminal screen",
      },
    ],
    seeAlso: ["help", "history"],
  },

  exit: {
    name: "exit - exit the terminal",
    synopsis: "exit [ROUTE]",
    description: `Exit the terminal and navigate to the specified route.

The exit command closes the terminal interface and navigates to a different 
page in the portfolio. If no route is specified, it defaults to the home page.`,
    options: [],
    examples: [
      {
        command: "exit",
        description: "Exit terminal and go to home page",
      },
      {
        command: "exit /projects",
        description: "Exit terminal and go to projects page",
      },
      {
        command: "exit /contact",
        description: "Exit terminal and go to contact page",
      },
    ],
    seeAlso: ["help", "cd"],
  },
  top: {
    name: "top - display system processes",
    synopsis: "top [-d=SECONDS]",
    description: `Display a real-time system monitor showing running processes, CPU usage, 
memory usage, and system statistics.

The top command provides a live-updating view of the portfolio application's 
internal processes, including MatrixBackground, Dock, Terminal, and other 
system components. The interface mimics the classic Unix 'top' command with 
Matrix-style theming.

Interactive controls:
- Press 'q' to quit
- Press 'k' to kill selected process
- Use arrow keys to select processes
- Press '1-4' to sort by different columns`,
    options: [
      {
        flag: "-d=SECONDS",
        description:
          "Set the refresh rate in seconds (default: 1, range: 1-10)",
      },
    ],
    examples: [
      {
        command: "top",
        description: "Start system monitor with default 1-second refresh rate",
      },
      {
        command: "top -d=2",
        description: "Start system monitor with 2-second refresh rate",
      },
      {
        command: "top -d=5",
        description:
          "Start system monitor with 5-second refresh rate for slower updates",
      },
    ],
    seeAlso: ["ps", "htop", "man"],
  },

  curl: {
    name: "curl - submit web scraping job",
    synopsis: "curl [URL]...",
    description: `Submit a web scraping job to the Arachne service for the specified URLs.

The curl command submits URLs to the Arachne web scraping service, which will 
extract content from the specified web pages. The scraping job runs asynchronously, 
and you can monitor its progress in real-time through the terminal.

The command returns a job ID immediately and updates the status as the scraping 
progresses. Once completed, the results are saved as a JSON file that can be 
viewed using the cat command or processed with other terminal commands like grep.

This integration demonstrates full-stack capabilities by connecting the terminal 
interface to a deployed backend service.`,
    options: [],
    examples: [
      {
        command: "curl https://example.com",
        description: "Submit a scraping job for example.com",
      },
      {
        command: "curl https://google.com https://github.com",
        description: "Submit a scraping job for multiple URLs",
      },
      {
        command: "curl https://news.ycombinator.com",
        description: "Scrape Hacker News homepage",
      },
      {
        command: "cat scraping_results/job_abc123.json | grep 'title'",
        description: "View scraping results and search for titles",
      },
    ],
    seeAlso: ["cat", "grep", "wc"],
  },

  arachne: {
    name: "arachne - web scraping service with real-time tracking",
    synopsis: "arachne [COMMAND] [ARGUMENTS]...",
    description: `Arachne is a powerful web scraping service that provides real-time progress 
tracking, concurrent scraping, and comprehensive result management.

The arachne command offers a complete web scraping solution with subcommands 
for submitting jobs, monitoring progress, and managing active scraping tasks. 
It integrates with a deployed Arachne service that handles the actual web 
scraping operations asynchronously.

Key features:
- Real-time progress tracking with visual indicators
- Concurrent scraping of multiple URLs
- Comprehensive error handling and retry mechanisms
- Results storage and export capabilities
- Metrics and analytics for scraping performance
- Integration with terminal-based workflow

The service uses Redis for job persistence and provides detailed metrics 
including response times, success rates, and domain-specific statistics.`,
    options: [
      {
        flag: "scrape",
        description: "Submit URLs for web scraping",
      },
      {
        flag: "status",
        description: "Check job status and retrieve results",
      },
      {
        flag: "jobs",
        description: "List all active scraping jobs",
      },
      {
        flag: "help",
        description: "Display detailed help information",
      },
    ],
    examples: [
      {
        command: "arachne scrape https://example.com",
        description: "Submit a single URL for scraping",
      },
      {
        command:
          "arachne scrape https://google.com https://github.com https://stackoverflow.com",
        description: "Submit multiple URLs for concurrent scraping",
      },
      {
        command: "arachne status 2c424e7e-18dc-44b2-a37a-cd757916febc",
        description: "Check status of a specific job by ID",
      },
      {
        command: "arachne jobs",
        description: "List all currently active scraping jobs",
      },
      {
        command: "arachne help",
        description: "Display comprehensive help and usage information",
      },
      {
        command: "arachne scrape https://news.ycombinator.com && arachne jobs",
        description: "Submit a job and immediately check active jobs",
      },
    ],
    seeAlso: ["curl", "cat", "grep", "wc"],
  },
};
