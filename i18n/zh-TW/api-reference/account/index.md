---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: 檢視與 API 金鑰關聯之組織的餘額與近期執行紀錄。
---

# Account API {#account-api}

Account 端點為唯讀，作用對象是由 Bearer API 金鑰解析出的組織。

| 操作 | 端點 |
|---|---|
| [取得餘額](./balance) | `GET /v1/account/balance` |
| [列出執行紀錄](./history) | `GET /v1/account/history` |

餘額與費用值皆為精確的十進位字串。請將它們保留為十進位數值，
不要透過二進位浮點運算轉換。

執行紀錄用於檢視近期的營運狀況。若要進行長期的財務對帳，
請使用帳單紀錄或匯出資料。

紀錄篩選使用原始的 UTC 時間戳記。未提供 `request_id` 時，選用的相容性參數 `timezone` 會依 IANA 時區名稱驗證，但不會轉換回應中的時間戳記；精確的 `request_id` 模式會連同其他篩選條件一併忽略它。未知的 `type` 值不會套用任何執行類型篩選；請使用 `multimodal`、`llm` 或 `api` 才能有效篩選。不支援的 `range` 值會改用 `7d`。

紀錄項目可能包含已儲存的請求參數與模型輸出。請據此限制 API 金鑰的存取權限，
未檢查是否含有敏感資料前，請勿將紀錄回應複製到日誌或支援工單中。
