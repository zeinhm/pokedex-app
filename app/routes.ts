import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";
import { flatRoutes } from "remix-flat-routes";

const ROUTE_DIR = "routes";

export default remixRoutesOptionAdapter((defineRoutes) => {
  return flatRoutes(ROUTE_DIR, defineRoutes, {
    ignoredRouteFiles: [
      ".*",
      "**/*.css",
      "**/*.test.{js,jsx,ts,tsx}",
      "**/__*.*",
      "**/*.server.*",
      "**/*.client.*",
    ],
  });
});
