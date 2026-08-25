export const OPEN_TERMINAL_EVENT = "adro:open-terminal";

export type OpenTerminalDetail = { source?: "floppy" };

export function openHiddenTerminal(source?: OpenTerminalDetail["source"]) {
  window.dispatchEvent(new CustomEvent<OpenTerminalDetail>(OPEN_TERMINAL_EVENT, { detail: { source } }));
}
