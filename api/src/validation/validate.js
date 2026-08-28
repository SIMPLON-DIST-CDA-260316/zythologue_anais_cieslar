export function validate(schema) {
    return function (req, res, next) {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const issue = result.error.issues[0];
            return res.status(400).json({
                message: `${issue.path[0]}: ${issue.message}`
            });
        }

        req.body = result.data;
        next();
    };
}
