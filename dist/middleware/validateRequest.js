"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res
                    .status(400)
                    .json({
                    status: false,
                    error: error.details[0].message,
                    result: null,
                });
            }
            next();
        }
        catch (err) {
            return res
                .status(500)
                .json({ status: false, error: "Internal server error", result: null });
        }
    };
};
exports.validateRequest = validateRequest;
