import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import App from "./App";
import { ProjectDetail } from "./pages/ProjectDetail";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$projectId",
  component: ProjectDetail,
});

const routeTree = rootRoute.addChildren([indexRoute, projectDetailRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
