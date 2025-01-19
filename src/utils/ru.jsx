const months = {
  nominative:
    "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split(
      "_"
    ),
  genitive:
    "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split(
      "_"
    ),
  prepositional:
    "январе_феврале_марте_апреле_мае_июне_июле_августе_сентябре_октябре_ноябре_декабре".split(
      "_"
    ),
};

/**
 * Возвращает название месяца в нужном падеже
 * @param {number} month - номер месяца от 0 до 11
 * @param {string} caseName - название падежа
 * @param {boolean} uppercase - с большой буквы
 * @returns {string}
 */
export const monthName = (month, caseName, uppercase) => {
  const monthName = months[caseName][month];
  return uppercase
    ? monthName.charAt(0).toUpperCase() + monthName.slice(1)
    : monthName;
};
