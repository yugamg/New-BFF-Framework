# Auth Module

The auth module owns shopper authentication and account-entry flows for the BFF.

## Pilot API

`POST /api/v1/auth/classic-signin`

Flow:

1. Validate the frontend request body with `ClassicSigninRequestSchema`.
2. Execute VTEX ID calls in series through the shared orchestrator.
3. Pass cookies returned by `startAuthentication` into `classicValidate`.
4. Store returned VTEX cookies server-side.
5. Transform the VTEX response through `config/transformationConfig.ts`.

## Future APIs

The same module will hold:

- `POST /api/v1/auth/login/send-access-key`
- `POST /api/v1/auth/login/verify-access-key`
- `GET /api/v1/auth/logout`
- `POST /api/v1/registration/send-access-key`
- `POST /api/v1/registration/register`

Keep route wiring in `auth.routes.ts`, orchestration in `auth.controller.ts`, VTEX ID calls in
`integrations/vtex-id`, API schemas in `auth.schema.ts`, and frontend response shaping in
`config/transformationConfig.ts`.
