import FastGlob from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';
import type { UnknownRecord } from 'type-fest';
import { parse } from 'yaml';

export async function generate(filePath: string, outputPath: string) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK); // 존재만 확인
  } catch {
    return;
  }

  const result: UnknownRecord = {};
  const yamlFiles = await FastGlob(`${filePath}/**/*.yaml`);

  for (const yamlFile of yamlFiles) {
    const lang = path.basename(yamlFile).replace(/(\.yaml)$/, '');
    const file = fs.readFileSync(yamlFile, 'utf-8');
    const data = parse(file);
    result[lang] = data;
  }

  const content = JSON.stringify(result);
  fs.writeFileSync(outputPath, content, 'utf-8');
}
