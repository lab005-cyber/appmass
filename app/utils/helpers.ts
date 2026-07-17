export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function extractHashtags(text: string): string[] {
  const regex = /#(\w+)/g;
  const matches = text.match(regex);
  return matches ? matches.map((tag) => tag.slice(1).toLowerCase()) : [];
}

export function extractMentions(text: string): string[] {
  const regex = /@(\w+)/g;
  const matches = text.match(regex);
  return matches ? matches.map((m) => m.slice(1)) : [];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username);
}
