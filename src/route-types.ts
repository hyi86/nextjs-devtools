// NOTE: This file should not be edited

export type Structure = {
  path: string;
  children: Structure[];
};

export type AppPathRoutes = {
  href: string;
  linkTypes: string;
  isParallelRoute: boolean;
  isDynamicRoute: boolean;
  files: string[];
  structures: Structure[];
};

export const appPathRoutes: AppPathRoutes[] = [];
