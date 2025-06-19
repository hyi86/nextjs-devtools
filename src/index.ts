/**
 * @example
 * // in package.json
 * // 주의: `predev` 실행 시, 메모리 사용량 늘어남
 * "scripts": {
 *   "predev": "../../packages/devtools/bin/index.js --watch -p apps/next-full-stack &",
 *   "prebuild": "../../packages/devtools/bin/index.js -p apps/next-full-stack",
 * }
 *
 * // dev
 * pnpm start:dev -p apps/next-full-stack
 */
import { Command } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import { z, ZodError } from 'zod/v4';
import { run } from './generate';
import packageJson from '../package.json';

const program = new Command();

const config = {
  watch: false,
  package: '',
};

// 옵션 정의
program
  .name(packageJson.name)
  .description(packageJson.description) // 설명
  .version(packageJson.version) // 버전 정보
  .option('--watch', 'watch mode', false) // 옵션
  .option('-p, --package <package>', 'select packages') // 옵션
  .parse();

// 타입 체크 정의
const schema = z.object({
  watch: z.boolean().default(false),
  package: z.string().optional(),
});

// 옵션 파싱
try {
  const options = schema.parse(program.opts());
  config.watch = options.watch;
  config.package = options.package ?? '';
} catch (error) {
  if (error instanceof ZodError) {
    console.log(z.prettifyError(error));
  }
  process.exit(0);
}

// 패키지 경로 체크
try {
  fs.accessSync(path.join(config.package ?? '.'), fs.constants.F_OK);
} catch {
  console.log('error', '패키지 경로가 존재하지 않습니다');
  process.exit(0);
}

// generate
await run(config);
