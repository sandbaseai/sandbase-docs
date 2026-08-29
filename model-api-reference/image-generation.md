---
title: Image Generation
description: Browse SandBase Image Generation APIs by provider and open a model page for its exact request format.
---

# Image Generation

Browse enabled image generation models by provider in the left navigation. Open an entry for its exact model identifier, supported capabilities, and a working request.

Image Generation models use the SandBase generation protocol declared in each model registry file. Most are asynchronous: submit a request, receive an opaque run ID, then poll `GET /v1/run/{id}` until the generation is completed, failed, or timed out. Check the selected model page's execution mode because synchronous models return their result in the initial response.

## Providers

### OpenAI

- [GPT Image 2 Official API](/model-api-reference/image-generation/openai/gpt-image-2-official) — GPT Image 2 through the OpenAI Images API contract.
- [GPT Image 2 Official Edit API](/model-api-reference/image-generation/openai/gpt-image-2-official/edit) — GPT Image 2 editing through the OpenAI Images API contract.
- [GPT Image 2](/model-api-reference/image-generation/openai/gpt-image-2) — GPT Image 2, OpenAI's available image model, is capable of making fine-grained, detailed edits to images.
- [GPT Image 2 Editing](/model-api-reference/image-generation/openai/gpt-image-2/edit) — GPT Image 2 Editing supports image editing and multi-image synthesis with high-quality results.
- [GPT-Image 1.5](/model-api-reference/image-generation/openai/gpt-image-1.5/edit) — Gpt Image 1.5 Edit by OpenAI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [GPT Image 1.5](/model-api-reference/image-generation/openai/gpt-image-1.5) — Gpt Image 1.5 is OpenAI's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [GPT Image 1 Mini Edit](/model-api-reference/image-generation/openai/gpt-image-1-mini/edit) — Gpt Image 1 Mini Edit is OpenAI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [GPT Image 1 Mini](/model-api-reference/image-generation/openai/gpt-image-1-mini) — Gpt Image 1 Mini by OpenAI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [GPT Image 1](/model-api-reference/image-generation/openai/gpt-image-1) — Gpt Image 1 is OpenAI's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [GPT Image 1 Edit](/model-api-reference/image-generation/openai/gpt-image-1/edit) — Gpt Image 1 Edit by OpenAI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### Google

- [Nano Banana 2 Lite](/model-api-reference/image-generation/google/nano-banana-2-lite) — Nano Banana 2 Lite by Google - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Nano Banana Lite](/model-api-reference/image-generation/google/nano-banana-lite) — Nano Banana Lite by Google - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Nano Banana Lite Edit](/model-api-reference/image-generation/google/nano-banana-lite/edit) — Nano Banana Lite Edit is Google's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Nano Banana 2 Image Editing](/model-api-reference/image-generation/google/nano-banana-2/edit) — Nano Banana 2 is Google's new state-of-the-art image generation and editing model
- [Nano Banana 2](/model-api-reference/image-generation/google/nano-banana-2) — Nano Banana 2 is Google's new state-of-the-art fast image generation and editing model
- [Gemini 3.1 Flash Image Preview](/model-api-reference/image-generation/google/gemini-3.1-flash-image-preview/edit) — Gemini 3.1 Flash Image Preview Edit is Google's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Nano Banana Pro Image Editing](/model-api-reference/image-generation/google/nano-banana-pro/edit) — Nano Banana Pro is Google's new state-of-the-art image generation and editing model
- [Nano Banana Pro](/model-api-reference/image-generation/google/nano-banana-pro) — Nano Banana Pro is Google's new state-of-the-art image generation and editing model
- [Gemini 2.5 Flash Image Edit](/model-api-reference/image-generation/google/gemini-2.5-flash-image/edit) — Gemini 2.5 Flash Image Edit is Google's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Nano Banana Image Editing](/model-api-reference/image-generation/google/nano-banana/edit) — Nano Banana Pro is Google's new state-of-the-art image generation and editing model
- [Nano Banana](/model-api-reference/image-generation/google/nano-banana) — Google's famous original image generation and editing model.
- [Imagen 4 (Google: imagen-4 / preview / fast)](/model-api-reference/image-generation/google/imagen-4/preview/fast) — Imagen 4 Preview Fast is Google's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- …and 4 more models in the sidebar.

### Ideogram

- [Ideogram Object Removal](/model-api-reference/image-generation/ideogram/object-removal) — Object Removal by Ideogram - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [V4.0q [instant]](/model-api-reference/image-generation/ideogram/4.0/instant) — 4.0 Instant is Ideogram's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [V4.0q [fast]](/model-api-reference/image-generation/ideogram/4.0/fast) — 4.0 Fast by Ideogram - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Ideogram V4.0q Tiling](/model-api-reference/image-generation/ideogram/4.0/tiling) — 4.0 Tiling by Ideogram - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Ideogram V4.0q Image to Image](/model-api-reference/image-generation/ideogram/4.0/image-to-image) — 4.0 by Ideogram - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Ideogram (Ideogram: custom-models)](/model-api-reference/image-generation/ideogram/custom-models) — Custom Models by Ideogram - advanced AI model for training. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### Bytedance

