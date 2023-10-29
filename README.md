# Rastercar FRONT

## Good to know.

### Why is the project full of `+page.server.ts` files with a "useless" load function ? `export const load = async () => ({})`

its actually not useless and its used to "force" a "request" to the sveltekit server in order to fire the `hooks.server.ts`
file, where the auth check happens, this is needed unfortunately because when client side routing takes over, the auth checks
at `hooks.server.ts` are not run unless we have said load function.

if the file is not present and the user became unauthenticated (eg: cleared his cookies), the user is able to navigate to pages
that should be behind a login guard, this is not a security risk because he wont fetch anything from the api without his session
cookie, but is still a bad UX issue.

> for more information see: https://github.com/sveltejs/kit/issues/6315

### Why is ACL seemingly done at the client side with the `PermissionGuard` component ?

its actually not, the API checks the user permissions on protected endpoints, but it would not make sense to show UI the user
lacks the permissions to use, such as a form / button / page.

### Why not protect pages with navigation guards instead of using the `PermissionGuard` component ?

route protection can be done with [nav hooks](https://kit.svelte.dev/docs/modules#$app-navigation-beforenavigate) on the root layout,
as we can check the user permissions before routing, and redirect to a error page if the user lacks permissions, this is fine.

However this would achieve a identical result as using the `PermissionGuard` component but with an additional redirect, less granular
control of what is hidden and shown as well as having to manage all the protected routes required permissions and links on the root layout,
so changing a single route url can be a pain.
