import { baseUmlPrompt } from './umlPromptBase';

export const activityUmlPrompt = `
# Instructions
Output the following input code as a PlantUML activity diagram design document.
**Frame event handlers with an event handler frame.**

${baseUmlPrompt}

# PlantUML仕様

### **基本構文**
#### 1. **開始と終了**
- 開始ノード:  
  \`\`\`
  start
  \`\`\`
- 終了ノード:  
  \`\`\`
  stop
  \`\`\`
  または、  
  \`\`\`
  end
  \`\`\`

#### 2. **アクティビティ（処理）**
- 表示:  
  \`\`\`
  :アクティビティ名;
  \`\`\`

#### 3. **矢印（遷移）**
- 次のアクティビティへの遷移:  
  \`\`\`
  :処理1; --> :処理2;
  \`\`\`

#### 4. **条件分岐**
- 分岐ノード:  
  \`\`\`
  if (条件) then (true)
    :処理1;
  else (false)
    :処理2;
  endif
  \`\`\`

#### 5. **繰り返し**
- 繰り返し処理:  
  \`\`\`
  while (条件)
    :処理;
  endwhile
  \`\`\`

#### 6. **合流（マージノード）**
- 複数のフローを1つに統合:  
  \`\`\`
  :処理1; --> merge --> :処理2;
  \`\`\`

#### 7. **並行処理**
- フォークと合流:
  \`\`\`
  fork
    :処理1;
    :処理2;
  end fork
  \`\`\`

---

### **拡張構文**
#### 1. **スイムレーン**
- スイムレーンで担当者を分ける:  
  \`\`\`
  |スイムレーン名|
  :処理;
  \`\`\`

#### 2. **ノート（注釈）**
- ノートの追加:  
  \`\`\`
  note left
    注釈内容
  end note
  \`\`\`

#### 3. **グループ化**
- 処理をグループ化して説明:  
  \`\`\`
  group グループ名
    :処理1;
    :処理2;
  end group
  \`\`\`

#### 4. **データストア**
- データストアの定義:  
  \`\`\`
  :データを保存する;
  \`\`\`

---

**Examples are for formatting purposes only. The structure and contents should be modified to fit each code.**

### example

@startuml
|UserTimetable|
start
:コンポーネントマウント;
:useEffectを使用してAPIから時間割データを取得;
:API呼び出し (非同期);
:データ取得完了;
:時間割データをセット;

group 時間割データの整形
  :sortTimeTable関数を呼び出す;
  while (tableの各アイテムに対して)
    :アイテムを処理;
    if (item.time === i && item.period === selectedPeriod) then (true)
      :曜日に応じて値を割り当てる;
      switch (item.day_of_week)
        case (CONSTANT.DAY_OF_WEEk.MONDAY.value)
          :forDisplayArray[i - 1].monday = item;
        case (CONSTANT.DAY_OF_WEEk.TUESDAY.value)
          :forDisplayArray[i - 1].tuesday = item;
        case (CONSTANT.DAY_OF_WEEk.WEDNESDAY.value)
          :forDisplayArray[i - 1].wednesday = item;
        case (CONSTANT.DAY_OF_WEEk.THURSDAY.value)
          :forDisplayArray[i - 1].thursday = item;
        case (CONSTANT.DAY_OF_WEEk.FRIDAY.value)
          :forDisplayArray[i - 1].friday = item;
      endswitch
    endif
  endwhile
end group

:合計単位数を計算するためにsumCreditCountを呼び出す;

:時間割を表示;

group イベントハンドラ
  :onChangeイベントを処理;
  :selectedPeriodを更新;

  while (各曜日の授業コマに対して)
    :onClickイベントを処理;
    :handleClickLectureを呼び出す;
    :フィルター条件を設定;
    :授業一覧画面に遷移;
  endwhile
end group

:コンポーネントの再レンダリング;
stop
@enduml
`; 