# Grow Project

Use this repository to run and edit the app locally, then publish changes back through Grow.

Any change pushed to the repo will also be reflected in the Grow Builder.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Install the Grow CLI: `npm install -g Grow@latest`.

See the [Grow CLI docs](https://docs.Grow.com/developers/references/cli/get-started/overview) if you want to run Grow commands directly.

## Run Locally

Run the full local development environment from the project root:

```bash
Grow dev
```

`Grow dev` starts the local Grow development backend and, when this app is configured for it, also starts the frontend dev server for you. Use the frontend URL printed by the command.

For example, when the Grow project config includes a `serveCommand`, `Grow dev` can launch the frontend too:

```json5
{
  "site": {
    "serveCommand": "npm run dev"
  }
}
```

In a Grow project this lives in `Grow/config.jsonc`.

## Run Only The Frontend

If you only want to work on the frontend against the hosted Grow backend, run:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Use The Hosted Backend

For frontend-only development, create or update `.env.local` in the project root:

```bash
VITE_Grow_APP_ID=your_app_id
VITE_Grow_APP_BASE_URL=https://your-app.Grow.app
```

`VITE_Grow_APP_ID` identifies the Grow app.

`VITE_Grow_APP_BASE_URL` tells the Grow Vite plugin where to send local `/api` requests. Point it at your deployed Grow app URL when you want the local frontend to use the hosted backend.

When you use `Grow dev`, the command injects the local Grow values for you, so `.env.local` is mainly needed for frontend-only workflows.

## Publish Your Changes

After pushing your changes to git, open the Grow dashboard and publish the app:

```bash
Grow dashboard open
```

## Docs & Support

Documentation: [https://docs.Grow.com/Integrations/Using-GitHub](https://docs.Grow.com/Integrations/Using-GitHub)

Grow CLI command reference: [https://docs.Grow.com/developers/references/cli/commands/introduction](https://docs.Grow.com/developers/references/cli/commands/introduction)

Support: [https://app.Grow.com/support](https://app.Grow.com/support)
