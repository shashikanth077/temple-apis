const { parse, isValid } = require("date-fns");

const isValidDateDDMMYYYYFormat = (dateString) => {
  if (!dateString) {
    return false;
  }

  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());

  // Check if the parsed date is a valid date
  return isValid(parsedDate);
};

module.exports = isValidDateDDMMYYYYFormat;
