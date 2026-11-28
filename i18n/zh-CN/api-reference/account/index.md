---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: 查看与 API 密钥关联的组织余额和近期执行历史。
---

# Account API {#account-api}

Account 端点均为只读，作用于由 Bearer API 密钥解析出的组织。

| 操作 | 端点 |
|---|---|
| [获取余额](./balance) | `GET /v1/account/balance` |
| [列出执行历史](./history) | `GET /v1/account/history` |

余额和费用值均为精确的十进制字符串。请将其作为十进制数值处理，
不要通过二进制浮点运算进行转换。

执行历史用于查看近期运行情况。长期财务对账
请使用账单记录或导出数据。

历史筛选使用原始 UTC 时间戳。未提供 `request_id` 时，可选的兼容参数 `timezone` 会按 IANA 时区名称进行校验，但不会转换响应中的时间戳；精确 `request_id` 模式会连同其他筛选条件一起忽略它。未知的 `type` 值不会应用任何执行类型筛选；请使用 `multimodal`、`llm` 或 `api` 才能生效。不支持的 `range` 值会回退为 `7d`。

历史记录可能包含已存储的请求参数和模型输出。请相应限制 API 密钥的访问权限，
在将历史响应复制到日志或工单之前，先检查其中是否含有敏感数据。
