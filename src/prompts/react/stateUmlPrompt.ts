import { baseUmlPrompt } from './umlPromptBase';

export const stateUmlPrompt = `
# Instructions
Output the following input code as a PlantUML state change diagram design document.

${baseUmlPrompt}

# PlantUML仕様

## **基本構文**
状態遷移図の基本的な要素は、以下のように定義します。

\`\`\`plantuml
@startuml
[*] --> State1          # 開始状態
State1 --> State2       # 通常の遷移
State2 --> [*]          # 終了状態
@enduml
\`\`\`

---

## **詳細な文法**

### 1. **状態の定義**
状態名を明示的に定義し、説明を追加できます。
\`\`\`plantuml
@startuml
[*] --> Idle

state Idle {
  [*] --> Waiting
  Waiting --> Processing : Start
  Processing --> Waiting : Pause
  Processing --> [*] : Finish
}
@enduml
\`\`\`

### 2. **条件付き遷移**
特定の条件が満たされた場合のみ状態が変わることを示します。
\`\`\`plantuml
@startuml
[*] --> Login
Login --> LoggedIn : Successful Login
Login --> Error : Failed Login
LoggedIn --> [*]
Error --> Login : Retry
@enduml
\`\`\`

### 3. **並行状態**
複数の状態が並行して進行する場合に使用します。
\`\`\`plantuml
@startuml
[*] --> State1
State1 --> State2

state State2 {
  [*] --> SubState1
  [*] --> SubState2
}
@enduml
\`\`\`

### 4. **内部アクション**
状態が維持されている間の動作やイベントを記述します。
\`\`\`plantuml
@startuml
state "Processing" as P {
  [*] --> SubState
  SubState : on Entry / Initialize
  SubState : on Exit / Cleanup
}
[*] --> P
@enduml
\`\`\`

---

## **高度な機能**

### 1. **ノートを追加**
状態や遷移についての説明を補足できます。
\`\`\`plantuml
@startuml
[*] --> Idle
Idle --> Processing : Start Process
Processing --> [*] : Complete
note right of Idle
  This is the idle state.
end note
@enduml
\`\`\`

### 2. **履歴状態**
履歴状態を使用して、以前の状態を記憶させることができます。
\`\`\`plantuml
@startuml
[*] --> State1
State1 --> State2 : Transition
State2 --> State1 : Back

state State1 {
  [*] --> SubState
  SubState --> [H] : Save history
}
@enduml
\`\`\`

---

## **スタイル調整**
PlantUMLでは色や形を変更して視覚的に強調できます。
\`\`\`plantuml
@startuml
state Idle #lightblue
state Processing #pink
[*] --> Idle
Idle --> Processing : Start
Processing --> [*] : End
@enduml
\`\`\`

---

**Examples are for formatting purposes only. The structure and contents should be modified to fit each code.**

### example

@startuml
[*] --> Lectures_Mount : コンポーネントマウント

state Lectures_Mount {
  [*] --> Initialize : useEffectでのデータ取得
  Initialize --> Fetch_Lectures : 授業データ取得
  Fetch_Lectures --> Set_Lectures : setLecturesでデータ設定
  
  note right of Fetch_Lectures
    非同期処理: getAPI呼び出し
  end note

  Set_Lectures --> Fetch_Timetables : 時間割データ取得
  Fetch_Timetables --> Set_Timetables : setTimetableでデータ設定
  
  note right of Fetch_Timetables
    非同期処理: getAPI呼び出し
  end note
  
  Set_Timetables --> [*]
}

Lectures_Mount --> Lectures_Render : レンダリング処理

state Lectures_Render {
  [*] --> Display : 授業一覧表示
  Display --> Filter_Conditions : 絞り込み条件表示

  Filter_Conditions --> Event_Handler : ボタン操作待機
  note right of Event_Handler
    onClick、onChange イベント処理
  end note

  Event_Handler --> Register_Lecture : 「登録」ボタン押下
  Register_Lecture --> [*] : 登録処理完了

  Event_Handler --> Delete_Lecture : 「削除」ボタン押下
  Delete_Lecture --> [*] : 削除処理完了
}

Lectures_Render --> Lectures_Unmount : アンマウント処理

state Lectures_Unmount {
}
@enduml
`; 