// useTruncateString.ts
function useTruncateString(
  input: string | null,
  start: number,
  end: number
): string {
  // Проверяем, что входная строка не null и не undefined
  if (input == null) {
    return ""; // Возвращаем пустую строку или другое уместное значение
  }

  // Теперь можно безопасно обращаться к свойству length
  const length = input.length;

  // Трункация строки
  if (length > start + end) {
    return `${input.substring(0, start)}...${input.substring(
      length - end,
      length
    )}`;
  }

  return input;
}

export default useTruncateString;
