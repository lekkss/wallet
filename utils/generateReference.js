function generateReference(isCredit) {
  const currentDate = new Date();
  const type = isCredit ? "CREDIT" : "DEBIT";

  return `${type}_${currentDate.getFullYear()}${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}`;
}

module.exports = generateReference;
