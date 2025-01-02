/**
 * Calculates the total sum of all item amounts in the provided list.
 * @param {Array} items - An array of objects, each containing a 'sum' property.
 * @returns {number} The total sum of all 'sum' properties in the items array.
 */
export const calculateTotal = (items) =>
  items.reduce((acc, item) => acc + parseFloat(item.sum), 0);

/**
 * Calculates the average sum of all item amounts in the provided list.
 * @param {Array} items - An array of objects, each containing a 'sum' property.
 * @param {number} number - The number to calculate the average for.
 * @returns {number} The average sum of all 'sum' properties in the items array.
 */
export const calculateAverage = (items, number) => {
  const total = calculateTotal(items);
  return number ? total / number : total / items.length;
};

/**
 * Calculates the number of months between two dates.
 * @param {Date} d1 - The first date.
 * @param {Date} d2 - The second date.
 * @returns {number} The number of months between the two dates.
 */
export const calculateMonthsDiff = (d1, d2) => {
  const months =
    (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
  return months <= 0 ? 0 : months;
};
