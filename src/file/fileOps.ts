import { pickSavePath, writeFile, readFileBytes } from "./fileIO";

export async function saveMarkdown(name: string, md: string): Promise<void> {
  const defaultName = name.replace(/\.[^.]+$/, "");
  const path = await pickSavePath(defaultName);
  if (!path) return;
  await writeFile(path, md);
}

export function fileNameFromPath(path: string): string {
  return path.split(/[\\/]/).pop() ?? path;
}

export async function readDocument(path: string): Promise<{ name: string; bytes: Uint8Array; ext: string }> {
  const bytes = await readFileBytes(path);
  const name = fileNameFromPath(path);
  const ext = (name.split(".").pop() ?? "").toLowerCase();
  return { name, bytes, ext };
}
