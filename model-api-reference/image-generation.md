---
title: Image Generation
description: Browse SandBase Image Generation APIs by provider and open a model page for its exact request format.
---

# Image Generation

Browse enabled image generation models by provider in the left navigation. Open an entry for its exact model identifier, supported capabilities, and a working request.

Image Generation models use the SandBase generation protocol declared in each model registry file. Most are asynchronous: submit a request, receive an opaque run ID, then poll GET /v1/run/{id} until the generation is completed, failed, or timed out. Check the selected model page's execution mode because synchronous models return their result in the initial response.

## Providers

### OpenAI

- [GPT Image 2.5 Flare Text to Image](/model-api-reference/image-generation/openai/gpt-image-2.5-flare) — GPT Image 2.5 Flare is optimized for fast, high-quality image generation for everyday creative workflows.
- [GPT Image 2.5 Flare Edit](/model-api-reference/image-generation/openai/gpt-image-2.5-flare/edit) — GPT Image 2.5 Flare Edit is optimized for fast, high-quality image editing and multi-image composition.
- [GPT Image 2.5 Sunburst Text to Image](/model-api-reference/image-generation/openai/gpt-image-2.5-sunburst) — GPT Image 2.5 Sunburst prioritizes visual fidelity and precision for complex image generation workflows.
- [GPT Image 2.5 Sunburst Edit](/model-api-reference/image-generation/openai/gpt-image-2.5-sunburst/edit) — GPT Image 2.5 Sunburst Edit prioritizes precision and visual fidelity for complex image editing workflows.
- [GPT Image 2 Text to Image](/model-api-reference/image-generation/openai/gpt-image-2) — GPT Image 2, OpenAI's available image model, is capable of making fine-grained, detailed edits to images.
- [GPT Image 2 Edit](/model-api-reference/image-generation/openai/gpt-image-2/edit) — GPT Image 2 Editing supports image editing and multi-image synthesis with high-quality results.
- [GPT Image 1.5 Edit](/model-api-reference/image-generation/openai/gpt-image-1.5/edit) — Gpt Image 1.5 Edit by OpenAI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [GPT Image 1.5 Text to Image](/model-api-reference/image-generation/openai/gpt-image-1.5) — Gpt Image 1.5 is OpenAI's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [GPT Image 1 Mini Edit](/model-api-reference/image-generation/openai/gpt-image-1-mini/edit) — Gpt Image 1 Mini Edit is OpenAI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

### Google

- [Nano Banana 2.1 Text to Image](/model-api-reference/image-generation/google/nano-banana-2.1) — Nano Banana 2.1 is Google's available fast image generation model, with better prompt adherence, cleaner text rendering, extreme aspect ratios and 1K to 4K output.
- [Nano Banana 2.1 Edit](/model-api-reference/image-generation/google/nano-banana-2.1/edit) — Nano Banana 2.1 Edit is Google's available fast image editing model, fusing up to 14 reference images with stronger subject consistency and 1K to 4K output.
- [Nano Banana 2 Lite Text to Image](/model-api-reference/image-generation/google/nano-banana-2-lite) — Nano Banana 2 Lite by Google - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Nano Banana 2 Lite Edit](/model-api-reference/image-generation/google/nano-banana-2-lite/edit) — Nano Banana 2 Lite Edit is Google's low-latency, cost-efficient image editing model (Gemini 3.1 Flash Lite Image). Edit and combine supplied images with a text prompt; output is a 1K image.
- [Nano Banana 2 Edit](/model-api-reference/image-generation/google/nano-banana-2/edit) — Nano Banana 2 is Google's new state-of-the-art image generation and editing model
- [Nano Banana 2 Text to Image](/model-api-reference/image-generation/google/nano-banana-2) — Nano Banana 2 is Google's new state-of-the-art fast image generation and editing model
- [Nano Banana Pro Edit](/model-api-reference/image-generation/google/nano-banana-pro/edit) — Nano Banana Pro is Google's new state-of-the-art image generation and editing model
- [Nano Banana Pro Text to Image](/model-api-reference/image-generation/google/nano-banana-pro) — Nano Banana Pro is Google's new state-of-the-art image generation and editing model

