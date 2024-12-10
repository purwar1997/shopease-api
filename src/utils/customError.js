class CustomError extends Error {
  constructor(message, httpCode = 500) {
    super(message);
    this.code = httpCode;
  }
}

export default CustomError;
