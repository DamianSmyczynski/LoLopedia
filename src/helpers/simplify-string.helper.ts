export function simplifyString(input: string): string {
  return input.replace(/\s+/g, '').toLowerCase();
}