### Ideogram

- [Ideogram 4.5 Edit](/model-api-reference/image-generation/ideogram/4.5/edit) — Ideogram 4.5 edits an image from a text instruction, with an optional mask and style references, with reliable text rendering and polished graphic design output.
- [Ideogram 4.5 Text to Image](/model-api-reference/image-generation/ideogram/4.5) — Ideogram 4.5 generates images from a text prompt, with reliable text rendering and polished graphic design output.

### ByteDance

- [Seedream 5.0 Flash Text to Image](/model-api-reference/image-generation/bytedance/seedream/5.0/flash) — Seedream 5.0 Flash is ByteDance's fast, low-cost Seedream 5.0 tier for high-volume text-to-image generation, with roughly 15–20 second turnaround and one flat price per image.
- [Seedream 5.0 Flash Edit](/model-api-reference/image-generation/bytedance/seedream/5.0/flash/edit) — Seedream 5.0 Flash Editing edits and fuses up to 10 reference images from a text instruction at one flat price per image, with fast 15–20 second turnaround.
- [Seedream 5.0 Pro Edit](/model-api-reference/image-generation/bytedance/seedream/5.0/pro/edit) — Seedream 5.0 Pro is ByteDance's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Seedream 5.0 Pro Text to Image](/model-api-reference/image-generation/bytedance/seedream/5.0/pro) — Seedream 5.0 Pro by ByteDance - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Seedream 5.0 Lite Text to Image](/model-api-reference/image-generation/bytedance/seedream/5.0/lite) — Seedream 5.0 Lite — Fast Text-to-Image API The lightweight version of Seedream 5.0, delivering high-quality, low-latency AI image generation from text prompts. Ideal for real-time creative tools, e-commerce visuals, and high-volume AIGC pipelines.
- [Seedream 4.5 Text to Image](/model-api-reference/image-generation/bytedance/seedream/4.5) — A new-generation image creation model from ByteDance, Seedream 4.5 integrates text-to-image generation and image editing into a single unified architecture, delivering high-fidelity visuals, precise prompt control, and seamless creative workflows for professional AIGC applications.
- [Seedream 4.5 Edit](/model-api-reference/image-generation/bytedance/seedream/4.5/edit) — A new-generation image creation model from ByteDance, Seedream 4.5 integrates text-to-image generation and image editing into a single unified architecture, delivering high-fidelity visuals, precise prompt control, and seamless creative workflows for professional AIGC applications.
- [SeedVR2 Image Upscale](/model-api-reference/image-generation/bytedance/seedvr/upscale/image) — Seedvr Upscale Image by ByteDance - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Seedream 5.0 Lite Edit](/model-api-reference/image-generation/bytedance/seedream/5.0/lite/edit) — Seedream 5.0 Lite — Fast Text-to-Image API The lightweight version of Seedream 5.0, delivering high-quality, low-latency AI image generation from text prompts. Ideal for real-time creative tools, e-commerce visuals, and high-volume AIGC pipelines.

### Recraft

- [Recraft V4.1 Utility](/model-api-reference/image-generation/recraft/recraft/v4.1/utility) — Recraft V4.1 Utility by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Recraft V4.1](/model-api-reference/image-generation/recraft/recraft/v4.1) — Recraft V4.1 by Recraft - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.

### Z-Image

- [Z-Image Turbo Text to Image](/model-api-reference/image-generation/z-image/turbo) — Turbo is Z-Image's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.

### Alibaba