- [Seedream 5.0 Pro Image Editing](/model-api-reference/image-generation/bytedance/seedream/5.0/pro/edit) — Seedream 5.0 Pro is Bytedance's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Seedream 5.0 Pro Text to Image](/model-api-reference/image-generation/bytedance/seedream/5.0/pro) — Seedream 5.0 Pro by Bytedance - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [SeedVR2 (Bytedance: seedvr / upscale / image / seamless)](/model-api-reference/image-generation/bytedance/seedvr/upscale/image/seamless) — Seedvr Upscale Image is Bytedance's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Bytedance Seed 2.0 Mini](/model-api-reference/image-generation/bytedance/seed/v2/mini) — Seed V2 Mini by Bytedance - advanced AI model for llm. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Seedream v5.0 Lite](/model-api-reference/image-generation/bytedance/seedream/5.0/lite) — Seedream 5.0 Lite — Fast Text-to-Image API The lightweight version of Seedream 5.0, delivering high-quality, low-latency AI image generation from text prompts. Ideal for real-time creative tools, e-commerce visuals, and high-volume AIGC pipelines.
- [Seedream v4.5](/model-api-reference/image-generation/bytedance/seedream/4.5) — A new-generation image creation model from ByteDance, Seedream 4.5 integrates text-to-image generation and image editing into a single unified architecture, delivering high-fidelity visuals, precise prompt control, and seamless creative workflows for professional AIGC applications.
- [Seedream v4.5 Image Editing](/model-api-reference/image-generation/bytedance/seedream/4.5/edit) — A new-generation image creation model from ByteDance, Seedream 4.5 integrates text-to-image generation and image editing into a single unified architecture, delivering high-fidelity visuals, precise prompt control, and seamless creative workflows for professional AIGC applications.
- [SeedVR2 (Bytedance: seedvr / upscale / video)](/model-api-reference/image-generation/bytedance/seedvr/upscale/video) — Seedvr Upscale Video by Bytedance - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [SeedVR2 (Bytedance: seedvr / upscale / image)](/model-api-reference/image-generation/bytedance/seedvr/upscale/image) — Seedvr Upscale Image by Bytedance - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Bytedance Seedream v4 Edit](/model-api-reference/image-generation/bytedance/seedream/4.0/edit) — Seedream 4.0 Edit is Bytedance's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Bytedance Seedream v4](/model-api-reference/image-generation/bytedance/seedream/4.0) — Seedream 4.0 by Bytedance - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Dreamina 3.1](/model-api-reference/image-generation/bytedance/dreamina/3.1) — Dreamina 3.1 by Bytedance - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- …and 1 more models in the sidebar.

### Recraft

- [Recraft V4.1 Utility](/model-api-reference/image-generation/recraft/recraft/v4.1/utility) — Recraft V4.1 Utility by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Recraft V4.1 Utility Pro](/model-api-reference/image-generation/recraft/recraft/v4.1/utility/pro) — Recraft V4.1 Utility by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Recraft V4.1 Vector](/model-api-reference/image-generation/recraft/recraft/v4.1/vector) — Recraft V4.1 Vector is Recraft's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Recraft V4.1](/model-api-reference/image-generation/recraft/recraft/v4.1) — Recraft V4.1 by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Recraft V4.1 Pro Vector](/model-api-reference/image-generation/recraft/recraft/v4.1/pro/vector) — Recraft V4.1 Pro is Recraft's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Recraft V4.1 Pro](/model-api-reference/image-generation/recraft/recraft/v4.1/pro) — Recraft V4.1 Pro by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Recraft V4 Pro (Vector)](/model-api-reference/image-generation/recraft/recraft/v4/pro/vector) — Recraft V4 Pro is Recraft's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Recraft V4 (Vector)](/model-api-reference/image-generation/recraft/recraft/v4/vector) — Recraft V4 Vector is Recraft's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Recraft V4 Pro](/model-api-reference/image-generation/recraft/recraft/v4/pro) — Recraft V4 Pro by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Recraft V4](/model-api-reference/image-generation/recraft/recraft/v4) — Recraft V4 by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Recraft Vectorize](/model-api-reference/image-generation/recraft/recraft/vectorize) — Recraft Vectorize is Recraft's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Recraft Creative Upscale](/model-api-reference/image-generation/recraft/recraft/upscale/creative) — Recraft Upscale Creative by Recraft - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- …and 5 more models in the sidebar.

### Luma

- [Luma Uni-1 Edit](/model-api-reference/image-generation/luma/agent/uni-1/1.0/edit) — Agent Uni 1 1.0 by Luma - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Luma Uni-1 Text to Image Max](/model-api-reference/image-generation/luma/agent/uni-1/1.0/max) — Agent Uni 1 1.0 is Luma's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Luma Uni-1 Edit Max](/model-api-reference/image-generation/luma/agent/uni-1/1.0/max/edit) — Agent Uni 1 1.0 by Luma - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Luma Uni-1 Text to Image](/model-api-reference/image-generation/luma/agent/uni-1/1.0/text-to-image) — Agent Uni 1 1.0 is Luma's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Luma Photon Flash Edit](/model-api-reference/image-generation/luma/photon-flash-1/edit) — Photon Flash 1 Edit is Luma's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Luma Photon Edit](/model-api-reference/image-generation/luma/photon-1/edit) — Photon 1 Edit is Luma's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Luma Photon Flash Reframe](/model-api-reference/image-generation/luma/photon-flash-1/reframe) — Photon Flash 1 Reframe by Luma - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Luma Photon Reframe](/model-api-reference/image-generation/luma/photon-1/reframe) — Photon 1 Reframe by Luma - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Luma Photon Flash](/model-api-reference/image-generation/luma/photon-flash-1) — Photon Flash 1 by Luma - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Luma Photon](/model-api-reference/image-generation/luma/photon-1) — Photon 1 by Luma - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.

### Z-Image

