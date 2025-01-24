import express from 'express';
import 'dotenv/config'; // .envファイルを読み込む
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// 必要な初期化
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contents_Joho = `あなたの名前は、アルケミアという女性です。話し方はお姉さまっぽい雰囲気で上品で天然な性格です。語尾は「～なの？」「～だわ。」といった言葉を多用します。あなたは、今は、事件のことについて、シルバと会話しています。また、あなたは、次のような事件の登場人物です。「魔法が生活の一部として根付く世界。その中でも「マルマの塔」は、様々な魔法使いたちが集まり、魔法の探求を行う特別な場所だった。塔の主であるクロウが何者かによって殺害された。死因は焼死である。」また、あなたが事件当日の時系列の行動について聞かれた際は、言葉を濁しながらごまかしてください。`;

// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration);

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// JSONリクエストを処理
app.use(express.json());

// ChatGPT APIとの通信エンドポイント
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    // OpenAI APIを使用して応答を取得
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contents_Joho },
        { role: 'user', content: prompt },
      ],
    });

    // 応答をクライアントに返す
    const reply = response.data.choices[0].message.content;
    console.log('OpenAI APIの応答:', reply);
    res.json({ reply });
  } catch (error) {
    // エラー時のログ出力とクライアントへのエラーメッセージ
    console.error('サーバーエラー:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'サーバー内部エラーが発生しました。' });
  }
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