- [Qwen Image 3 Text to Image](/model-api-reference/image-generation/alibaba/qwen-image-3/text-to-image) — Qwen Image 3 by Alibaba - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Qwen Image 3 Edit](/model-api-reference/image-generation/alibaba/qwen-image-3/edit) — Alibaba Qwen Image 3 image editing model with support for up to three reference images.
- [Wan 2.7 Pro Image to Image](/model-api-reference/image-generation/alibaba/wan/2.7/pro/image-to-image) — Alibaba Wan 2.7 Pro image-to-image model that edits images from a natural-language instruction, with multi-reference support and selectable aspect ratio.
- [Wan 2.7 Image to Image](/model-api-reference/image-generation/alibaba/wan/2.7/image-to-image) — Alibaba Wan 2.7 image-to-image model that edits images from a natural-language instruction, with multi-reference support and selectable aspect ratio.
- [Wan 2.7 Text to Image](/model-api-reference/image-generation/alibaba/wan/2.7/text-to-image) — Alibaba Wan 2.7 text-to-image model with high-quality generation and selectable aspect ratio.
- [Wan 2.7 Pro Text to Image](/model-api-reference/image-generation/alibaba/wan/2.7/pro/text-to-image) — Alibaba Wan 2.7 Pro text-to-image model with enhanced quality and selectable aspect ratio.
- [Qwen Image 2](/model-api-reference/image-generation/alibaba/qwen-image-2) — Alibaba Qwen Image 2 text-to-image model with high-quality generation and configurable output format.
- [Z Image Base](/model-api-reference/image-generation/alibaba/z-image/base) — Z Image Base by Alibaba - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Qwen Image Edit 2511 Multiple Angles](/model-api-reference/image-generation/alibaba/qwen-image-edit/2511/multiple-angles) — Qwen Image Edit 2511 Multiple Angles by Alibaba - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Wan 2.6 Text to Image](/model-api-reference/image-generation/alibaba/wan/2.6/text-to-image) — Alibaba Wan 2.6 text-to-image model with high-quality generation and selectable aspect ratio.
- [Wan 2.6 Image to Image](/model-api-reference/image-generation/alibaba/wan/2.6/image-to-image) — Alibaba Wan 2.6 image-to-image model that edits images from a natural-language instruction, with multi-reference support and selectable aspect ratio.
- [Qwen Image Edit 2511](/model-api-reference/image-generation/alibaba/qwen-image-edit/2511) — Qwen Image Edit 2511 by Alibaba - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- …and 4 more models in the sidebar.

### BFL

- [Flux 3 Text to Image](/model-api-reference/image-generation/bfl/flux-3/text-to-image) — FLUX 3 by Black Forest Labs generates images from a text prompt, with strong prompt adherence and typography at 512px to 4K resolution tiers.
- [Flux 3 Edit](/model-api-reference/image-generation/bfl/flux-3/edit) — FLUX 3 by Black Forest Labs edits up to 10 reference images from a text instruction, with strong prompt adherence and typography at 512px to 4K resolution tiers.
- [Flux 2 Klein 4B Edit](/model-api-reference/image-generation/bfl/flux-2/klein/4b/edit) — Flux 2 Klein 4b by BFL - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Flux 2 Klein 9B Edit](/model-api-reference/image-generation/bfl/flux-2/klein/9b/edit) — Flux 2 Klein 9b by BFL - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Flux 2 Klein 9B Text to Image](/model-api-reference/image-generation/bfl/flux-2/klein/9b) — Flux 2 Klein 9b is BFL's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Flux 2 Klein 4B Text to Image](/model-api-reference/image-generation/bfl/flux-2/klein/4b) — Flux 2 Klein 4b is BFL's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Flux 2 Flash Edit](/model-api-reference/image-generation/bfl/flux-2/flash/edit) — Flux 2 Flash Edit is BFL's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Flux 2 Flash Text to Image](/model-api-reference/image-generation/bfl/flux-2/flash) — Flux 2 Flash by BFL - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Flux 2 Turbo Edit](/model-api-reference/image-generation/bfl/flux-2/turbo/edit) — Flux 2 Turbo Edit is BFL's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Flux 2 Turbo Text to Image](/model-api-reference/image-generation/bfl/flux-2/turbo) — Flux 2 Turbo by BFL - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Flux 2 Max Text to Image](/model-api-reference/image-generation/bfl/flux-2/max) — Flux 2 Max by BFL - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Flux 2 Max Edit](/model-api-reference/image-generation/bfl/flux-2/max/edit) — Flux 2 Max Edit is BFL's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- …and 8 more models in the sidebar.

