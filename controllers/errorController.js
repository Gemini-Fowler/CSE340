const throwError = (req, res, next) => {
  const err = new Error("This is a simulated 500 error.");
  err.status = 500;
  throw err;
};

module.exports = { throwError };