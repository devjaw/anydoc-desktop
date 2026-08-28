type Props = {
  counts: { words: number; chars: number; lines: number };
};

export function StatusBar({ counts }: Props) {
  return (
    <div className="statusbar">
      <span>{counts.words.toLocaleString()} words</span>
      <span>{counts.chars.toLocaleString()} chars</span>
      <span>{counts.lines.toLocaleString()} lines</span>
    </div>
  );
}
