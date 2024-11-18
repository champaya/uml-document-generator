import OpenAI from 'openai';
import dotenv from 'dotenv';

// 環境変数の読み込みを先に実行
dotenv.config();

// クライアントの初期化は環境変数読み込み後に行う
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

/**
 * コードからUMLを生成します。
 * 
 * @param code - 変換したいTypeScriptコード
 * @param promptTemplate - プロンプトテンプレート
 * @param markdownFlg - マークダウン形式で出力するかどうかのフラグ
 * @param model - 使用するOpenAIモデル
 * @returns 生成されたUMLまたはマークダウン文書
 */
export async function generateUmlFromCode(
  code: string,
  promptTemplate: string,
  markdownFlg: boolean,
  model: string = "gpt-4o-mini"
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

    const response = await client.chat.completions.create({
      model: model,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error(error);
    throw new Error('OpenAI APIでエラーが発生しました');
  }
} 