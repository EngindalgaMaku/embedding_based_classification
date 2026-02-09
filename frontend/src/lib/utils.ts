/**
 * Parses a multiline text input into an array of non-empty strings.
 * Each line becomes a separate text entry. Blank or whitespace-only lines are filtered out.
 */
export function parseTexts(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Formats a similarity score to exactly 4 decimal places.
 */
export function formatScore(score: number): string {
  return score.toFixed(4);
}

/**
 * Exports classification results as a JSON file download.
 * The JSON structure matches the API response format: { results: [...] }
 */
export function exportResultsAsJson(
  results: { text: string; category: string; similarity_score: number }[]
): void {
  const data = JSON.stringify({ results }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "classification-results.json";
  a.click();
  URL.revokeObjectURL(url);
}