### ClarityAI

- [Clarity Upscaler](/model-api-reference/image-generation/clarity-ai/clarity-upscaler) — Clarity Upscaler by ClarityAI - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### HiDream

- [HiDream O1 Dev](/model-api-reference/image-generation/hidream-ai/hidream-o1/dev) — Hidream O1 Dev by hidream-ai - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.

### hyper3d

- [Rodin 2.5 Fast Text to 3D](/model-api-reference/image-generation/hyper3d/rodin/2.5/fast/text-to-3d) — Rodin Gen-2.5 by Hyper3D (Deemos) generates game- and production-ready 3D assets from a text prompt, tuned for speed with the low tiers.
- [Rodin 2.5 Fast Image to 3D](/model-api-reference/image-generation/hyper3d/rodin/2.5/fast/image-to-3d) — Rodin Gen-2.5 by Hyper3D (Deemos) generates game- and production-ready 3D assets from one to five reference images, tuned for speed with the low tiers.
- [Rodin 2.5 Text to 3D](/model-api-reference/image-generation/hyper3d/rodin/2.5/text-to-3d) — Rodin Gen-2.5 by Hyper3D (Deemos) generates game- and production-ready 3D assets from a text prompt.
- [Rodin 2.5 Image to 3D](/model-api-reference/image-generation/hyper3d/rodin/2.5/image-to-3d) — Rodin Gen-2.5 by Hyper3D (Deemos) generates game- and production-ready 3D assets from one to five reference images.

### Ideogram

- [Ideogram 3.0 Text to Image](/model-api-reference/image-generation/ideogram-ai/ideogram-v3) — 3.0 is Ideogram's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.
- [Ideogram 3.0 Edit](/model-api-reference/image-generation/ideogram-ai/ideogram-v3/edit) — Ideogram V3 Edit by ideogram-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### KwaiVGI

- [Kling Image O3 Edit](/model-api-reference/image-generation/kwaivgi/kling-image/o3/edit) — Kling Image O3 Edit by Kuaishou edits or recomposes images from a text instruction using up to 10 reference images, with 1K, 2K, or 4K output.
- [Kling Image O3 Text to Image](/model-api-reference/image-generation/kwaivgi/kling-image/o3) — Kling Image O3 by Kuaishou generates images from a text prompt at 1K, 2K, or 4K resolution in common aspect ratios.

### Meshy

- [Meshy 7.1 Multi-Image to 3D](/model-api-reference/image-generation/meshy/7.1/multi-image-to-3d) — Meshy 7.1 reconstructs a textured, optionally rigged 3D model from 1–4 views of the same object.
- [Meshy 7.1 Image to 3D](/model-api-reference/image-generation/meshy/7.1/image-to-3d) — Meshy 7.1 turns a single image into a textured, optionally rigged and animated 3D model.
- [Meshy 7.1 Text to 3D](/model-api-reference/image-generation/meshy/7.1/text-to-3d) — Meshy 7.1 generates a textured, optionally rigged and animated 3D model from a text prompt.

### Meta

- [SAM 3 3D Objects](/model-api-reference/image-generation/meta/sam-3/3d-objects) — Sam 3 3d Objects by Meta - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [SAM 3 Image](/model-api-reference/image-generation/meta/sam-3/image) — Sam 3 Image is Meta's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

### Microsoft

- [MAI Image 2.5 Pro Edit](/model-api-reference/image-generation/microsoft/mai-image-2.5-pro/edit) — Mai Image 2.5 Pro Edit by Microsoft - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [MAI Image 2.5 Edit](/model-api-reference/image-generation/microsoft/mai-image-2.5/edit) — Mai Image 2.5 Edit by Microsoft - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### Midjourney

- [Midjourney V8.1](/model-api-reference/image-generation/midjourney/midjourney-v8.1) — Midjourney V8.1 text-to-image generation through Evolink.ai.

### sandbase-ai

- [try-on](/model-api-reference/image-generation/sandbase-ai/cat-vton) — Cat Vton by sandbase-ai - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.

### Tencent