- [Z-Image Turbo (Z-Image: turbo)](/model-api-reference/image-generation/z-image/turbo) — Turbo is Z-Image's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.

### Alibaba

- [Qwen Image 3](/model-api-reference/image-generation/alibaba/qwen-image-3) — Qwen Image 3 by Alibaba - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Qwen Image 3 Edit](/model-api-reference/image-generation/alibaba/qwen-image-3/edit) — Alibaba Qwen Image 3 image editing model with support for up to three reference images.
- [Qwen Image 3 Text to Image](/model-api-reference/image-generation/alibaba/qwen-image-3/text-to-image) — Qwen Image 3 by Alibaba - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Wan 2.7 Pro Edit](/model-api-reference/image-generation/alibaba/wan/2.7/pro/edit) — Alibaba Wan 2.7 Pro image editing model with multi-reference support and configurable output format.
- [Wan 2.7 Edit](/model-api-reference/image-generation/alibaba/wan/2.7/edit) — Alibaba Wan 2.7 image editing model with multi-reference support and configurable output format.
- [Wan 2.7](/model-api-reference/image-generation/alibaba/wan/2.7) — Alibaba Wan 2.7 text-to-image model with high-quality generation and configurable output format.
- [Wan 2.7 Pro](/model-api-reference/image-generation/alibaba/wan/2.7/pro) — Alibaba Wan 2.7 Pro text-to-image model with enhanced quality and configurable output format.
- [Z-Image Turbo Seamless Tiling (Alibaba: z-image / turbo / tiling / lora)](/model-api-reference/image-generation/alibaba/z-image/turbo/tiling/lora) — Z Image Turbo Tiling is Alibaba's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Z-Image Turbo Seamless Tiling (Alibaba: z-image / turbo / tiling)](/model-api-reference/image-generation/alibaba/z-image/turbo/tiling) — Z Image Turbo Tiling by Alibaba - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Qwen Image 2 (Alibaba: qwen-image-2 / pro / text-to-image)](/model-api-reference/image-generation/alibaba/qwen-image-2/pro/text-to-image) — Qwen Image 2 Pro by Alibaba - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Qwen Image 2 Pro](/model-api-reference/image-generation/alibaba/qwen-image-2/pro) — Alibaba Qwen Image 2 Pro text-to-image model with enhanced quality and configurable output format.
- [Qwen Image 2 (Alibaba: qwen-image-2)](/model-api-reference/image-generation/alibaba/qwen-image-2) — Alibaba Qwen Image 2 text-to-image model with high-quality generation and configurable output format.
- …and 57 more models in the sidebar.

### Baidu

- [ERNIE-Image Trainer](/model-api-reference/image-generation/baidu/ernie-image-trainer) — Ernie Image Trainer by Baidu - advanced AI model for training. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Ernie Image (Baidu: ernie-image)](/model-api-reference/image-generation/baidu/ernie-image) — Ernie Image is Baidu's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Ernie Image (Baidu: ernie-image / turbo)](/model-api-reference/image-generation/baidu/ernie-image/turbo) — Ernie Image Turbo is Baidu's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.

### BFL

- [FLUX Virtual Try-On](/model-api-reference/image-generation/bfl/flux-pro/1.0/vto) — Flux Pro 1.0 Vto by BFL - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Flux Pro Erase](/model-api-reference/image-generation/bfl/flux-pro/1.0/erase) — Flux Pro 1.0 Erase by BFL - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Flux 2 Pro (BFL: flux-2-pro / outpaint)](/model-api-reference/image-generation/bfl/flux-2-pro/outpaint) — Flux 2 Pro Outpaint is BFL's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [FLUX.2 [klein] 9B LoRA (BFL: flux-2 / klein / 9b / edit / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/9b/edit/lora) — Flux 2 Klein 9b is BFL's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [FLUX.2 [klein] 9B LoRA (BFL: flux-2 / klein / 9b / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/9b/lora) — Flux 2 Klein 9b by BFL - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [FLUX.2 [klein] 4B LoRA (BFL: flux-2 / klein / 4b / edit / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/4b/edit/lora) — Flux 2 Klein 4b is BFL's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [FLUX.2 [klein] 4B LoRA (BFL: flux-2 / klein / 4b / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/4b/lora) — Flux 2 Klein 4b by BFL - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Flux 2 [klein] Realtime](/model-api-reference/image-generation/bfl/flux-2/klein/realtime) — Flux 2 Klein Realtime is BFL's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [FLUX.2 [klein] 9B Base LoRA (BFL: flux-2 / klein / 9b / base / edit / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/9b/base/edit/lora) — Flux 2 Klein 9b by BFL - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [FLUX.2 [klein] 9B Base LoRA (BFL: flux-2 / klein / 9b / base / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/9b/base/lora) — Flux 2 Klein 9b is BFL's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [FLUX.2 [klein] 4B Base LoRA (BFL: flux-2 / klein / 4b / base / edit / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/4b/base/edit/lora) — Flux 2 Klein 4b by BFL - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [FLUX.2 [klein] 4B Base LoRA (BFL: flux-2 / klein / 4b / base / lora)](/model-api-reference/image-generation/bfl/flux-2/klein/4b/base/lora) — Flux 2 Klein 4b is BFL's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- …and 80 more models in the sidebar.

### Bria

- [Extract Object](/model-api-reference/image-generation/bria/extract-object) — Extract Object by Bria - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Bria Embed Product](/model-api-reference/image-generation/bria/embed-product) — Embed Product is Bria's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Bria Upscale Creative](/model-api-reference/image-generation/bria/upscale/creative) — Upscale Creative by Bria - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Bria Replace Background](/model-api-reference/image-generation/bria/replace-background) — Replace Background by Bria - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Bria Fibo Edit](/model-api-reference/image-generation/bria/fibo/edit) — Fibo Edit is Bria's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Bria Fibo Lite](/model-api-reference/image-generation/bria/fibo-lite) — Fibo Lite is Bria's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Bria Fibo](/model-api-reference/image-generation/bria/fibo) — Fibo by Bria - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Bria Reimagine 3.2](/model-api-reference/image-generation/bria/reimagine/3.2) — Reimagine 3.2 is Bria's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Bria Reimagine](/model-api-reference/image-generation/bria/reimagine) — Reimagine is Bria's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [BRIA RMBG 2.0](/model-api-reference/image-generation/bria/background/remove) — Background Remove is Bria's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Bria Expand Image](/model-api-reference/image-generation/bria/expand) — Expand by Bria - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Bria Eraser](/model-api-reference/image-generation/bria/eraser) — Eraser by Bria - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- …and 6 more models in the sidebar.

