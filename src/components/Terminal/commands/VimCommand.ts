import { Command, CommandResult, HistoryEntry } from "../../../types/terminal";

export class VimCommand implements Command {
  name = "vim";

  async execute(
    _args: string[],
    _history: HistoryEntry[],
    _fileSystem: any[],
    _dispatch: React.Dispatch<any>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void,
    state?: any
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
    _fileSystem: any[],
    _currentDirectory: string
  ): string[] {
    return [];
  }
}
