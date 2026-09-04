export const OPEN_TERMINAL_EVENT = "adro:open-terminal";

export type OpenTerminalDetail = { source?: "floppy" };

export function openHiddenTerminal(source?: OpenTerminalDetail["source"]) {
  window.dispatchEvent(new CustomEvent<OpenTerminalDetail>(OPEN_TERMINAL_EVENT, { detail: { source } }));
}

export const OPEN_TOOL_EVENT = "adro:open-tool";

export type ToolName = "sort" | "pathfind" | "digit";

export function openTool(tool: ToolName) {
  window.dispatchEvent(new CustomEvent<ToolName>(OPEN_TOOL_EVENT, { detail: tool }));
}
