import Anthropic from '@anthropic-ai/sdk';
import { TextBlock } from '@anthropic-ai/sdk/resources';
import dotenv from 'dotenv';

// 環境変数の読み込みを先に実行
dotenv.config();

// クライアントの初期化は環境変数読み込み後に行う
const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

/**
 * Claudeを使用してコードからUMLを生成します。
 * 
 * @param code - 変換したいTypeScriptコード
 * @param promptTemplate - プロンプトテンプレート
 * @param markdownFlg - マークダウン形式で出力するかどうかのフラグ
 * @param model - 使用するClaudeモデル
 * @returns 生成されたUMLまたはマークダウン文書
 */
export async function generateUmlFromCodeClaude(
  code: string,
  promptTemplate: string,
  markdownFlg: boolean,
  model: string = 'claude-3-5-sonnet-20241022'
): Promise<string> {
  try {
    const prompt = promptTemplate.replace('{{CODE}}', code);

    // システムプロンプトを切り替える
    const markdownPrompt = `あなたはmarkdownでドキュメントを書くことが得意なエンジニアです。
TypeScriptとReactとmarkdownの文法に精通しています。`;
    const umlPrompt = `あなたはTypeScriptコードをPlantUMLの図に変換するエンジニアです。
TypeScriptとReactとPlantUMLの文法に精通しています。
関数型プログラミングの思想を理解しています。`;

    const systemPrompt = markdownFlg ? markdownPrompt : umlPrompt;

    const response = await client.messages.create({
      model: model,
      temperature: 0,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: [{type: "text" ,text: prompt }] }]
    });

    return (response.content[0] as TextBlock).text;
  } catch (error) {
    console.error(error);
    throw new Error('Claude APIでエラーが発生しました');
  }
} 