- [Hunyuan Image 3.0 Edit](/model-api-reference/image-generation/tencent/hunyuan-image/3.0/edit) — Hunyuan Image 3.0 Edit by Tencent - AI-powered image editing, style transfer, and transformation. Edit photos with natural language instructions, remove backgrounds, change styles, and enhance images effortlessly.
- [Hunyuan 3D 3.1 Pro Text to 3D](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/pro/text-to-3d) — Hunyuan 3d 3.1 Pro is Tencent's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Hunyuan 3D 3.1 Pro Image to 3D](/model-api-reference/image-generation/tencent/hunyuan-3d/3.1/pro/image-to-3d) — Hunyuan 3d 3.1 Pro by Tencent - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Hunyuan 3D 3.0 Image to 3D](/model-api-reference/image-generation/tencent/hunyuan-3d/3.0/image-to-3d) — Hunyuan 3d V3 is Tencent's image-to-3D AI model. Transform photographs into production-ready 3D meshes with accurate geometry and texture mapping.
- [Hunyuan Image 3.0 Text to Image](/model-api-reference/image-generation/tencent/hunyuan-image/3.0) — Hunyuan Image 3.0 is Tencent's advanced text-to-image AI model. Create photorealistic images, illustrations, and concept art from natural language descriptions with exceptional detail and prompt adherence.

### Topaz Labs

- [Topaz Upscale](/model-api-reference/image-generation/topaz/upscale/image) — Upscale Image is Topaz Labs's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

### Tripo3D

- [Tripo P2 Text to 3D](/model-api-reference/image-generation/tripo3d/tripo-p2/text-to-3d) — Tripo P2 is Tripo3D's current flagship 3D generation model. It turns a text description into a production-ready mesh with optional PBR textures.
- [Tripo P2 Image to 3D](/model-api-reference/image-generation/tripo3d/tripo-p2/image-to-3d) — Tripo P2 is Tripo3D's current flagship 3D generation model. It reconstructs a production-ready mesh with optional PBR textures from a single image.
- [Tripo H3.1 Multiview to 3D](/model-api-reference/image-generation/tripo3d/tripo-h3.1/multiview-to-3d) — Tripo H3.1 Multiview To 3d by Tripo3D - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.
- [Tripo H3.1 Text to 3D](/model-api-reference/image-generation/tripo3d/tripo-h3.1/text-to-3d) — Tripo H3.1 is Tripo3D's text-to-3D AI model. Turn written descriptions into textured 3D objects with realistic geometry and materials.
- [Tripo H3.1 Image to 3D](/model-api-reference/image-generation/tripo3d/tripo-h3.1/image-to-3d) — Tripo H3.1 by Tripo3D - convert 2D images into 3D models with AI. Generate textured 3D assets from single photos for games, AR/VR, e-commerce, and digital content creation.

### xAI

- [Grok Imagine Image 2.0 Edit](/model-api-reference/image-generation/xai/grok-imagine-image/2.0/edit) — Grok Imagine Image 2.0 Edit is xAI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Grok Imagine Image 2.0 Text to Image](/model-api-reference/image-generation/xai/grok-imagine-image/2.0/text-to-image) — Grok Imagine Image 2.0 by xAI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Grok Imagine Image Quality Text to Image](/model-api-reference/image-generation/xai/grok-imagine-image/quality) — Grok Imagine Image Quality by xAI - generate stunning images from text prompts with state-of-the-art AI. Supports multiple aspect ratios, styles, and high-resolution output for creative and commercial use.
- [Grok Imagine Image Quality Edit](/model-api-reference/image-generation/xai/grok-imagine-image/quality/edit) — Grok Imagine Image Quality Edit is xAI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.
- [Grok Imagine Image Edit](/model-api-reference/image-generation/xai/grok-imagine-image/edit) — Grok Imagine Image Edit is xAI's intelligent image editing model. Transform, retouch, and reimagine existing images using text prompts - from background replacement to artistic style conversion.

## Capability coverage

`commercial`, `image-to-3d`, `image-to-image`, `mcp_exposable`, `text-to-3d`, `text-to-image`
