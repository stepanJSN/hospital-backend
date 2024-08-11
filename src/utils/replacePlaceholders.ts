export function replacePlaceholders(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/{(\w+)}/g, (_, placeholder) => {
    return variables[placeholder] || `{${placeholder}}`;
  });
}
