import { Command, CommandResult, HistoryEntry } from "../../../types/terminal";
import {
  getSourceFileContent,
  pathExists,
} from "../../../data/sourceFileSystem";

export class VimCommand implements Command {
  name = "vim";

  async execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: any[],
    dispatch: React.Dispatch<any>,
    currentDirectory: string,
    onNavigate?: (route: string) => void,
    state?: any
  ): Promise<CommandResult> {
    if (args.length === 0) {
      return [
        {
          id: state?.nextHistoryId || 0,
          text: "vim: missing file argument",
          type: "error",
        },
      ];
    }

    const filePath = args[0];

    // Check if file exists in the source code
    const exists = await pathExists(filePath);
    if (!exists) {
      return [
        {
          id: state?.nextHistoryId || 0,
          text: `vim: ${filePath}: No such file or directory`,
          type: "error",
        },
      ];
    }

    // Get file content
    const content = await getSourceFileContent(filePath);
    if (!content) {
      return [
        {
          id: state?.nextHistoryId || 0,
          text: `vim: ${filePath}: Could not read file content`,
          type: "error",
        },
      ];
    }

    // Dispatch action to show vim editor
    dispatch({
      type: "SHOW_VIM_EDITOR",
      payload: {
        filePath,
        content,
      },
    });

    return [
      {
        id: state?.nextHistoryId || 0,
        text: `Opening ${filePath} in vim...`,
        type: "info",
      },
    ];
  }

  getSuggestions(
    input: string,
    fileSystem: any[],
    currentDirectory: string
  ): string[] {
    // This could be enhanced to suggest files based on the current directory
    return [];
  }
}