### ClarityAI

- [Clarity Upscaler](/model-api-reference/image-generation/clarity-ai/clarity-upscaler) — Clarity Upscaler by ClarityAI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### ElevenLabs

- [ElevenLabs Speech to Text](/model-api-reference/image-generation/elevenlabs/speech-to-text) — Speech To Text by ElevenLabs - accurate speech-to-text transcription with AI. Convert audio and video to text with high accuracy, multilingual support, and speaker identification.

### FASHN

- [FASHN Virtual Try-On V1.6](/model-api-reference/image-generation/fashn/tryon/v1.6) — Tryon V1.6 by FASHN - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [FASHN Virtual Try-On V1.5](/model-api-reference/image-generation/fashn/tryon/v1.5) — Tryon V1.5 by FASHN - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### HiDream

- [HiDream O1 Dev Edit](/model-api-reference/image-generation/hidream-ai/hidream-o1/dev/edit) — Hidream O1 Dev Edit is hidream-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [HiDream O1 Edit](/model-api-reference/image-generation/hidream-ai/hidream-o1/edit) — Hidream O1 Edit is hidream-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [HiDream O1](/model-api-reference/image-generation/hidream-ai/hidream-o1) — Hidream O1 by hidream-ai - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [HiDream O1 Dev](/model-api-reference/image-generation/hidream-ai/hidream-o1/dev) — Hidream O1 Dev by hidream-ai - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [HiDream I1 Full Edit](/model-api-reference/image-generation/hidream-ai/hidream-i1/full/edit) — Hidream I1 Full Edit by hidream-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [HiDream I1 Full](/model-api-reference/image-generation/hidream-ai/hidream-i1/full) — Hidream I1 Full is hidream-ai's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [HiDream I1 Dev](/model-api-reference/image-generation/hidream-ai/hidream-i1/dev) — Hidream I1 Dev by hidream-ai - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [HiDream I1 Fast](/model-api-reference/image-generation/hidream-ai/hidream-i1/fast) — Hidream I1 Fast is hidream-ai's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [HiDream E1](/model-api-reference/image-generation/hidream-ai/hidream-e1/1) — Hidream E1 1 by hidream-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [HiDream E1 Full](/model-api-reference/image-generation/hidream-ai/hidream-e1/full) — Hidream E1 Full is hidream-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

### hyper3d

- [Hyper3d](/model-api-reference/image-generation/hyper3d/rodin/v2) — Rodin V2 by hyper3d - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Hyper3D Rodin](/model-api-reference/image-generation/hyper3d/rodin) — Rodin is hyper3d's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.

### Ideogram

- [Ideogram Remove Background](/model-api-reference/image-generation/ideogram-ai/ideogram/remove-background) — Ideogram Remove Background by ideogram-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Ideogram (ideogram-ai: ideogram / custom-models / generate)](/model-api-reference/image-generation/ideogram-ai/ideogram/custom-models/generate) — Ideogram Custom Models Generate is ideogram-ai's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Ideogram V3 Layerize Text](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/layerize-text) — Ideogram V3 Layerize Text is ideogram-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Ideogram V3 Transparent](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/transparent) — Ideogram V3 Transparent is ideogram-ai's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Ideogram V3 Character Edit](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/character/edit) — Ideogram V3 Character Edit by ideogram-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Ideogram V3 Character](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/character) — Ideogram V3 Character is ideogram-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Ideogram V3 Character Remix](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/character/remix) — Ideogram V3 Character Remix is ideogram-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Ideogram V3 Reframe](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/reframe) — Ideogram V3 Reframe is ideogram-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Ideogram 3.0](/model-api-reference/image-generation/ideogram-ai/ideogram-v3) — 3.0 is Ideogram's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Ideogram V3 Replace Background](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/replace-background) — Ideogram V3 Replace Background by ideogram-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Ideogram V3 Remix](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/remix) — Ideogram V3 Remix is ideogram-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Ideogram V3 Edit](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/edit) — Ideogram V3 Edit by ideogram-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- …and 11 more models in the sidebar.

### ImagineArt

- [Imagineart 2.0 Edit Preview](/model-api-reference/image-generation/imagineart/imagineart-2.0-edit-preview/image-to-image) — Imagineart 2.0 Edit Preview by ImagineArt - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Imagineart 2.0 Preview](/model-api-reference/image-generation/imagineart/imagineart-2.0-preview/text-to-image) — Imagineart 2.0 Preview by ImagineArt - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.

### KwaiVGI

