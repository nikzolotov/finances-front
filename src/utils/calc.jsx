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
