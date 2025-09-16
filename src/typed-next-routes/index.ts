import fs from 'node:fs';
import { format } from 'prettier';
import { getRouteStructure } from './route-structure';

/**
 * 라우트 타입 정의 파일 생성
 */
export async function generate(filePath: string) {
  const routeStructure = await getRouteStructure();
  routeStructure.sort((a, b) => a.href!.localeCompare(b.href!));

  const contents = `
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

  export const appPathRoutes: AppPathRoutes[] = ${JSON.stringify(routeStructure, null, 2)};
  `.trim();

  const formattedContents = await format(contents, {
    parser: 'typescript',
    printWidth: 120,
    singleQuote: true,
  });

  fs.writeFileSync(filePath, formattedContents, 'utf-8');
}
