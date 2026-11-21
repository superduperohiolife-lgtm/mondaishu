# mondaishu

中学2年 定期テスト用の問題集アプリの画面（GitHub Pages）

- 画面：`docs/`（静的HTMLのみ）
- データ・答え・写真：Google Apps Script（Web App）＋スプレッドシート側に置く。このリポジトリには入れない
- 使うには合言葉が必要（初回だけ入力し、その端末に保存）

| ページ | 用途 |
|---|---|
| `index.html` | PC：問題用紙・答え合わせ・復習・進み具合 |
| `upload.html` | スマホ：○×をつけた解答用紙の写真を送る |

## デプロイ

`main` に push すると GitHub Actions（`.github/workflows/pages.yml`）が `docs/` を Pages に公開する