- [Kling Video V3 Standard](/model-api-reference/image-generation/kwaivgi/kling-video/v3/standard/motion-control) — Kling Video V3 Standard by KwaiVGI - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Kling Video V3 Pro](/model-api-reference/image-generation/kwaivgi/kling-video/v3/pro/motion-control) — Kling Video V3 Pro is KwaiVGI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Kling Video O3 Pro (KwaiVGI: kling-video / o3 / pro / edit)](/model-api-reference/image-generation/kwaivgi/kling-video/o3/pro/edit) — Kling Video O3 Pro is KwaiVGI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Kling Video O3 Pro (KwaiVGI: kling-video / o3 / pro / video-to-video)](/model-api-reference/image-generation/kwaivgi/kling-video/o3/pro/video-to-video) — Kling Video O3 Pro by KwaiVGI - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Kling Video O3 Standard (KwaiVGI: kling-video / o3 / standard / edit)](/model-api-reference/image-generation/kwaivgi/kling-video/o3/standard/edit) — Kling Video O3 Standard by KwaiVGI - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Kling Video O3 Standard (KwaiVGI: kling-video / o3 / standard / video-to-video)](/model-api-reference/image-generation/kwaivgi/kling-video/o3/standard/video-to-video) — Kling Video O3 Standard is KwaiVGI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Kling Image V3](/model-api-reference/image-generation/kwaivgi/kling-image/v3) — Kling Image V3 by KwaiVGI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Kling Image V3 Edit](/model-api-reference/image-generation/kwaivgi/kling-image/v3/edit) — Kling Image V3 Edit is KwaiVGI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Kling Image (KwaiVGI: kling-image / o3 / edit)](/model-api-reference/image-generation/kwaivgi/kling-image/o3/edit) — Kling Image O3 Edit is KwaiVGI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Kling Image (KwaiVGI: kling-image / o3)](/model-api-reference/image-generation/kwaivgi/kling-image/o3) — Kling Image O3 by KwaiVGI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Kling Video V2.6 Standard](/model-api-reference/image-generation/kwaivgi/kling-video/v2.6/standard/motion-control) — Kling Video V2.6 Standard by KwaiVGI - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Kling Video V2.6 Pro](/model-api-reference/image-generation/kwaivgi/kling-video/v2.6/pro/motion-control) — Kling Video V2.6 Pro is KwaiVGI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- …and 9 more models in the sidebar.

### Lightricks

- [Ltx 2.3 Quality](/model-api-reference/image-generation/lightricks/ltx-2.3-quality/audio-to-video) — Ltx 2.3 Quality Audio To Video by Lightricks - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [LTX-2.3 22B Video to Video Trainer](/model-api-reference/image-generation/lightricks/ltx23-v2v-trainer) — Ltx23 V2v Trainer by Lightricks - advanced AI model for training. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [LTX-2.3 22B Video Trainer](/model-api-reference/image-generation/lightricks/ltx23-video-trainer) — Ltx23 Video Trainer by Lightricks - advanced AI model for training. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [LTX-2 19B Distilled](/model-api-reference/image-generation/lightricks/ltx-2-19b/distilled/audio-to-video) — Ltx 2 19b Distilled Audio To Video by Lightricks - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [LTX-2 19B (Lightricks: ltx-2-19b / audio-to-video)](/model-api-reference/image-generation/lightricks/ltx-2-19b/audio-to-video) — Ltx 2 19b Audio To Video by Lightricks - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [LTX-2 19B (Lightricks: ltx-2-19b / video-to-video)](/model-api-reference/image-generation/lightricks/ltx-2-19b/video-to-video) — Ltx 2 19b Video To Video by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [LTX-2 19B (Lightricks: ltx-2-19b / extend-video)](/model-api-reference/image-generation/lightricks/ltx-2-19b/extend-video) — Ltx 2 19b Extend Video by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.

### meituan

- [Longcat Multi Avatar](/model-api-reference/image-generation/meituan/longcat-multi-avatar/image-audio-to-video) — Longcat Multi Avatar Image Audio To Video by meituan - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Longcat Single Avatar](/model-api-reference/image-generation/meituan/longcat-single-avatar/audio-to-video) — Longcat Single Avatar Audio To Video by meituan - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Longcat Image (meituan: longcat-image / edit)](/model-api-reference/image-generation/meituan/longcat-image/edit) — Longcat Image Edit by sandbase-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Longcat Image (meituan: longcat-image)](/model-api-reference/image-generation/meituan/longcat-image) — Longcat Image is meituan's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.

### Meshy

- [Meshy Rigging Multi Animation](/model-api-reference/image-generation/meshy/rigging/multi-animation) — Rigging Multi Animation by Meshy - advanced AI model for 3d-to-3d. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Meshy Rigging](/model-api-reference/image-generation/meshy/rigging) — Rigging by Meshy - advanced AI model for 3d-to-3d. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Meshy 6 - Multi Image To 3D](/model-api-reference/image-generation/meshy/meshy-v6/multi-image-to-3d) — Meshy V6 Multi Image To 3d by Meshy - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Meshy 6 (Meshy: meshy-v6)](/model-api-reference/image-generation/meshy/meshy-v6) — Meshy V6 by Meshy - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Meshy 6 (Meshy: meshy-v6 / text-to-3d)](/model-api-reference/image-generation/meshy/meshy-v6/text-to-3d) — Meshy V6 is Meshy's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Meshy 5 Retexture](/model-api-reference/image-generation/meshy/meshy/v5/retexture) — Meshy V5 Retexture by Meshy - advanced AI model for 3d-to-3d. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Meshy 5 Remesh](/model-api-reference/image-generation/meshy/meshy/v5/remesh) — Meshy V5 Remesh by Meshy - advanced AI model for 3d-to-3d. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Meshy 6 Preview (Meshy: meshy-v6-preview / text-to-3d)](/model-api-reference/image-generation/meshy/meshy-v6-preview/text-to-3d) — Meshy V6 Preview is Meshy's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Meshy 5 Multi](/model-api-reference/image-generation/meshy/meshy/v5/multi-image-to-3d) — Meshy V5 Multi Image To 3d by Meshy - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Meshy 6 Preview (Meshy: meshy-v6-preview)](/model-api-reference/image-generation/meshy/meshy-v6-preview) — Meshy V6 Preview by Meshy - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.

