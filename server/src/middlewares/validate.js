const validate = (schemas = {}) => {
  return (req, res, next) => {
    console.log("🔥 NEW VALIDATE MIDDLEWARE");

    try {
      const { body, params, query } = schemas;

      if (body) {
        console.log("🔥 BODY VALIDATION");
        console.log("BODY:", req.body);
        console.log("ROLE:", req.body?.role);
        console.log("TYPE:", typeof req.body?.role);

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
      console.log("🔥 VALIDATION ERROR", error);
      next(error);
    }
  };
};

export default validate;
