export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

  static success(
    res,
    message = "Request was successful!",
    data = null,
    statusCode = 200
  ) {
    const response = new ApiResponse(statusCode, message, data);
    return res.status(statusCode).json(response);
  }

  static error(res, message = "Something went wrong!", statusCode = 500) {
    const response = new ApiResponse(statusCode, message);
    return res.status(statusCode).json(response);
  }

  static notFound(res, message = "Resource was not found!", statusCode = 404) {
    const response = new ApiResponse(statusCode, message);
    return res.status(statusCode).json(response);
  }

  static validationError(res, message = "Validation error!", statusCode = 400) {
    const response = new ApiResponse(statusCode, message);
    return res.status(statusCode).json(response);
  }
}