### Meta

- [Sam 3 1 (Meta: sam-3-1 / video)](/model-api-reference/image-generation/meta/sam-3-1/video) — Sam 3 1 Video is Meta's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Sam 3 1 (Meta: sam-3-1 / image-rle)](/model-api-reference/image-generation/meta/sam-3-1/image-rle) — Sam 3 1 Image Rle is Meta's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Sam 3 1 (Meta: sam-3-1 / image)](/model-api-reference/image-generation/meta/sam-3-1/image) — Sam 3 1 Image is Meta's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [SAM 3 3D Align](/model-api-reference/image-generation/meta/sam-3/3d-align) — Sam 3 3d Align by Meta - advanced AI model for 3d-to-3d. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Sam 3 (Meta: sam-3 / 3d-body)](/model-api-reference/image-generation/meta/sam-3/3d-body) — Sam 3 3d Body is Meta's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.
- [Sam 3 (Meta: sam-3 / 3d-objects)](/model-api-reference/image-generation/meta/sam-3/3d-objects) — Sam 3 3d Objects by Meta - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Sam 3 (Meta: sam-3 / image-rle)](/model-api-reference/image-generation/meta/sam-3/image-rle) — Sam 3 Image Rle is Meta's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [SAM 3 Embed](/model-api-reference/image-generation/meta/sam-3/image/embed) — Sam 3 Image Embed by Meta - advanced AI model for vision. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Sam 3 (Meta: sam-3 / video-rle)](/model-api-reference/image-generation/meta/sam-3/video-rle) — Sam 3 Video Rle is Meta's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [SAM 3 Image](/model-api-reference/image-generation/meta/sam-3/image) — Sam 3 Image is Meta's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Demucs](/model-api-reference/image-generation/meta/demucs) — Demucs by Meta - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### Microsoft

- [MAI Image 2.5 Pro (Edit)](/model-api-reference/image-generation/microsoft/mai-image-2.5-pro/edit) — Mai Image 2.5 Pro Edit by Microsoft - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Mai Image 2.5](/model-api-reference/image-generation/microsoft/mai-image-2.5/edit) — Mai Image 2.5 Edit by Microsoft - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### MiniMax

- [Minimax Image Subject Reference](/model-api-reference/image-generation/minimax/image-01/subject-reference) — Image 01 Subject Reference by MiniMax - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [MiniMax (Hailuo AI) Text to Image](/model-api-reference/image-generation/minimax/image-01) — Image 01 by MiniMax - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.

### Mirelo

- [Mirelo SFX1.6 (Mirelo: sfx1.6 / video-to-video)](/model-api-reference/image-generation/mirelo/sfx1.6/video-to-video) — Sfx1.6 Video To Video is Mirelo's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Mirelo SFX1.6 (Mirelo: sfx1.6 / inpaint-audio)](/model-api-reference/image-generation/mirelo/sfx1.6/inpaint-audio) — Sfx1.6 Inpaint Audio by Mirelo - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Mirelo SFX1.6 (Mirelo: sfx1.6 / extend-audio)](/model-api-reference/image-generation/mirelo/sfx1.6/extend-audio) — Sfx1.6 Extend Audio by Mirelo - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### NVIDIA

- [Cosmos 3 Super](/model-api-reference/image-generation/nvidia/cosmos-3-super/text-to-image) — Cosmos 3 Super by NVIDIA - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Nemotron 3 Nano Omni (NVIDIA: nemotron-3-nano-omni / vision)](/model-api-reference/image-generation/nvidia/nemotron-3-nano-omni/vision) — Nemotron 3 Nano Omni Vision by NVIDIA - advanced AI model for image-to-text. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Nemotron 3 Nano Omni (NVIDIA: nemotron-3-nano-omni / video)](/model-api-reference/image-generation/nvidia/nemotron-3-nano-omni/video) — Nemotron 3 Nano Omni Video by NVIDIA - advanced AI model for video-to-text. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Nemotron 3 Nano Omni (NVIDIA: nemotron-3-nano-omni / audio)](/model-api-reference/image-generation/nvidia/nemotron-3-nano-omni/audio) — Nemotron 3 Nano Omni Audio by NVIDIA - advanced AI model for audio-to-text. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### patina

- [PATINA (patina: material / extract)](/model-api-reference/image-generation/patina/material/extract) — Material Extract by patina - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [PATINA (patina: material)](/model-api-reference/image-generation/patina/material) — Material by patina - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.

### pixal3d

- [Pixal3d](/model-api-reference/image-generation/pixal3d/pixal3d) — Pixal3d is pixal3d's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.

### PixVerse

- [PixVerse V6 Extend](/model-api-reference/image-generation/pixverse/v6/extend) — V6 Extend is PixVerse's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### Reve

