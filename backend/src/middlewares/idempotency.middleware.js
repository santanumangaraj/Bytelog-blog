import {
    PROCESSING,
    getRequest,
    startRequest,
} from "../services/idempotency.service.js";
import crypto from "crypto"

const idempotencyMiddleware = async (req, res, next) => {
    try {
        const genIdempotencyKey = crypto.randomUUID();
        const idempotencyKey = req.header("Idempotency-Key") || genIdempotencyKey;

        if (!idempotencyKey) {
            return res.status(400).json({
                success: false,
                message: "Idempotency-Key header is required",
            });
        }

        req.idempotencyKey = idempotencyKey;

        const cached = await getRequest(idempotencyKey);

        if (cached === PROCESSING) {
            return res.status(409).json({
                success: false,
                message: "Request already processing",
            });
        }

        if (cached) {
            return res.status(cached.statusCode).json(cached.body);
        }

        const started = await startRequest(idempotencyKey);

        if (!started) {
            return res.status(409).json({
                success: false,
                message: "Duplicate request",
            });
        }

        next();

    } catch (error) {
        next(error);
    }
};

export default idempotencyMiddleware;