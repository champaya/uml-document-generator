import fs from 'fs/promises';
import path from 'path';
import cliProgress from 'cli-progress';
import { generateUmlFromCode } from './openaiService';
import { generateUmlFromCodeClaude } from './claudeService';
import { generateUmlFromCodeOllama } from './ollamaService';
import {reactPrompts} from '../prompts/react';
import {vuePrompts} from '../prompts/vue';
import { Prompts } from '../types/types';

type DiagramType = 'state' | 'activity' | 'sequence';
type Framework = 'react' | 'vue';

const promptsMap: Record<Framework, Prompts> = {
  react: reactPrompts,
  vue: vuePrompts,
};

/**
 * 図を生成します。
 * 
 * @param code - 対象のTypeScriptコード
 * @param diagramType - 図の種類
 * @param outputPath - 出力先のパス
 * @param service - 使用するサービス ('openai' | 'claude' | 'ollama')
 * @param model - 使用するモデル
 * @param framework - フレームワーク ('react' | 'vue')
 */
export async function generateDiagram(
  code: string,
  diagramType: DiagramType,
  outputPath: string,
  service: 'openai' | 'claude' | 'ollama',
  model: string,
  framework: Framework = 'react'
): Promise<void> {
  const prompts = promptsMap[framework];
  let prompt: string;

  switch (diagramType) {
    case 'state':
      prompt = prompts.stateUmlPrompt;
      break;
    case 'activity':
      prompt = prompts.activityUmlPrompt;
      break;
    case 'sequence':
      prompt = prompts.sequenceUmlPrompt;
      break;
    default:
      throw new Error(`未対応の図の種類です: ${diagramType}`);
  }

  let umlContent: string;
  if (service === 'openai') {
    umlContent = await generateUmlFromCode(code, prompt, false, model);
  } else if (service === 'claude') {
    umlContent = await generateUmlFromCodeClaude(code, prompt, false, model);
  } else if (service === 'ollama') {
    umlContent = await generateUmlFromCodeOllama(code, prompt, false, model);
  } else {
    throw new Error(`未対応のサービスです: ${service}`);
  }

  await fs.writeFile(outputPath, umlContent);
}

/**
 * マークダウンを生成します。
 * 
 * @param code - 対象のTypeScriptコード
 * @param outputPath - 出力先のパス
 * @param service - 使用するサービス ('openai' | 'claude' | 'ollama')
 * @param model - 使用するモデル
 * @param framework - フレームワーク ('react' | 'vue')
 */
export async function generateMarkdown(
  code: string,
  outputPath: string,
  service: 'openai' | 'claude' | 'ollama',
  model: string,
  framework: Framework = 'react'
): Promise<void> {
  const prompts = promptsMap[framework];
  let markdownContent: string;
  if (service === 'openai') {
    markdownContent = await generateUmlFromCode(code, prompts.markdownPrompt, true, model);
  } else if (service === 'claude') {
    markdownContent = await generateUmlFromCodeClaude(code, prompts.markdownPrompt, true, model);
  } else if (service === 'ollama') {
    markdownContent = await generateUmlFromCodeOllama(code, prompts.markdownPrompt, true, model);
  } else {
    throw new Error(`未対応のサービスです: ${service}`);
  }
  await fs.writeFile(outputPath, markdownContent);
}

/**
 * PlantUMLを生成します。
 * 
 * @param filePath - ソースファイルのパス
 * @param basePath - 基本ディレクトリのパス
 * @param outputPath - 出力先のパス
 * @param service - 使用するサービス ('openai' | 'claude' | 'ollama')
 * @param model - 使用するモデル
 * @param framework - フレームワーク ('react' | 'vue')
 */
export async function generatePlantUml(
  filePath: string,
  basePath: string,
  outputPath: string,
  service: 'openai' | 'claude' | 'ollama',
  model: string,
  framework: Framework = 'react'
): Promise<void> {
  const diagramTypes: DiagramType[] = ['state', 'activity', 'sequence'];
  const totalSteps = diagramTypes.length + 2;
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  
  progressBar.start(totalSteps, 0);

  try {
    const code = await fs.readFile(filePath, 'utf-8');
    progressBar.increment();

    // 相対パスの計算
    const relativePath = path.relative(basePath, filePath);
    // 出力ディレクトリを outputPath 配下に変更
    const umlDir = path.join(outputPath, path.dirname(relativePath));
    const baseFileName = path.basename(filePath, path.extname(filePath));

    progressBar.increment();

    // 各図の種類に対してPlantUMLファイルを生成
    for (const diagramType of diagramTypes) {
      const umlPath = path.join(
        umlDir, 
        `${baseFileName}.${diagramType}.puml`
      );
      
      await generateDiagram(code, diagramType, umlPath, service, model, framework);
      progressBar.increment();
    }

    // マークダウンファイルを生成
    const markdownPath = path.join(
      umlDir,
      `${baseFileName}.md`
    );
    await generateMarkdown(code, markdownPath, service, model, framework);
    progressBar.increment();

    progressBar.stop();
    console.log(`\nドキュメント生成が完了しました: ${markdownPath}`);

  } catch (error) {
    progressBar.stop();
    console.error(`${filePath}の処理中にエラーが発生しました:`, error);
  }
} 