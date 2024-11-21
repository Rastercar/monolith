# Rastercar FRONT

## Good to know.

### Why is ACL seemingly done at the client side with the `PermissionGuard` component ?

its actually not, the API checks the user permissions on protected endpoints, but it would not make sense to show UI the user
lacks the permissions to use, such as a form / button / page.

### Why not protect pages with navigation guards instead of using the `PermissionGuard` component ?

route protection can be done with [nav hooks](https://kit.svelte.dev/docs/modules#$app-navigation-beforenavigate) on the root layout,
as we can check the user permissions before routing, and redirect to a error page if the user lacks permissions, this is fine.

However this would achieve a identical result as using the `PermissionGuard` component but with an additional redirect, less granular
control of what is hidden and shown as well as having to manage all the protected routes required permissions and links on the root layout,
so changing a single route url can be a pain.
