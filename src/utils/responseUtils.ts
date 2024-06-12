interface SuccessResponse {
  status: true;
  result: any;
  error: null;
}

interface ErrorResponse {
  status: false;
  result: null;
  error: string;
}

export const successResponse = (result: any): SuccessResponse => ({
  status: true,
  result,
  error: null,
});

export const errorResponse = (error: string): ErrorResponse => ({
  status: false,
  result: null,
  error,
});
