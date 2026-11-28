---
i18nSource: 8cb9626a2127cb8d
title: Bắt đầu nhanh
description: Chọn cách dùng SandBase — trên nền tảng, qua API hoặc với Agent của bạn. Tìm Skills và Tools, làm theo các bước và bắt đầu từ repository SDK hoặc CLI.
pageClass: quickstart-page
---

# Bắt đầu nhanh {#quick-start}

## Chọn cách bạn muốn dùng SandBase {#connect}

Đây là **ba cách khởi đầu thay thế cho nhau**, không phải ba bước bạn phải hoàn thành. Hãy dùng cùng một tài khoản và workspace SandBase cho cả ba.

<QuickstartPaths />

Chỉ cần một tác vụ có sẵn? [Khám phá Tools](#use-tools) hoặc [chọn một Skill](#use-skills). Bạn có thể duyệt danh mục công khai và tài liệu trước khi đăng nhập.

### Bắt đầu từ các repository mã nguồn mở {#start-from-the-open-source-repositories}

- **[SandBase — SDK & ví dụ](https://github.com/sandbaseai/sandbase)**: client Python, TypeScript và Go, ví dụ API và các quy trình Agent được lưu trữ. Dùng repository này khi xây dựng ứng dụng của riêng bạn.
- **[SandBase CLI & MCP](https://github.com/sandbaseai/cli)**: cài đặt và kết nối công cụ AI của bạn, hoặc tìm và chạy các khả năng từ terminal. Dùng repository này với Agent bạn đang có.

## Trước khi bắt đầu: đăng nhập {#create-account}

Hãy đăng nhập trước khi dùng Playground, chạy Skill được lưu trữ hoặc tạo API key. Các công cụ miễn phí không cần tài khoản có thể dùng ngay. **Đã đăng nhập? Bỏ qua bước này** và kiểm tra rằng menu tài khoản đang hiển thị đúng workspace bạn muốn dùng.

SandBase dùng GitHub hoặc Google. Không có hình thức đăng ký riêng bằng email và mật khẩu.

1. Mở [Tạo tài khoản / Đăng nhập](https://www.sandbase.ai/login){target="_blank"}.
2. Hoàn tất bước kiểm tra bảo mật, rồi chọn **Sign in with GitHub** hoặc **Sign in with Google**.
3. Chấp thuận quyền truy cập trong cửa sổ của nhà cung cấp.
4. Quay lại trang bạn đang dùng, hoặc mở [Console](https://www.sandbase.ai/console){target="_blank"}.

Lần đăng nhập đầu tiên sẽ tạo tài khoản và một **workspace cá nhân**. Bạn không cần tạo tổ chức trước khi dùng thử SandBase.

Nếu có credit chào mừng, bạn có thể bắt đầu mà không cần thêm phương thức thanh toán. Thẻ **Balance** trên Console Dashboard và trang [Billing](https://www.sandbase.ai/console/billing){target="_blank"} hiển thị số dư hiện tại.

## Trên nền tảng {#use-on-website}

Chọn cách này nếu bạn muốn dùng thử Model, API hoặc Agent trên trình duyệt trước — không cần cài client, không cần viết code.

1. Đăng nhập, rồi mở danh mục:
   - [Model ngôn ngữ](https://www.sandbase.ai/models){target="_blank"}
   - [Model ảnh và video](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Mở trang chi tiết của một model hoặc API và chọn **Playground** nếu có.
3. Nhập các input bắt buộc, chẳng hạn prompt, ảnh, truy vấn tìm kiếm hoặc URL. Kiểm tra giá hiển thị trước khi chạy.
4. Chạy request và xem văn bản, dữ liệu, ảnh, video hoặc trạng thái tác vụ được trả về.

Bạn không cần tạo API key riêng cho Playground trên website. Nếu một khả năng không có Playground, hãy dùng tab **API** của nó và làm theo cách dùng API bên dưới.

## Qua API {#call-api}

Chọn cách này nếu bạn đang thêm một khả năng vào ứng dụng của mình.

1. Dùng lại một key hợp lệ cho workspace bạn muốn dùng, hoặc tạo [API key](/getting-started/api-keys) trong [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} bằng **New key**. Sao chép ngay; key chỉ hiển thị một lần.
2. Lọc danh mục và mở một trang chi tiết:
   - [Model ngôn ngữ](https://www.sandbase.ai/models){target="_blank"} — lọc theo nhà cung cấp, khả năng, context và giá
   - [Model ảnh và video](https://www.sandbase.ai/models/image-video){target="_blank"} — lọc các model đa phương thức như text-to-image, image-to-image, text-to-video và image-to-video
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — lọc tài nguyên API theo nền tảng và nguồn dữ liệu
3. Mở tab **API**, sao chép request mẫu và điền các trường bắt buộc của endpoint đó.
4. Lưu SandBase key trong biến môi trường phía máy chủ và chạy request. Đừng đặt key trong code trình duyệt hoặc repository công khai.
5. Kiểm tra phản hồi. Với tác vụ bất đồng bộ, hãy làm theo ví dụ poll trạng thái của endpoint cho đến khi hoàn tất.

Ví dụ gọi model ngôn ngữ cho **Bash / zsh** (macOS, Linux hoặc Windows với WSL). Thay key giữ chỗ ngay trên máy của bạn. Với môi trường khác, hãy dùng các ví dụ Python, TypeScript hoặc Go trong repository bên dưới; lệnh shell không dùng thay thế được cho PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Bắt đầu từ code: [SandBase SDK & ví dụ trên GitHub](https://github.com/sandbaseai/sandbase).

Tìm hiểu thêm: [Lệnh gọi API đầu tiên](/getting-started/first-call).

## Với Agent của bạn {#use-in-ai-tool}

Chọn cách này nếu bạn dùng Claude Code, Codex, Cursor, Kiro hoặc một client được hỗ trợ khác và muốn có các Model và API của SandBase ngay trong ứng dụng đó.

**Để thiết lập cục bộ tự động:** client của bạn phải chạy được lệnh, và máy của nó cần Node.js 20+ cùng npm. Nếu bạn dùng client chỉ có chat, hãy làm theo [hướng dẫn kết nối riêng cho từng client](/setup/).

1. Mở [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} trong Console.
2. Dán dòng này vào khung chat của trợ lý AI, rồi cho nó biết bạn muốn xây dựng gì. Đây là chỉ dẫn trong chat, không phải lệnh shell:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Chấp thuận yêu cầu đăng nhập trên trình duyệt mà agent mở ra. Bạn không cần dán API key.
4. Bắt đầu session mới hoặc khởi động lại ứng dụng để các công cụ SandBase được tải.
5. Yêu cầu agent tìm và kiểm tra công cụ liên quan, rồi thực hiện một request có giới hạn, nằm trong phạm vi quyền và ngân sách của bạn. Khi phát triển, hãy để agent tích hợp phản hồi vào dự án và cung cấp lệnh chạy cùng kết quả kiểm thử thực tế. Chỉ tìm thấy công cụ thôi chưa chứng minh được một lệnh gọi API nghiệp vụ.

Thích dùng terminal hơn? Chạy `npx -y @sandbaseai/cli@latest connect`. Lệnh này cấu hình các client được hỗ trợ mà nó phát hiện được; để chỉ cấu hình một client, dùng `npx -y @sandbaseai/cli@latest connect --client codex` (thay `codex` bằng client được hỗ trợ của bạn). Sau đó khởi động lại client đó. Hãy kiểm tra workspace được chọn trước khi chạy tác vụ có tính phí.

Ví dụ, bạn có thể yêu cầu:

> Tìm một SandBase API để tìm kiếm các bài đăng X công khai về AI agent. Trước tiên hãy kiểm tra các input bắt buộc và giá của nó, rồi cho tôi biết chi phí của một request trước khi chạy. Giữ các liên kết nguồn gốc trong kết quả.

Mã nguồn và hướng dẫn cài đặt: [SandBase CLI & MCP trên GitHub](https://github.com/sandbaseai/cli).

Tìm hiểu thêm: [Kết nối công cụ AI](/setup/).

### Để trợ lý AI giúp bạn xây dựng {#start-with-your-agent}

[Skill thiết lập](https://www.sandbase.ai/SKILL.md) hướng dẫn agent của bạn theo tình huống hiện tại: chưa có tài khoản, đã có API key, đã kết nối công cụ, đã có dự án hoặc đang làm tính năng mới. Nó kiểm tra input và giá của endpoint, giúp triển khai tích hợp, và phân biệt giữa việc thiết lập, một lệnh gọi đã xác minh và một tính năng chạy được. Hãy cho nó biết mục tiêu và giới hạn chi tiêu của bạn; đừng dán key vào chat.

Đã có key hoặc dự án? Hãy nói rõ điều đó; bạn không cần làm lại từ đầu. Ví dụ: “Tôi có một SandBase key. Thêm tính năng tra cứu lưu lượng Similarweb vào dự án này; hãy kiểm tra API và cho tôi xem chi phí kiểm thử thực tế trước.” Trợ lý không chạy được lệnh hoặc không tải được công cụ cần đến [cách thiết lập riêng cho từng client](/setup/).

[Đưa cho agent của bạn bản Quickstart dạng Markdown](https://www.sandbase.ai/quickstart.md), hoặc làm theo các bước bên dưới. Việc cài Skill thiết lập không tự tạo ra một Agent được lưu trữ.

### Tùy chọn: chạy Agent được lưu trữ trên SandBase {#build-agent}

Chọn cách này nếu công việc có nhiều bước hoặc cần được tái sử dụng.

1. Mở [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} và chọn **Create**.
2. Điền **Overview** và **Instructions**.
3. Chọn một **Model**.
4. Thêm Skills và công cụ MCP trong **Capabilities**, rồi đặt **Runtime**.
5. Chọn **Create & Chat** để kiểm thử trong một Session.
6. Gọi phiên bản đã kiểm thử từ ứng dụng của bạn qua tab **API** của Agent.

Tìm hiểu thêm: [Build Agent](/agents/). Để làm tương tự bằng code với OpenAI SDK chính thức, xem [Tương thích OpenAI](/agents/openai-compatibility).

## Skills, Tools và các cách xây dựng khác {#skills-and-tools}

Hãy chọn tài nguyên phù hợp với tác vụ của bạn. Bạn không cần cài Skill hay tạo Agent được lưu trữ để dùng một API.

- **[Tools](https://www.sandbase.ai/tools):** hoàn thành một tác vụ cụ thể trong giao diện có sẵn, chẳng hạn định dạng văn bản hoặc tra cứu dữ liệu công khai.
- **[Skills](https://www.sandbase.ai/skills):** cung cấp cho agent một quy trình tái sử dụng gồm chỉ dẫn, script và ví dụ.
- **Models & APIs:** gọi một khả năng từ Playground, code của bạn hoặc một agent đã kết nối. Khám phá [model ngôn ngữ](https://www.sandbase.ai/models), [ảnh & video](https://www.sandbase.ai/models/image-video) hoặc [data API](https://www.sandbase.ai/apis).
- **[Agent được lưu trữ](/agents/):** cấu hình và chạy một agent tái sử dụng trên SandBase.
- **[Sandboxes](/sandbox/):** cung cấp cho code một môi trường biệt lập để thực thi và làm việc với tệp.

### Dùng một Tool {#use-tools}

1. Mở [Tools](https://www.sandbase.ai/tools) và chọn tác vụ bạn muốn hoàn thành.
2. Đọc yêu cầu input và nhãn giá hoặc hạn mức của công cụ. Các tiện ích miễn phí có thể dùng không cần tài khoản; công cụ dữ liệu yêu cầu đăng nhập SandBase để chạy, và kiểm thử model có thể yêu cầu key của riêng bạn.
3. Nhập văn bản, URL, tệp hoặc các input được yêu cầu khác, rồi dùng thao tác chạy của công cụ.
4. Xem lại output và dùng thao tác sao chép hoặc tải xuống nếu có. Với công cụ dữ liệu, hãy dùng API được liên kết và request mẫu của nó nếu bạn muốn tự động hóa cùng tác vụ đó.

**Hạn mức miễn phí hằng ngày được dùng chung cho cả workspace**, không phải hạn mức riêng cho từng công cụ. Hãy kiểm tra điều kiện và giá hiển thị trước khi chạy; một tiện ích miễn phí không làm cho lệnh gọi model hay API trở nên miễn phí.

### Dùng một Skill {#use-skills}

1. Mở [Skills](https://www.sandbase.ai/skills), chọn một quy trình và đọc ví dụ, input bắt buộc cùng các phụ thuộc của nó.
2. Chọn một trong các tùy chọn có trên trang chi tiết của Skill đó:
   - **Run online:** đăng nhập và chạy ví dụ được lưu trữ nếu có. Theo dõi tiến độ và mở output hoặc tệp kết quả. Kiểm tra hạn mức hiển thị; tính khả dụng và giới hạn khác nhau tùy Skill.
   - **Install / Download:** đăng nhập để tải gói nếu có. Giải nén toàn bộ gói vào một thư mục làm việc, rồi làm theo hướng dẫn cài đặt hoặc yêu cầu agent cục bộ đọc `SKILL.md` của nó.
3. Khi dùng cục bộ, hãy cung cấp tác vụ, input, output mong muốn và giới hạn chi tiêu. Kết nối SandBase theo [cách dùng với Agent](#use-in-ai-tool); nếu script của Skill cần key, hãy cấu hình key trong môi trường thực thi thay vì dán vào chat.
4. Xem lại kết quả thực tế. Tải Skill về hoặc kết nối agent không có nghĩa là quy trình đã chạy thành công.

**Skill thiết lập** của SandBase kết nối client của bạn; các Skill trong danh mục mô tả từng quy trình riêng. Hãy kiểm tra phụ thuộc và client được hỗ trợ của từng Skill trước khi cài. Các lệnh gọi Model và API mà quy trình cục bộ sử dụng có thể phát sinh phí sử dụng.

Xem [Dùng Skill cục bộ](/guides/skills/local-use) để có hướng dẫn đầy đủ, bao gồm thư mục input và các sản phẩm được lưu.

## Tùy chọn: chia sẻ workspace nhóm {#create-organization}

API key, mức sử dụng và thanh toán thuộc về một tổ chức. Hãy ở lại workspace cá nhân nếu bạn đánh giá một mình. Tạo nhóm khi nhiều người sẽ dùng chung key và chi tiêu.

| Workspace | Khi nào dùng |
|---|---|
| **Cá nhân** | Được tạo tự động ở lần đăng nhập đầu tiên. Mỗi người dùng một workspace. |
| **Nhóm** | Dùng chung thành viên, key và số dư. Hãy tạo cho một công ty hoặc dự án. |

### Tạo nhóm {#create-team}

1. Mở [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"}, hoặc chọn **Create Team** trong menu tài khoản ở góc trên bên phải Console.
2. Nhập **Team name**, rồi chọn **Create team**.
3. Xác nhận menu tài khoản hiện hiển thị nhóm đó là workspace đang hoạt động.
4. Trong **Developer → Team**, chọn **Add member**, nhập **Account email** của một tài khoản SandBase hiện có và chọn **Workspace role** (Member hoặc Admin).

Người được mời phải có sẵn tài khoản SandBase. Nếu chưa có, hãy gửi cho họ [trang này](/getting-started/quickstart) để họ đăng nhập trước, rồi thêm họ vào.

Nếu bạn thuộc nhiều tổ chức, hãy chuyển đổi trong menu tài khoản. Key và thanh toán theo tổ chức **đang hoạt động**. Xem [Tổ chức](/admin/organizations) để biết về các vai trò.

## Xác nhận mọi thứ hoạt động {#confirm-it-works}

Bạn đã sẵn sàng khi tất cả các điều sau đều đúng:

- Menu tài khoản trên Console hiển thị tổ chức bạn muốn dùng.
- Bạn đã hoàn thành một cách: một lệnh gọi API, một lần chạy trên website, một công cụ AI đã kết nối hoặc một Agent.
- Một request thành công.

Nếu request thất bại, hãy kiểm tra tổ chức đang hoạt động, key và [Lỗi](/guides/error-handling). Nạp tiền trong [Billing](https://www.sandbase.ai/console/billing){target="_blank"} khi workspace đã hết số dư.

### Nếu bạn gặp vướng mắc {#if-you-get-stuck}

| Bạn thấy gì | Cần kiểm tra gì |
| --- | --- |
| Yêu cầu đăng nhập | Đăng nhập, quay lại trang ban đầu và kiểm tra workspace đang hoạt động. |
| Key không hợp lệ hoặc bị từ chối truy cập | Xác nhận key thuộc đúng workspace và có quyền truy cập endpoint. Nạp thêm credit không khắc phục được vấn đề quyền. |
| Không đủ số dư hoặc hết hạn mức | Đọc phản hồi: kiểm tra Billing nếu là vấn đề số dư, hoặc thời điểm đặt lại được hiển thị nếu là giới hạn hạn mức. |
| Không có công cụ nào trong Agent | Bắt đầu một session client mới, rồi làm theo phần chẩn đoán trong [Kết nối công cụ AI](/setup/). |
| Tác vụ vẫn đang chạy | Theo dõi trạng thái tác vụ được trả về hoặc chỉ báo tiến độ trên trang. Tránh gửi lặp lại cùng một request có tính phí. |

## Thanh toán và mức sử dụng {#billing-and-usage}

Sau khi đăng nhập, hãy xem chi tiêu của tổ chức đang hoạt động:

<QuickstartResources group="ops" />

## Bước tiếp theo {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — hoàn thành tác vụ trên trình duyệt
- [Skills](https://www.sandbase.ai/skills) — tìm quy trình agent tái sử dụng
- [API key](/getting-started/api-keys) — tạo và xoay vòng key của tổ chức
- [Danh mục Model và API](https://www.sandbase.ai/models) — dùng thử Model, API và Agent trên website
- [Kết nối công cụ AI](/setup/) — đưa danh mục SandBase vào công cụ AI của bạn
- [Build Agent](/agents/) — tạo Agent tái sử dụng
- [API Reference](/api-reference/) — tích hợp bằng code
