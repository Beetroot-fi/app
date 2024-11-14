function useTruncateString(
  input: string | null,
  start: number,
  end: number
): string {
  if (input == null) {
    return "";
  }

  const length = input.length;

  if (length > start + end) {
    return `${input.substring(0, start)}...${input.substring(
      length - end,
      length
    )}`;
  }

  return input;
}

export default useTruncateString;
