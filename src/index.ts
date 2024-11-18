#!/usr/bin/env node

import { Command } from 'commander';
import { scanFiles } from './services/fileScanner';
import { generatePlantUml } from './services/plantUmlGenerator';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

// .envファイルを読み込む（ファイルの先頭で実行）
dotenv.config();

const program = new Command();

program
  .name('ts-uml-generator')
  .description('TypeScriptファイルからPlantUMLとドキュメントを生成するツール')
  .version('1.0.0')
  .requiredOption(
    '-i, --input <path>',
    '解析したいファイルのディレクトリパス'
  )
  .option(
    '-o, --output <path>',
    'UMLファイルの出力ディレクトリ',
    'uml'
  )
  .requiredOption(
    '--framework <type>',
    '使用するフレームワーク（reactまたはvue）'
  )
  .option(
    '--service <type>',
    '使用するAIサービス（openaiまたはclaudeまたはollama）',
    'openai'
  )
  .option(
    '--model <model>',
    '使用するモデル'
  )
  .option(
    '--openai-key <key>',
    'OpenAI APIキー（環境変数 OPENAI_API_KEY でも設定可能）'
  )
  .option(
    '--claude-key <key>',
    'Claude APIキー（環境変数 ANTHROPIC_API_KEY でも設定可能）'
  )
  .option(
    '--env <path>',
    '環境変数ファイルのパス',
    '.env'
  );

async function main() {
  try {
    program.parse();
    const options = program.opts();

    // 指定された.envファイルを読み込む
    if (options.env) {
      dotenv.config({ path: path.resolve(options.env) });
    }

    // APIキーの設定
    if (options.service === 'openai' && options.openaiKey) {
      process.env.OPENAI_API_KEY = options.openaiKey;
    } else if (options.service === 'claude' && options.claudeKey) {
      process.env.ANTHROPIC_API_KEY = options.claudeKey;
    }

    // サービスのバリデーション
    if (!['openai', 'claude', 'ollama'].includes(options.service)) {
      throw new Error('サービスオプションは "openai" または "claude" または "ollama" を指定してください。');
    }

    if (options.service === 'openai' && !process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI APIキーが設定されていません。--openai-key オプションまたは環境変数 OPENAI_API_KEY で設定してください。');
    }

    if (options.service === 'claude' && !process.env.ANTHROPIC_API_KEY) {
      throw new Error('Claude APIキーが設定されていません。--claude-key オプションまたは環境変数 ANTHROPIC_API_KEY で設定してください。');
    }

    const inputPath = path.resolve(options.input);
    const outputPath = path.resolve(options.output);

    // 入力パスの存在確認
    try {
      await fs.access(inputPath);
    } catch {
      throw new Error(`入力パス ${inputPath} が存在しません`);
    }

    // 出力ディレクトリの作成
    await fs.mkdir(outputPath, { recursive: true });

    console.log('ファイルのスキャンを開始します...');
    const files = await scanFiles(inputPath, options.framework);
    console.log(`${files.length}個の${options.framework}ファイルが見つかりました`);
    
    // 各ファイルに対してPlantUMLとドキュメントを生成
    for (const file of files) {
      console.log(`\n処理中: ${file}`);
      await generatePlantUml(file, inputPath, outputPath, options.service as 'openai' | 'claude' | 'ollama', options.model, options.framework);
    }

    console.log('\nすべての処理が完了しました！');
    console.log(`出力ディレクトリ: ${outputPath}`);
  } catch (error) {
    console.error('エラーが発生しました:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main(); 