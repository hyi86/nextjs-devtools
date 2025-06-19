import { watch } from 'chokidar';
import { generate as generateTypedDictionaries } from './typed-i18n-dictionaries';
import { generate as generateTypedRoutes } from './typed-next-routes';

export async function run(config: { watch: boolean; package: string }) {
  // 프로덕션 모드로 실행 (1회 실행)
  if (!config.watch) {
    console.log('process', 'Start generating... (Run in Once)');
    await Promise.all([
      generateTypedRoutes('src/app-path-types.ts'), // add type-safe routes
      generateTypedDictionaries('src/dictionaries'), // add type-safe dictionaries
    ]);
    console.log('success', 'Generated all successfully');
    return;
  }

  // 파일 변경 감지 (chokidar)
  console.log('process', 'Start generating... (Watch Mode)');

  watch(['src/app', 'src/dictionaries'], {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: true,
    binaryInterval: 1500,
    interval: 1500,
  }).on('all', async (event, filePath) => {
    // 딕셔너리 생성
    if (event === 'change' && filePath.includes('src/dictionaries')) {
      await generateTypedDictionaries('src/dictionaries');
    }

    if (event === 'change') {
      return;
    }

    // 라우트 생성
    if (
      filePath.includes('src/app') &&
      filePath.match(/\/(page|layout|loading|not-found|error|template)\.(ts|tsx|mdx)$/)
    ) {
      await generateTypedRoutes('src/app-path-types.ts');
    }
  });
  console.log('success', 'Generated all successfully');
}
