# 付録: データ項目一覧

全機能の主要フィールドを一覧化。実装時の型定義・Firestore 設計の参照用。

---

## 名簿（members）

| フィールド | 型 | 必須 | 備考 |
|-----------|-----|------|------|
| name | string | ○ | 氏名 |
| nameKana | string | | ふりがな |
| grade | enum | ○ | 中1〜高3 |
| gender | enum | ○ | 男子/女子 |
| division | enum | | 中学部/高校部 |
| primaryEvents | string[] | ○ | 主種目 |
| secondaryEvents | string[] | | 副種目 |
| role | string | | 役職 |
| joinedAt | date | | 入部年月 |
| graduationYear | number | | 卒部予定 |
| contact | string | | 管理者のみ |
| status | enum | ○ | 在籍/休部/卒部 |
| memo | string | | 管理者のみ |

---

## 自己ベスト（personalBests）

| フィールド | 型 | 必須 | 備考 |
|-----------|-----|------|------|
| memberId | ref | ○ | |
| event | string | ○ | 種目マスタ |
| record | number | ○ | 秒 or m |
| measuredAt | date | ○ | |
| location | string | | 練習/大会名 |
| windSpeed | number | | m/s |
| isOfficial | boolean | ○ | |
| note | string | | |
| updatedBy | ref | | |

---

## 大会（competitions）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| name | string | ○ |
| startDate | date | ○ |
| endDate | date | |
| venue | string | |
| type | enum | ○ |
| entryDeadline | date | |
| note | string | |

## エントリー（competitionEntries）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| memberId | ref | ○ |
| competitionId | ref | ○ |
| events | string[] | ○ |
| entryRecord | number | |
| status | enum | ○ |
| resultRank | number | |
| resultRecord | number | |
| resultWind | number | |
| note | string | |

---

## 休み（absences）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| memberId | ref | ○ |
| date | date | ○ |
| endDate | date | |
| type | enum | ○ |
| reason | string | |
| status | enum | ○ |
| approvedBy | ref | |
| practiceImpact | enum | |

---

## 練習メニュー（trainingMenus）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| date | date | ○ |
| block | enum | ○ |
| eventTags | string[] | |
| gradeTags | string[] | |
| genderTags | string[] | |
| memberIds | ref[] | |
| title | string | ○ |
| createdBy | ref | ○ |
| location | string | |
| duration | string | |
| note | string | |
| templateId | ref | |
| items | array | ○ |

### items（内容行）

| フィールド | 型 |
|-----------|-----|
| order | number |
| content | string |
| amount | string |
| intensity | string |
| rest | string |
| note | string |

---

## スケジュール

### 週間基本（weeklySchedules）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| location | enum | ○ |
| daysOfWeek | number[] | ○ |
| description | string | |
| validFrom | date | ○ |
| validTo | date | |
| isPublic | boolean | ○ |

### 単発イベント（scheduleEvents）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| date | date | ○ |
| endDate | date | |
| type | enum | ○ |
| title | string | ○ |
| venue | string | |
| target | string | |
| note | string | |
| isPublic | boolean | |

---

## 体調（healthReports）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| memberId | ref | ○ |
| reportedAt | date | ○ |
| bodyPart | string | ○ |
| painLevel | number | ○ |
| startedAt | date | |
| trigger | string | |
| painTiming | string | |
| swelling | boolean | |
| todayPractice | enum | ○ |
| comment | string | |
| adminResponse | string | |
| practiceRestriction | string | |
| referralRecommended | boolean | |
| parentContacted | enum | |
| status | enum | ○ |
| nextCheckDate | date | |

---

## ユーザー（users）

| フィールド | 型 | 必須 |
|-----------|-----|------|
| uid | string | ○ | Firebase Auth |
| role | enum | ○ | teacher/manager/captain/member |
| memberId | ref | | 部員と紐づけ |
| displayName | string | |
