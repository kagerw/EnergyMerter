# やる気メーター

毎日の気力を記録して、自分の調子を把握するアプリです。

## 機能

- 日次の気力レベルを9つの質問で測定
- 起床時間の記録
- 履歴とスコア統計の表示
- ユーザー認証機能

## 技術スタック

- **フロントエンド**: React + Vite
- **UI**: TailwindCSS + Lucide React
- **バックエンド**: Supabase
- **デプロイ**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Supabaseデータベースのセットアップ

`database/schema.sql`のSQLを実行してテーブルを作成してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

## デプロイ

### Vercelへのデプロイ

1. Vercelアカウントでリポジトリを接続
2. 環境変数をVercelの設定に追加
3. 自動デプロイが実行されます

## データベース構造

- `users`: ユーザー情報
- `questions`: 質問マスター
- `daily_records`: 日次記録
- `answers`: 質問への回答

詳細は`database/schema.sql`を参照してください。

## ライセンス

MIT License
