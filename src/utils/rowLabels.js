// Function to convert number to row label (A, B, C... Z, AA, BB, CC...)
export function numberToLetter(num) {
  if (num <= 26) {
    // For numbers 1-26, return single letters A-Z
    return String.fromCharCode(64 + num);
  } else {
    // For numbers > 26, return repeated letters (AA, BB, CC...)
    const letterIndex = ((num - 1) % 26) + 1;
    const letter = String.fromCharCode(64 + letterIndex);
    const repeatCount = Math.floor((num - 1) / 26) + 1;
    return letter.repeat(repeatCount);
  }
}

// Generate row labels: A, B, C... Z, AA, BB, CC...
export function generateRowLabels(count) {
  const labels = [];
  for (let i = 1; i <= count; i++) {
    labels.push(numberToLetter(i));
  }
  return labels;
}
