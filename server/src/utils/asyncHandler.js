const asyncHandler = (requestHandler) => {
  return (res, req, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
