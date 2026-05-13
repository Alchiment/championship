interface FlagBadgeProps {
  flag: string;
  code: string;
}

export function FlagBadge({ flag, code }: FlagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1" title={code}>
      <span className="text-xl">{flag}</span>
      <span className="text-xs text-muted">{code}</span>
    </span>
  );
}
