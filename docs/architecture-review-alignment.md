# Architecture Review Alignment

This pilot was refined against the PR #38 architect feedback on the existing `rsg-bff`,
while keeping the first version small enough for developers to understand quickly.

## Applied In This Pilot

- **Domain boundary structure:** code is grouped under `src/modules/<domain>`, with `auth` as the first business domain.
- **Shared folder naming:** reusable code lives under `src/shared`, not `common`.
- **Domain co-location:** VTEX ID integration for authentication lives inside `src/modules/auth/integrations/vtex-id`, next to the FE-facing auth API.
- **Config over code transformation:** response mapping is declared in `src/modules/auth/config/transformationConfig.ts` and applied by the shared transformer.
- **Generic transformer:** `src/shared/transformer` provides reusable config-driven mapping.
- **Generic orchestrator:** `src/shared/orchestrator` supports series and parallel downstream calls.
- **Retry and timeout:** `src/shared/http/http.client.ts` owns retry/timeout behavior for downstream calls.
- **Route registration scalability:** `src/modules/routes.ts` registers domain route modules so `server.ts` does not grow into a long list of endpoints.
- **Strict schemas:** route schemas avoid permissive `additionalProperties: true` defaults.
- **Cookie safety:** cookie forwarding filters malformed cookie pairs and rejects control-character payloads.
- **VTEX auth token handling:** VTEX auth cookies are stored server-side; the browser receives only a BFF-owned `HttpOnly` session cookie.
- **Testing strategy:** tests live alongside the module under `src/modules/auth/tests`, with shared utility tests under `src/shared`.

## Transformation Flow

The transformer follows the KT pattern:

```text
Controller -> Orchestrator -> transformUtility -> transformationConfig
```

- Controllers never manually map fields.
- Domain configs live in `src/modules/<domain>/config/transformationConfig.ts`.
- The shared registry in `src/shared/transformer/transformationRegistry.ts` maps a string key to the domain config.
- The orchestrator applies transformation automatically when a task has `transformationOptions.transformConfigKey`.

Example from the pilot:

```ts
{
  name: "vtex-id.classicValidate",
  fn: (previousResult) =>
    vtexIdGateway.classicValidate({ login, password, cookies: previousResult?.cookies }),
  transformationOptions: {
    transformConfigKey: "classicSigninAPI",
  },
}
```

## Logging Flow

Logging follows the same pipeline shape without adding a large logger abstraction:

- `request-context.plugin.ts` logs inbound BFF requests with redacted headers and attaches response tracing headers.
- `orchestrator.ts` logs task lifecycle events: started, transforming, completed, and failed.
- `http.client.ts` logs downstream service calls, retries, responses, and network errors when a request context is passed.
- Sensitive headers such as `cookie`, `authorization`, and VTEX app credentials are redacted before logging.

The controller only passes the current request into the orchestrator. It does not manually log every
step.

## Error Mapping Flow

Downstream services return different error shapes, so the BFF normalizes them before sending a
client response:

```text
Downstream error -> errorRegistry -> AppError -> shared error envelope
```

- Known downstream errors live in `shared/errors/errorRegistry.ts`.
- `HttpClient` uses `logContext.externalService` to map known downstream errors.
- If no mapping exists, `HttpClient` falls back to status-specific generic errors.

## Migration Guidance

For future domains, start with this shape and only add files when the domain actually needs them:

```text
src/modules/<domain>/
├── config/
│   └── transformationConfig.ts
├── integrations/
│   └── <downstream>/
├── tests/
├── <domain>.controller.ts
├── <domain>.md
├── <domain>.routes.ts
├── <domain>.schema.ts
└── <domain>.types.ts
```

Domain modules should contain both:

- FE-facing BFF API handlers and schemas.
- Domain-specific downstream adapters needed to serve those frontend contracts.

Do not add global VTEX clients unless the behavior is truly cross-domain and generic.
Add a domain service or prehandler only when the endpoint has real business logic or protected-route
behavior. Do not add pass-through files just to satisfy a folder template.

## Intentionally Deferred

The review called out projections, aggregators, and circuit breakers. Those are valid BFF patterns,
but this pilot implements only the patterns needed by `classic-signin`: orchestration,
transformation, strict validation, retry/timeout, and safe cookie forwarding. Add projection,
aggregation, or circuit-breaker utilities when a real migrated endpoint needs them, not as empty
framework ceremony.
