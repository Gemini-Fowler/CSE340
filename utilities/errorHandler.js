// utilities/errorHandler.js
const handleErrors = (err, req, res, next) => {
  console.error("ERROR:", err.stack);
  let message = err.message || "A server error occurred.";
  res.status(err.status || 500).render("errors/error", { message });
};

module.exports = handleErrors;
