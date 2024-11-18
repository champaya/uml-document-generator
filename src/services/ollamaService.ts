import ollama from 'ollama';

/**
 * コードからUMLを生成します（OLLamaを使用）。
 * 
 * @param code - 変換したいTypeScriptコード
 * @param promptTemplate - プロンプトテンプレート
 * @param markdownFlg - マークダウン形式で出力するかどうかのフラグ
 * @param model - 使用するOLLamaモデル
 * @returns 生成されたUMLまたはマークダウン文書
 */
export async function generateUmlFromCodeOllama(
  code: string,
  promptTemplate: string,
  markdownFlg: boolean,
  model: string = "llama3.1"
): Promise<string> {
  try {
    const prompt = promptTemplate.replace('{{CODE}}', code);

    const systemPrompt = markdownFlg
      ? `あなたはmarkdownでドキュメントを書くことが得意なエンジニアです。TypeScriptとReactとmarkdownの文法に精通しています。`
      : `あなたはTypeScriptコードをPlantUMLの図に変換するエンジニアです。TypeScriptとReactとPlantUMLの文法に精通しています。関数型プログラミングの思想を理解しています。`;

    const response = await ollama.chat({
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.message.content || '';
  } catch (error) {
    console.error(error);
    throw new Error('OLLama APIでエラーが発生しました');
  }
} 