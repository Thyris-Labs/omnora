# Omnora

This repository is a monorepo with:

- a Svelte web client in `apps/frontend`
- a Go API in `apps/api`

## Install

Install [mise](https://mise.jdx.dev/getting-started.html) first, then initialize the repo with one command:

```sh
mise setup
```

That single command is the onboarding entrypoint for this project. It will:

- install any missing pinned tools from `mise.toml`
- install the JavaScript workspace dependencies with `pnpm`

If you do not already have local env files, create them before you start working:

```sh
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
```

## Start Developing

Once setup is done, you'll want to start the docker services:

```sh
mise docker:up
```

And finally start the full local development stack:

```sh
mise dev
```

## Command Glossary

The command surface for this repo lives in `mise.toml`. As more workflows are added, they should be exposed as `mise` tasks here first.

The shorthand `mise <task>` is used below for readability. The explicit form `mise run <task>` is equivalent.

### Core Workflow

```sh
mise setup
mise dev
mise build
mise test
mise lint
mise format
mise check-types
mise clean
```

### Backend Workflow

```sh
mise backend:dev
mise backend:build
mise backend:test
```

### Database And Code Generation

```sh
mise generate:schemas
mise migrate:up
mise migrate:down
mise run migrate:new add_users_table
```

### Local Services

```sh
mise docker:up
mise docker:down
```

## Architecture

### Monorepo Layout

- `apps/frontend` contains the frontend app
- `apps/api` contains the API, database migrations, SQL queries, and generated database code