- [Reve 2.1 (Reve: 2.1 / remix)](/model-api-reference/image-generation/reve/2.1/remix) — 2.1 Remix is Reve's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Reve 2.1 (Reve: 2.1 / edit)](/model-api-reference/image-generation/reve/2.1/edit) — 2.1 Edit by Reve - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Reve 2.1 (Reve: 2.1 / text-to-image)](/model-api-reference/image-generation/reve/2.1/text-to-image) — 2.1 is Reve's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.

### sandbase-ai

- [Phota Text to Image](/model-api-reference/image-generation/sandbase-ai/phota) — Phota is sandbase-ai's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Hy Wu Edit](/model-api-reference/image-generation/sandbase-ai/hy-wu-edit) — Hy Wu Edit by sandbase-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Firered Image Edit V1.1](/model-api-reference/image-generation/sandbase-ai/firered-image-edit-v1.1) — Firered Image Edit V1.1 is sandbase-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [try-on](/model-api-reference/image-generation/sandbase-ai/cat-vton) — Cat Vton by sandbase-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Sana](/model-api-reference/image-generation/sandbase-ai/sana) — Sana by sandbase-ai - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Creative Upscaler](/model-api-reference/image-generation/sandbase-ai/creative-upscaler) — Creative Upscaler is sandbase-ai's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

### Sonilo

- [V1.1 Video to Sound Effects](/model-api-reference/image-generation/sonilo/1.1/video-to-sound-effects) — 1.1 Video To Sound Effects by Sonilo - advanced AI model for video-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [V1.1](/model-api-reference/image-generation/sonilo/1.1/video-to-music) — 1.1 Video To Music by Sonilo - advanced AI model for video-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### Stability AI

- [Stable Diffusion 3.5 Large](/model-api-reference/image-generation/stability-ai/sd/3.5-large) — Sd 3.5 Large by stability-ai - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Stable Diffusion 3.5 Medium](/model-api-reference/image-generation/stability-ai/sd/3.5-medium) — Sd 3.5 Medium is stability-ai's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Stable Diffusion V3 (Stability AI: stable-diffusion-v3-medium)](/model-api-reference/image-generation/stability-ai/stable-diffusion-v3-medium) — Stable Diffusion V3 Medium by Stability AI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [SDXL ControlNet Union (Stability AI: sdxl-controlnet-union / image-to-image)](/model-api-reference/image-generation/stability-ai/sdxl-controlnet-union/image-to-image) — Sdxl Controlnet Union by Stability AI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [SDXL ControlNet Union (Stability AI: sdxl-controlnet-union)](/model-api-reference/image-generation/stability-ai/sdxl-controlnet-union) — Sdxl Controlnet Union is Stability AI's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [SDXL ControlNet Union (Stability AI: sdxl-controlnet-union / inpainting)](/model-api-reference/image-generation/stability-ai/sdxl-controlnet-union/inpainting) — Sdxl Controlnet Union Inpainting by Stability AI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Stable Cascade](/model-api-reference/image-generation/stability-ai/stable-cascade) — Stable Cascade by Stability AI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Stable Diffusion XL (Stability AI: fast-sdxl)](/model-api-reference/image-generation/stability-ai/fast-sdxl) — Fast Sdxl is Stability AI's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Stable Diffusion V3 (Stability AI: stable-diffusion-v3-medium / image-to-image)](/model-api-reference/image-generation/stability-ai/stable-diffusion-v3-medium/image-to-image) — Stable Diffusion V3 Medium is Stability AI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [SoteDiffusion](/model-api-reference/image-generation/stability-ai/stable-cascade/sote-diffusion) — Stable Cascade Sote Diffusion is Stability AI's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Stable Diffusion XL (Stability AI: fast-sdxl / image-to-image)](/model-api-reference/image-generation/stability-ai/fast-sdxl/image-to-image) — Fast Sdxl by Stability AI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Stable Diffusion v1.5](/model-api-reference/image-generation/stability-ai/stable-diffusion-v15) — Stable Diffusion V15 by Stability AI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- …and 3 more models in the sidebar.

### Sync Labs

- [sync-3 Lipsync](/model-api-reference/image-generation/sync/lipsync/v3) — Lipsync V3 by Sync Labs - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Sync React-1](/model-api-reference/image-generation/sync/lipsync/react-1) — Lipsync React 1 is Sync Labs's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Sync Lipsync](/model-api-reference/image-generation/sync/lipsync/v2/pro) — Lipsync V2 Pro by Sync Labs - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Sync Lipsync 2.0](/model-api-reference/image-generation/sync/lipsync/v2) — Lipsync V2 by Sync Labs - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [sync.so -- lipsync 1.9.0-beta](/model-api-reference/image-generation/sync/sync-lipsync) — Sync Lipsync by Sync Labs - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.

### Tencent

