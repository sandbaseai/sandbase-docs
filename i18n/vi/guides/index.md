---
i18nSource: c922bd433deabf32
title: Hướng dẫn
description: Hướng dẫn thực tế để dùng SandBase Models, APIs, Agents, Setup, thanh toán, streaming và độ tin cậy trong production.
---

# Hướng dẫn {#guides}

Các hướng dẫn này trình bày những cách dùng SandBase phổ biến trong môi trường production.

## Gọi model {#call-models}
| Hướng dẫn | Mô tả |
|-------|-------------|
| [Chat Completions](./chat-completions) | Gọi SandBase qua giao thức chat tương thích OpenAI |
| [OpenAI Responses](./openai-responses) | Gọi model GPT qua giao thức Responses tương thích OpenAI |
| [Anthropic Messages](./anthropic-messages) | Gọi SandBase qua giao thức messages tương thích Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | Gọi SandBase qua giao thức GenerateContent tương thích Google Gemini |
| [Ảnh và video](./image-video) | Tạo ảnh và video qua Run API bất đồng bộ dùng chung |
| [Streaming](./streaming) | Stream đầu ra của model tương thích tới ứng dụng của bạn |
| [Danh mục API](https://www.sandbase.ai/apis) | Duyệt các tính năng API và endpoint theo từng nhà cung cấp |

## Chạy trong production {#run-in-production}
| Hướng dẫn | Mô tả |
|-------|-------------|
| [Lỗi và thử lại](./error-handling) | Phân loại lỗi và chỉ thử lại khi thao tác có thể lặp lại an toàn |
| [Giới hạn tốc độ](./rate-limiting) | Xử lý response 429 và làm mượt các đợt request dồn dập |
| [Giới hạn đồng thời](./concurrency-limits) | Số tác vụ tổ chức của bạn có thể chạy cùng lúc |
| [Giá và mức sử dụng](./billing) | Hiểu về credit, mức sử dụng và kiểm soát chi phí |

## Mẹo nhanh {#quick-tips}

- Dùng [Setup](/setup/) khi người dùng muốn có tool trong Codex, Claude, Cursor hoặc Kiro.
- Dùng [Models](https://www.sandbase.ai/models) hoặc [APIs](https://www.sandbase.ai/apis) khi ứng dụng của bạn cần một tính năng.
- Dùng [Build Agent](/agents/) khi công việc có nhiều bước hoặc cần được tái sử dụng.
- Dùng [Activities](https://www.sandbase.ai/console/activities) trong Console để xem request và mức sử dụng cùng nhau.
