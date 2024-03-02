const { parse, isValid } = require("date-fns");

const isValidDateDDMMYYYYFormat = (dateString) => {
  if (!dateString) {
    return false;
  }

  const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());

  // Check if the parsed date is a valid date
  return isValid(parsedDate);
};

const isDateInPresentOrFuture = (dateString) => {
  const [day, month, year] = dateString.split("/").map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false;
  }
  const inputDate = new Date(year, month - 1, day);
  const currentDate = new Date();

  // Check if the input date is greater than or equal to the current date
  return inputDate >= currentDate;
};

const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yy = String(today.getFullYear());
  return `${dd}-${mm}-${yy}`;
};

module.exports = {
  isValidDateDDMMYYYYFormat,
  isDateInPresentOrFuture,
  getCurrentDate,
};
