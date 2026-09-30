const validate = (schemas = {}) => {
  return (req, res, next) => {
    try {
      const { body, params, query } = schemas;

      if (body) {
        console.log("BACKEND BODY:", req.body);
        console.log("BACKEND ROLE:", req.body?.role);
        console.log("ROLE TYPE:", typeof req.body?.role);

        req.body = body.parse(req.body);
      }

      if (params) {
        req.params = params.parse(req.params);
      }

      if (query) {
        req.validatedQuery = query.parse(req.query);
      }

      next();
    } catch (error) {
      console.log("VALIDATION ERROR:", error.issues);
      next(error);
    }
  };
};

export default validate;
