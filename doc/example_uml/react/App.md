# コンポーネント設計書

## 1. コンポーネント概要
- **コンポーネント名**: App
- **概要**: 
  - TODOアプリケーションのメインコンポーネントで、チケットの作成、表示、更新、削除を行う。

## 2. Props定義
| 名前 | 型 | 説明 |
|------|-----|------|
| なし | なし | このコンポーネントはPropsを受け取らない。 |

## 3. State定義
| 名前 | 型 | 説明 |
|------|-----|------|
| tickets | TicketData[] | チケットのリスト |
| loading | boolean | データの読み込み中かどうか |
| error | string | エラーメッセージ |
| filterStatus | string | フィルター用のステータス |
| filterPriority | string | フィルター用の優先度 |
| searchTerm | string | 検索用の文字列 |
| isCreating | boolean | チケット作成フォームの表示状態 |
| newTicket | { title: string; description: string; priority: 'low' | 'medium' | 'high'; } | 新しいチケットのデータ |
| selectedTicket | TicketData | 選択されたチケット |
| isDarkMode | boolean | ダークモードの状態 |

## 4. メソッド / 関数
### handleStatusChange
- **概要**: チケットのステータスを更新する。
- **引数**:
  - `id`: number - 更新するチケットのID
  - `status`: 'todo' | 'in-progress' | 'done' - 新しいステータス
- **戻り値**: なし

### handleDelete
- **概要**: チケットを削除する。
- **引数**:
  - `id`: number - 削除するチケットのID
- **戻り値**: なし

### handleCreate
- **概要**: 新しいチケットを作成する。
- **引数**: なし
- **戻り値**: なし

### toggleDarkMode
- **概要**: ダークモードの状態を切り替える。
- **引数**: なし
- **戻り値**: なし

## 5. ライフサイクル / フック
- **useEffect**:
  - **目的**: コンポーネントのマウント時にチケットをAPIから取得する。
  - **依存配列**: []

## 6. イベントハンドラ
| イベント名 | ハンドラ名 | 説明 |
|------------|------------|------|
| onClick | handleClick | クリック時の処理 |
| onChange | handleChange | 変更時の処理 |
| onClick | handleCreate | チケット作成ボタンのクリック時の処理 |
| onClick | handleDelete | チケット削除ボタンのクリック時の処理 |
| onClick | toggleDarkMode | ダークモード切り替えボタンのクリック時の処理 |

## 7. レンダリング
初期処理について詳細に記述します。
1. useEffect内でAPIリクエストを送信し、チケットを取得する。
2. レスポンスが成功した場合、取得したデータをstateに保存。
3. もしレスポンスが失敗した場合、エラーメッセージを表示。
4. フィルターや検索機能を使用して表示するチケットを絞り込む。
5. チケット一覧を表示し、選択されたチケットの詳細をモーダルで表示。

## 8. 使用ライブラリ / モジュール
- **axios**: APIリクエストを送信するために使用。
- **./services/api**: チケットのCRUD操作を行うためのAPIサービス。