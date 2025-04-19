class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // If err is a string, convert it to an ErrorHandler instance
  if (typeof err === "string") {
    err = new ErrorHandler(err, 400); // You can set a default statusCode like 400
  }

  // Set default error message and status code
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific error cases
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }

  // Send the error response
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
