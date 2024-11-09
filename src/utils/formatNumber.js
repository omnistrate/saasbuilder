export const roundNumberToTwoDecimals = (number) => {
  return isNaN(number) ? number : Math.round(number * 100) / 100;
};

export const roundNumberToInteger = (number) => {
  return isNaN(number) ? number : Math.round(number);
};
