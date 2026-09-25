// Blocks keyboard characters that cannot form a non-negative numeric value.
export const preventInvalidNumberKey = (event) => {
  if (["e", "E", "+", "-"].includes(event.key)) {
    event.preventDefault();
  }
};

// Rejects pasted content that is not a non-negative decimal number.
export const preventInvalidNumberPaste = (event) => {
  const pastedValue = event.clipboardData.getData("text").trim();

  if (!/^\d*\.?\d*$/.test(pastedValue)) {
    event.preventDefault();
  }
};
