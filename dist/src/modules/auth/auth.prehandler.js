"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPreHandler = authPreHandler;
const permission_service_1 = require("../permission/permission.service");
const app_error_1 = require("../../shared/errors/app.error");
function authPreHandler(options) {
    return async (_request, _reply) => {
        if (options.publicRoute) {
            return;
        }
        const hasPermission = await (0, permission_service_1.checkUserPermissions)(options.permissions);
        if (!hasPermission) {
            throw app_error_1.AppError.forbidden("FORBIDDEN", "You do not have permission to perform this action");
        }
    };
}
//# sourceMappingURL=auth.prehandler.js.map