- [Hunyuan 3D 3.1 Rapid Text to 3D](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/rapid/text-to-3d) — Hunyuan 3d 3.1 Rapid is Tencent's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Hunyuan Image 3.0 Edit](/model-api-reference/image-generation/tencent/hunyuan-image/3.0/edit) — Hunyuan Image 3.0 Edit by Tencent - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Hunyuan Image 3.0 Instruct](/model-api-reference/image-generation/tencent/hunyuan-image/3.0/instruct) — Hunyuan Image 3.0 Instruct by Tencent - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Hunyuan 3D Smart Topology](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/smart-topology) — Hunyuan 3d 3.1 Smart Topology by Tencent - advanced AI model for 3d-to-3d. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Hunyuan 3D 3.1 Rapid Image to 3D](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/rapid/image-to-3d) — Hunyuan 3d 3.1 Rapid by Tencent - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Hunyuan 3D 3.1 Pro Text to 3D](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/pro/text-to-3d) — Hunyuan 3d 3.1 Pro is Tencent's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Hunyuan 3D 3.1 Pro Image to 3D](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/pro/image-to-3d) — Hunyuan 3d 3.1 Pro by Tencent - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Hunyuan 3D Part Splitter](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/part) — Hunyuan 3d 3.1 Part by Tencent - advanced AI model for 3d-to-3d. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Hunyuan Motion Fast](/model-api-reference/image-generation/tencent/hunyuan-motion/fast) — Hunyuan Motion Fast is Tencent's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Hunyuan Motion](/model-api-reference/image-generation/tencent/hunyuan-motion) — Hunyuan Motion by Tencent - generate 3D models from text descriptions with AI. Create detailed 3D assets from natural language for games, visualization, and digital production.
- [Hunyuan3d V3 (Tencent: hunyuan-3d / v3 / text-to-3d)](/model-api-reference/image-generation/tencent/hunyuan-3d/v3/text-to-3d) — Hunyuan 3d V3 by Tencent - generate 3D models from text descriptions with AI. Create detailed 3D assets from natural language for games, visualization, and digital production.
- [Hunyuan3d V3 (Tencent: hunyuan-3d / v3 / sketch-to-3d)](/model-api-reference/image-generation/tencent/hunyuan-3d/v3/sketch-to-3d) — Hunyuan 3d V3 Sketch To 3d by Tencent - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- …and 11 more models in the sidebar.

### Topaz Labs

- [Topaz Upscale](/model-api-reference/image-generation/topaz/upscale/image) — Upscale Image is Topaz Labs's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

### trellis

- [Trellis 2 (trellis: trellis-2 / retexture)](/model-api-reference/image-generation/trellis/trellis-2/retexture) — Trellis 2 Retexture is trellis's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.
- [Trellis 2 (trellis: trellis-2)](/model-api-reference/image-generation/trellis/trellis-2) — Trellis 2 is trellis's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.
- [Trellis (trellis: trellis / multi)](/model-api-reference/image-generation/trellis/trellis/multi) — Trellis Multi is trellis's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.
- [Trellis (trellis: trellis)](/model-api-reference/image-generation/trellis/trellis) — Trellis is trellis's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.

### Tripo3D

- [Triposplat](/model-api-reference/image-generation/tripo3d/triposplat) — Triposplat by Tripo3D - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Tripo H3.1 Multiview to 3D](/model-api-reference/image-generation/tripo3d/tripo-h3.1/multiview-to-3d) — Tripo H3.1 Multiview To 3d by Tripo3D - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Tripo H3.1 Text to 3D](/model-api-reference/image-generation/tripo3d/tripo-h3.1/text-to-3d) — Tripo H3.1 is Tripo3D's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Tripo H3.1 Image to 3D](/model-api-reference/image-generation/tripo3d/tripo-h3.1/image-to-3d) — Tripo H3.1 by Tripo3D - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Tripo P1 Text to 3D](/model-api-reference/image-generation/tripo3d/tripo-p1/text-to-3d) — Tripo P1 is Tripo3D's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Tripo P1 Image to 3D](/model-api-reference/image-generation/tripo3d/tripo-p1/image-to-3d) — Tripo P1 by Tripo3D - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.

### VEED

- [Subtitles](/model-api-reference/image-generation/veed/subtitles) — Subtitles is VEED's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### Vidu

- [Vidu Q2 Reference to Image](/model-api-reference/image-generation/vidu/q2/reference-to-image) — Vidu Q2 Reference To Image by Shengshu - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Vidu Q2 Text to Image](/model-api-reference/image-generation/vidu/q2/text-to-image) — Vidu Q2 is Shengshu's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Vidu 2.0 Reference to Image](/model-api-reference/image-generation/vidu/2.0/reference-to-image) — Vidu 2.0 Reference To Image is Shengshu's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

### xAI

- [Grok Imagine Image Quality](/model-api-reference/image-generation/xai/grok-imagine-image/quality) — Grok Imagine Image Quality by xAI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Grok Imagine Image Quality Edit](/model-api-reference/image-generation/xai/grok-imagine-image/quality/edit) — Grok Imagine Image Quality Edit is xAI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Grok Imagine Video Extend](/model-api-reference/image-generation/xai/grok-imagine-video/extend) — Grok Imagine Video Extend is xAI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Grok Imagine Image Edit](/model-api-reference/image-generation/xai/grok-imagine-image/edit) — Grok Imagine Image Edit is xAI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Grok Imagine Video Edit](/model-api-reference/image-generation/xai/grok-imagine-video/edit) — Grok Imagine Video Edit is xAI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### zhipu

- [Glm Image (zhipu: glm-image / edit)](/model-api-reference/image-generation/zhipu/glm-image/edit) — Glm Image Edit by zhipu - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Glm Image (zhipu: glm-image)](/model-api-reference/image-generation/zhipu/glm-image) — Glm Image is zhipu's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.

## Capability coverage

`3d-to-3d`, `audio-to-audio`, `audio-to-text`, `audio-to-video`, `commercial`, `image-editing`, `image-to-3d`, `image-to-image`, `image-to-text`, `llm`, `mcp_exposable`, `protocol-ingress-only`, `speech-to-text`, `text-to-3d`, `text-to-image`, `training`, `video-to-audio`, `video-to-text`, `video-to-video`, `vision`
