# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

---

### Important considerations

- why is the project full of `+page.server.ts` files with a "useless" load function ? `export const load = async () => ({})`

its actually not useless and its used to "force" a "request" to the sveltekit server in order to fire the `hooks.server.ts`
file, where the auth check happens, this is needed unfortunately because when client side routing takes over, the auth checks
at `hooks.server.ts` are not run unless we have said load function.

if the file is not present and the user became unauthenticated (eg: cleared his cookies), the user is able to navigate to pages
that should be behind a login guard, this is not a security risk because he wont fetch anything from the api without his session
cookie, rather its a UX issue.

for more information see:
https://github.com/sveltejs/kit/issues/6315
