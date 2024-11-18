import { baseUmlPrompt } from './umlPromptBase';

export const sequenceUmlPrompt = `
# Instructions
Output the following input code as a PlantUML sequence diagram design document.

${baseUmlPrompt}

# PlantUML仕様

### 基本構文
\`\`\`plantuml
@startuml
actor User       # アクター（外部ユーザー）
participant App  # コンポーネントやシステム
User -> App : Message  # 呼び出し（矢印とメッセージ）

App --> User : Response  # 応答（点線の矢印）

User -> App : Request
activate App             # アクティブ状態（ハイライト）
App -> Database : Query
return Result            # 戻り値
deactivate App           # アクティブ終了
@enduml
\`\`\`

---

### 拡張構文

#### 1. **オプションや条件分岐**
- 条件や分岐を表現する際に使用します。
\`\`\`plantuml
@startuml
User -> App : Login
alt Success
  App -> Dashboard : Load
else Failure
  App -> ErrorPage : Show
end
@enduml
\`\`\`

#### 2. **ループ**
- 繰り返し処理を表現します。
\`\`\`plantuml
@startuml
User -> App : Fetch items
loop For each item
  App -> ItemService : Process item
end
@enduml
\`\`\`

#### 3. **並行処理**
- 並行して実行される操作を記述します。
\`\`\`plantuml
@startuml
User -> App : Start Process
par Task 1
  App -> Service1 : Do work
else Task 2
  App -> Service2 : Do other work
end
@enduml
\`\`\`

---

### 高度な機能

#### 1. **ノートを追加**
- コンポーネントやフローの説明を補足できます。
\`\`\`plantuml
@startuml
User -> App : Start process
note right of App
  This is a note explaining the process.
end note
@enduml
\`\`\`

#### 2. **グループ化**
- 処理を論理的にグループ分けできます。
\`\`\`plantuml
@startuml
User -> App : Start
group Initialization
  App -> Service : Setup
end
App -> User : Done
@enduml
\`\`\`

#### 3. **破棄**
- オブジェクトのライフサイクルを示します。
\`\`\`plantuml
@startuml
participant App
User -> App : Start process
destroy App
@enduml
\`\`\`

---

### スタイル調整

#### 1. **ライフラインの表示調整**
\`\`\`plantuml
@startuml
participant User
participant App
User -> App : Call
User --x App : End Communication
@enduml
\`\`\`

#### 2. **要素の色付け**
- 読みやすさや強調を向上させます。
\`\`\`plantuml
@startuml
actor User #green
participant App #lightblue
User -> App : Start
@enduml
\`\`\`

---

**Examples are for formatting purposes only. The structure and contents should be modified to fit each code.**

### example


@startuml
actor ユーザー
participant Lectures as "授業一覧コンポーネント"
participant API as "API"

== コンポーネントのマウント ==
ユーザー -> Lectures : コンポーネントを表示
activate Lectures
Lectures -> API : 授業データ取得 (getAPI)
API --> Lectures : 授業データ (ResponseGetLecture[])
Lectures -> Lectures : setLectures()
Lectures -> API : 時間割データ取得 (getAPI)
API --> Lectures : 時間割データ (ResponseGetTimeTable[])
Lectures -> Lectures : setTimetable()
deactivate Lectures
note right of Lectures : 初期化処理が完了

== コンポーネントの表示 ==
ユーザー -> Lectures : 授業一覧を表示

== ユーザーイベント: 登録/削除ボタン押下 ==
ユーザー -> Lectures : 登録ボタンを押下
activate Lectures
Lectures -> API : 授業登録 (postAPI)
note right of Lectures : handleClickRegister()が呼び出される
deactivate Lectures

ユーザー -> Lectures : 削除ボタンを押下
activate Lectures
Lectures -> API : 授業削除 (deleteAPI)
note right of Lectures : handleClickDelete()が呼び出される
deactivate Lectures

== コンポーネントのアンマウント ==
ユーザー -> Lectures : コンポーネントを閉じる
activate Lectures
deactivate Lectures
@enduml
`; 