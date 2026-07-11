const validate = (schemas = {}) => {
  return (req, res, next) => {
    try {
      const { body, params, query } = schemas;

      if (body) {
        req.body = body.parse(req.body);
      }

      if (params) {
        req.params = params.parse(req.params);
      }

      if (query) {
        req.query = query.parse(req.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate
