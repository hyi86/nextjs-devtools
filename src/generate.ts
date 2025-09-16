import { watch } from 'chokidar';
import { generate as generateTypedDictionaries } from './typed-i18n-dictionaries';
import { generate as generateTypedRoutes } from './typed-next-routes';

const appRoutesPath = 'src/route-types.ts';
const dictionariesPath = 'src/dictionaries.json';

export async function run(config: { watch: boolean; package: string }) {
  // 프로덕션 모드로 실행 (1회 실행)
  if (!config.watch) {
    console.log('process', 'Start generating... (Run in Once)');
    await Promise.all([
      generateTypedRoutes(appRoutesPath), // add type-safe routes
      generateTypedDictionaries('messages', dictionariesPath), // add type-safe dictionaries
    ]);
    console.log('success', 'Generated all successfully');
    return;
  }

  // 파일 변경 감지 (chokidar)
  console.log('process', 'Start generating... (Watch Mode)');

  watch(['src/app', 'messages'], {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: true,
    binaryInterval: 1500,
    interval: 1500,
  }).on('all', async (event, filePath) => {
    // `messages/` 폴더 내, 파일 변경 시, 딕셔너리 JSON 생성
    if (event === 'change') {
      if (filePath.includes('messages/')) {
        await generateTypedDictionaries('messages', dictionariesPath);
      }
      return;
    }

    // 라우트 파일 생성 및 변경 시,
    if (
      filePath.includes('src/app') &&
      filePath.match(/\/(page|layout|loading|not-found|error|template)\.(ts|tsx|mdx)$/)
    ) {
      await generateTypedRoutes(appRoutesPath);
    }
  });

  console.log('success', 'Generated all successfully');
}
