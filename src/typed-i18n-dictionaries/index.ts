import FastGlob from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';
import type { UnknownRecord } from 'type-fest';
import { parse } from 'yaml';

export async function generate(watchFilePath: string, outputPath: string) {
  try {
    fs.accessSync(watchFilePath, fs.constants.F_OK); // 존재만 확인
  } catch {
    console.log(` Skip generating: ${watchFilePath} is not found`);
    return;
  }

  const result: UnknownRecord = {};
  const yamlFiles = await FastGlob(`${watchFilePath}/**/*.yaml`);

  for (const yamlFile of yamlFiles) {
    const lang = path.basename(yamlFile).replace(/(\.yaml)$/, '');
    const file = fs.readFileSync(yamlFile, 'utf-8');
    const data = parse(file);
    result[lang] = data;
  }

  const content = JSON.stringify(result, null, 2);
  fs.writeFileSync(outputPath, content, 'utf-8');
}
