interface FlagBadgeProps {
  flag: string;
  code: string;
}

export function FlagBadge({ flag, code }: FlagBadgeProps) {
  return (
    <span className="inline-flex items-center space-x-1" title={code}>
      <span className="text-lg">{flag}</span>
      <span className="text-xs text-gray-500">{code}</span>
    </span>
  );
}
