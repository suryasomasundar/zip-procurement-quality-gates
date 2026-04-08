# Blue/Green Rollout

This repository includes a local blue/green deployment model using Docker Compose.

## Services

- `api-blue`
- `api-green`
- `web-blue`
- `web-green`
- `edge`

The `edge` proxy reads `ACTIVE_COLOR` from [`.env.blue-green`](/Users/somu-cookunity/Documents/zip/.env.blue-green) and routes traffic to either the blue or green stack.

## Start the environment

```bash
docker compose -f docker-compose.blue-green.yml up --build
```

Application entry point:

- `http://localhost:8080`

## Switch active color

```bash
./scripts/switch-active-color.sh green
./scripts/switch-active-color.sh blue
```

This recreates only the edge proxy so traffic flips between stacks without changing the backing services.

## Why this matters

This is a local approximation of how a future production rollout could work:

- deploy the inactive color
- run smoke validation against the inactive color
- switch traffic once validation passes
- retain the previous color for fast rollback

In a hosted setup, the same pattern could be wired to a load balancer, preview environment, or GitOps deployment tool such as Argo CD.
