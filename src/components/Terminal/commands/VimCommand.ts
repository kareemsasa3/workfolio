import {
  Command,
  CommandResult,
  HistoryEntry,
  FileSystemItem,
  CoreTerminalAction,
  CoreTerminalState,
} from "../../../types/terminal";

export class VimCommand implements Command {
  name = "vim";

  async execute(
    _args: string[],
    _history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<CoreTerminalAction>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void,
    state?: CoreTerminalState
  ): Promise<CommandResult> {
    return [
      {
        id: state?.nextHistoryId || 0,
        text: "vim: This feature has been removed from the terminal",
        type: "error",
      },
    ];
  }

  getSuggestions(
    _input: string,
    _fileSystem: FileSystemItem[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}
