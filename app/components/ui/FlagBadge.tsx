interface FlagBadgeProps {
  flag: string;
  code: string;
}

export function FlagBadge({ flag }: FlagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-xl">{flag}</span>
    </span>
  );
}
