import { save as saveDialog, open as openDialog } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readFile } from "@tauri-apps/plugin-fs";

const MD_FILTERS = [{ name: "Markdown", extensions: ["md"] }];
const DOC_FILTERS = [
  { name: "Documents", extensions: ["docx", "pdf", "pptx", "xlsx", "epub", "csv", "rtf", "odt"] },
];

export async function pickSavePath(defaultName = "document"): Promise<string | null> {
  return saveDialog({ defaultPath: `${defaultName}.md`, filters: MD_FILTERS });
}

export async function pickOpenPath(): Promise<string | null> {
  const selected = await openDialog({ filters: DOC_FILTERS, multiple: false });
  return typeof selected === "string" ? selected : null;
}

export async function writeFile(path: string, body: string): Promise<void> {
  await writeTextFile(path, body);
}

export async function readFileBytes(path: string): Promise<Uint8Array> {
  return readFile(path);
}
