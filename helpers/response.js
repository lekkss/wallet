const handleResponse = (statusCode, status, message, data) => {
  let response;
  return (response = { statusCode, status, message, data });
};
module.exports = { handleResponse };
