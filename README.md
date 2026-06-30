# RSG BFF New

Pilot framework for migrating `rsg-bff` toward a frontend-owned BFF style.

## What This Pilot Demonstrates

- One folder per business domain under `src/modules`.
- Route, controller, schema, type, config, integration, and tests separated by responsibility.
- Shared orchestration for sequential or parallel downstream calls.
- Config-driven response transformation through `transformConfigKey` and `transformationConfig.ts`.
- Downstream retry and timeout handling in one HTTP layer.
- Secure VTEX cookie forwarding through BFF response handling.

See `docs/architecture-review-alignment.md` for the PR #38 feedback mapping.

## Pilot API

`POST /api/v1/auth/classic-signin`

The endpoint performs:

1. `startAuthentication` against VTEX ID.
2. `classicValidate` against VTEX ID with cookies from step 1.
3. Response transformation to the frontend contract.
4. Server-side storage of VTEX cookies.
5. A BFF-owned `HttpOnly` session cookie returned to the frontend.

VTEX auth cookies such as `VtexIdclientAutCookie` are never returned to browser JavaScript or
frontend storage. The browser only receives `rsg_session`, which the BFF uses to look up the
server-side VTEX session.

The controller does not map fields manually. It gives the orchestrator a transform key:

```ts
transformationOptions: {
  transformConfigKey: "classicSigninAPI",
}
```

The shared transformer looks up that key in the registry and applies the domain config.

## Folder Pattern

```text
src/modules/auth/
├── config/
│   └── transformationConfig.ts
├── integrations/
│   └── vtex-id/
├── tests/
├── auth.controller.ts
├── auth.md
├── auth.routes.ts
├── auth.schema.ts
└── auth.types.ts
```

Future auth APIs should extend this shape. Add a service or prehandler only when the domain has real
business logic or protected-route behavior that would otherwise clutter the controller.

## Scripts

```bash
npm run type-check
npm test
npm run lint
```
