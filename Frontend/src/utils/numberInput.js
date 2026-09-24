export const preventInvalidNumberKey = (event) => {
  if (["e", "E", "+", "-"].includes(event.key)) {
    event.preventDefault();
  }
};

export const preventInvalidNumberPaste = (event) => {
  const pastedValue = event.clipboardData.getData("text").trim();

  if (!/^\d*\.?\d*$/.test(pastedValue)) {
    event.preventDefault();
  }
};
