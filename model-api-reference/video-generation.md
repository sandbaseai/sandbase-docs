---
title: Video Generation
description: Browse SandBase Video Generation APIs by provider and open a model page for its exact request format.
---

# Video Generation

Browse enabled video generation models by provider in the left navigation. Open an entry for its exact model identifier, supported capabilities, and a working request.

Video Generation models use the async SandBase generation protocol declared in each model registry file. Submit a request, receive a task id, then poll the result endpoint until the generation is completed, failed, or timed out.

## Providers

### OpenAI

- [Sora 2 Characters](/model-api-reference/video-generation/openai/sora-2/characters) — Sora 2 Characters is OpenAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Sora 2 Remix](/model-api-reference/video-generation/openai/sora-2/video-to-video/remix) — Sora 2 Video To Video Remix is OpenAI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Sora 2 Image to Video Pro](/model-api-reference/video-generation/openai/sora-2/image-to-video/pro) — Sora 2 Pro is OpenAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Sora 2 Text to Video Pro](/model-api-reference/video-generation/openai/sora-2/text-to-video/pro) — Sora 2 Pro by OpenAI - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Sora 2](/model-api-reference/video-generation/openai/sora-2/text-to-video) — Sora 2 by OpenAI - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Sora 2](/model-api-reference/video-generation/openai/sora-2/image-to-video) — Sora 2 is OpenAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.

### Bytedance

- [Seedance 2.5 Image to Video](/model-api-reference/video-generation/bytedance/seedance/2.5/image-to-video) — ByteDance's next-generation image-to-video model, animating a single still into a native clip up to 30 seconds at 720p with continuous, coherent motion, native audio, and director-level camera control.
- [Seedance 2.5 Reference to Video](/model-api-reference/video-generation/bytedance/seedance/2.5/reference-to-video) — ByteDance's next-generation reference-to-video model, generating video from multimodal references (images, videos, audio) and locking a character, set, and palette across a full take up to 30 seconds for production-grade consistency.
- [Seedance 2.5 Text to Video](/model-api-reference/video-generation/bytedance/seedance/2.5/text-to-video) — ByteDance's next-generation text-to-video model, generating native single-shot clips up to 30 seconds at 720p with coherent motion, native audio, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Text to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/text-to-video) — ByteDance's most advanced text-to-video model delivering cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Reference to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/reference-to-video) — ByteDance's most advanced reference-to-video model generating cinematic video guided by reference content, with native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Fast Text to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/fast/text-to-video) — ByteDance's most advanced text-to-video model in its fast tier delivering lower latency and cost without compromising on cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Image to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/image-to-video) — ByteDance's most advanced image-to-video model transforming still images into cinematic video with native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Fast Reference to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/fast/reference-to-video) — ByteDance's most advanced reference-to-video model in its fast tier delivering lower latency and cost without compromising on cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Fast Image to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/fast/image-to-video) — ByteDance's most advanced image-to-video model in its fast tier delivering lower latency and cost without compromising on cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [DreamActor 2.0](/model-api-reference/video-generation/bytedance/dreamactor/2.0) — DreamActor M2.0 by ByteDance generates videos by animating a reference image using motion from a driving video. It replicates motion, facial expressions, and lip movements from the template video while preserving the subject and background features of the input image.
- [Seedance v1.5 Pro Text to Video](/model-api-reference/video-generation/bytedance/seedance/1.5/pro/text-to-video) — ByteDance Seedance v1.5 Pro text-to-video model generating cinematic video from text prompts with native audio generation, camera control, and professional-grade output quality.
- [Seedance v1.5 Pro Image to Video](/model-api-reference/video-generation/bytedance/seedance/1.5/pro/image-to-video) — ByteDance Seedance v1.5 Pro image-to-video model transforming still images into cinematic video with native audio generation, camera control, and professional-grade output quality.
- …and 9 more models in the sidebar.

### Google

- [Gemini Omni Flash](/model-api-reference/video-generation/google/gemini-omni-flash/reference-to-video) — Gemini Omni Flash by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Gemini Omni Flash](/model-api-reference/video-generation/google/gemini-omni-flash/image-to-video) — Gemini Omni Flash by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Gemini Omni Flash](/model-api-reference/video-generation/google/gemini-omni-flash/edit) — Gemini Omni Flash Edit by Google - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Gemini Omni Flash](/model-api-reference/video-generation/google/gemini-omni-flash) — Gemini Omni Flash is Google's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Veo 3.1 Fast](/model-api-reference/video-generation/google/veo3.1/fast/reference-to-video) — Veo3.1 Fast by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Veo3.1 Lite FLF](/model-api-reference/video-generation/google/veo3.1/lite/first-last-frame-to-video) — Veo3.1 Lite First Last Frame To Video is Google's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Veo3.1 Lite Image to Video](/model-api-reference/video-generation/google/veo3.1/lite/image-to-video) — Veo3.1 Lite by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Veo3.1 Lite Text to Video](/model-api-reference/video-generation/google/veo3.1/lite) — Veo3.1 Lite is Google's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Veo 3.1 Fast](/model-api-reference/video-generation/google/veo3.1/fast/extend-video) — Veo3.1 Fast Extend Video by Google - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Veo 3.1](/model-api-reference/video-generation/google/veo3.1/extend-video) — Veo3.1 Extend Video is Google's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Veo 3.1 Fast](/model-api-reference/video-generation/google/veo3.1/fast/first-last-frame-to-video) — Veo3.1 Fast First Last Frame To Video is Google's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Veo 3.1](/model-api-reference/video-generation/google/veo3.1/first-last-frame-to-video) — Veo3.1 First Last Frame To Video by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- …and 11 more models in the sidebar.

### Luma

- [Luma Ray 3.2 Video to Video](/model-api-reference/video-generation/luma/agent/ray/3.2/video-to-video) — Agent Ray 3.2 by Luma - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Luma Ray 3.2 Reframe](/model-api-reference/video-generation/luma/agent/ray/3.2/reframe) — Agent Ray 3.2 is Luma's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Luma Ray 3.2 Text to Video](/model-api-reference/video-generation/luma/agent/ray/3.2/text-to-video) — Agent Ray 3.2 is Luma's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Luma Ray 3.2 Image to Video](/model-api-reference/video-generation/luma/agent/ray/3.2/image-to-video) — Agent Ray 3.2 by Luma - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Luma Ray Flash 2 Modify](/model-api-reference/video-generation/luma/ray-flash-2/modify) — Ray Flash 2 Modify by Luma - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Luma Ray 2 Modify](/model-api-reference/video-generation/luma/ray-2/modify) — Ray 2 Modify by Luma - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Luma Ray Flash 2 Reframe](/model-api-reference/video-generation/luma/ray-flash-2/reframe) — Ray Flash 2 Reframe is Luma's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Luma Ray 2 Reframe](/model-api-reference/video-generation/luma/ray-2/reframe) — Ray 2 Reframe is Luma's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Luma Ray Flash 2 Image to Video](/model-api-reference/video-generation/luma/ray-flash-2/image-to-video) — Ray Flash 2 by Luma - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Luma Ray Flash 2 Text to Video](/model-api-reference/video-generation/luma/ray-flash-2/text-to-video) — Ray Flash 2 is Luma's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Luma Ray 2 Image to Video](/model-api-reference/video-generation/luma/ray-2/image-to-video) — Ray 2 by Luma - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Luma Ray 2 Text to Video](/model-api-reference/video-generation/luma/ray-2/text-to-video) — Ray 2 is Luma's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.

### MiniMax

- [MiniMax H3 Video Regeneration](/model-api-reference/video-generation/minimax/h3/video-regeneration) — Regenerate a single base video from a text prompt as a 2K MiniMax H3 video.
- [MiniMax H3 (Text to Video)](/model-api-reference/video-generation/minimax/h3/text-to-video) — Generate native-stereo 2K video from text with MiniMax H3.
- [MiniMax H3 (Image to Video)](/model-api-reference/video-generation/minimax/h3/image-to-video) — Generate native-stereo 2K video from a first frame and optional last frame with MiniMax H3.
- [MiniMax H3 (Reference to Video)](/model-api-reference/video-generation/minimax/h3/reference-to-video) — Generate native-stereo 2K video guided by image, video, and audio references with MiniMax H3.
- [MiniMax Hailuo 2.3 [Pro] (Image to Video)](/model-api-reference/video-generation/minimax/hailuo/2.3/pro/image-to-video) — Hailuo 2.3 Pro is MiniMax's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [MiniMax Hailuo 2.3 Fast [Standard] (Image to Video)](/model-api-reference/video-generation/minimax/hailuo/2.3-fast/standard/image-to-video) — Hailuo 2.3 Fast Standard is MiniMax's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [MiniMax Hailuo 2.3 [Standard] (Image to Video)](/model-api-reference/video-generation/minimax/hailuo/2.3/standard/image-to-video) — Hailuo 2.3 Standard by MiniMax - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [MiniMax Hailuo 2.3 Fast [Pro] (Image to Video)](/model-api-reference/video-generation/minimax/hailuo/2.3-fast/pro/image-to-video) — Hailuo 2.3 Fast Pro by MiniMax - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [MiniMax Hailuo 2.3 [Standard] (Text to Video)](/model-api-reference/video-generation/minimax/hailuo/2.3/standard/text-to-video) — Hailuo 2.3 Standard is MiniMax's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [MiniMax Hailuo 2.3 [Pro] (Text to Video)](/model-api-reference/video-generation/minimax/hailuo/2.3/pro/text-to-video) — Hailuo 2.3 Pro by MiniMax - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [MiniMax Hailuo 02 Fast (Image to Video)](/model-api-reference/video-generation/minimax/hailuo/02-fast/image-to-video) — Hailuo 02 Fast is MiniMax's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [MiniMax Hailuo 02 [Standard] (Image to Video)](/model-api-reference/video-generation/minimax/hailuo/02/standard/image-to-video) — Hailuo 02 Standard is MiniMax's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- …and 10 more models in the sidebar.

### Pika

- [Pika V2.2 Frames](/model-api-reference/video-generation/pika/v2.2/frames) — V2.2 Frames is Pika's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Pika V2.2 Image to Video](/model-api-reference/video-generation/pika/v2.2/image-to-video) — V2.2 is Pika's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Pika V2.2 Text to Video](/model-api-reference/video-generation/pika/v2.2/text-to-video) — V2.2 by Pika - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Pika V2 Image to Video Turbo](/model-api-reference/video-generation/pika/v2/turbo/image-to-video) — V2 Turbo is Pika's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Pika V1.5 Effects](/model-api-reference/video-generation/pika/v1.5/effects) — V1.5 Effects by Pika - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Pika V2.2 Scenes](/model-api-reference/video-generation/pika/v2.2/scenes) — V2.2 Scenes is Pika's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Pika V2 Additions](/model-api-reference/video-generation/pika/v2/additions) — V2 Additions by Pika - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Pika V2.1 Text to Video](/model-api-reference/video-generation/pika/v2.1/text-to-video) — V2.1 by Pika - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Pika V2 Text to Video Turbo](/model-api-reference/video-generation/pika/v2/turbo/text-to-video) — V2 Turbo by Pika - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Pika V2.1 Image to Video](/model-api-reference/video-generation/pika/v2.1/image-to-video) — V2.1 is Pika's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.

### VEED

- [VEED Lipsync](/model-api-reference/video-generation/veed/lipsync/2.0) — Lipsync 2.0 is VEED's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [VEED Fabric 1.0 Text to Video](/model-api-reference/video-generation/veed/fabric-1.0/text-to-video) — Fabric 1.0 by VEED - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [VEED Video Background Removal Fast](/model-api-reference/video-generation/veed/video-bg-removal/fast) — Video Bg Removal Fast is VEED's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [VEED Video Background Removal](/model-api-reference/video-generation/veed/video-bg-removal) — Video Bg Removal by VEED - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [VEED Video Background Removal Green Screen](/model-api-reference/video-generation/veed/video-bg-removal/green-screen) — Video Bg Removal Green Screen is VEED's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [VEED Fabric 1.0 Fast Image to Video](/model-api-reference/video-generation/veed/fabric-1.0/fast/image-to-video) — Fabric 1.0 Fast by VEED - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [VEED Fabric 1.0 Image to Video](/model-api-reference/video-generation/veed/fabric-1.0/image-to-video) — Fabric 1.0 is VEED's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [VEED Lipsync](/model-api-reference/video-generation/veed/lipsync) — Lipsync is VEED's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [VEED Avatars Text to Video](/model-api-reference/video-generation/veed/avatars/text-to-video) — Avatars is VEED's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [VEED Avatars Audio to Video](/model-api-reference/video-generation/veed/avatars/audio-to-video) — Avatars Audio To Video by VEED - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### Alibaba

- [Happy Horse 1.1 Image to Video](/model-api-reference/video-generation/alibaba/happy-horse/1.1/image-to-video) — Happy Horse 1.1 by Alibaba - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Happy Horse 1.1 Reference to Video](/model-api-reference/video-generation/alibaba/happy-horse/1.1/reference-to-video) — Happy Horse 1.1 by Alibaba - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Happy Horse 1.1 Text to Video](/model-api-reference/video-generation/alibaba/happy-horse/1.1/text-to-video) — Happy Horse 1.1 is Alibaba's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Happy Horse Video Edit](/model-api-reference/video-generation/alibaba/happy-horse/video-edit) — Happy Horse Video Edit by Alibaba - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Happy Horse Reference to Video](/model-api-reference/video-generation/alibaba/happy-horse/reference-to-video) — Alibaba's #1-ranked Happy Horse 1.0 generates stunning 1080p videos with synchronized native audio and multilingual lip-sync, transforming text prompts or images into cinematic, true-to-life motion content for next-generation AIGC creation.
- [Happy Horse Image to Video](/model-api-reference/video-generation/alibaba/happy-horse/image-to-video) — Alibaba's #1-ranked Happy Horse 1.0 generates stunning 1080p videos with synchronized native audio and multilingual lip-sync, transforming text prompts or images into cinematic, true-to-life motion content for next-generation AIGC creation.
- [Happy Horse Text to Video](/model-api-reference/video-generation/alibaba/happy-horse/text-to-video) — Alibaba's #1-ranked Happy Horse 1.0 generates stunning 1080p videos with synchronized native audio and multilingual lip-sync, transforming text prompts or images into cinematic, true-to-life motion content for next-generation AIGC creation.
- [Wan 2.7 Text to Video](/model-api-reference/video-generation/alibaba/wan/2.7/text-to-video) — Alibaba Wan 2.7 text-to-video model with cinematic visuals, native audio generation, and configurable duration and resolution.
- [Wan 2.7 Reference to Video](/model-api-reference/video-generation/alibaba/wan/2.7/reference-to-video) — Alibaba Wan 2.7 reference-to-video model generating video guided by reference content.
- [Wan 2.7 Edit Video](/model-api-reference/video-generation/alibaba/wan/2.7/edit-video) — Alibaba Wan 2.7 video editing model.
- [Wan 2.7 Image to Video](/model-api-reference/video-generation/alibaba/wan/2.7/image-to-video) — Alibaba Wan 2.7 image-to-video model transforming still images into video with native audio generation.
- [Wan Motion](/model-api-reference/video-generation/alibaba/wan/motion) — Wan Motion by Alibaba - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- …and 50 more models in the sidebar.

### Bria

- [Bria's VRMBG 3.0](/model-api-reference/video-generation/bria/video/background-removal/3.0) — Video Background Removal 3.0 by Bria - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Bria's VRMBG 3.0 Realtime](/model-api-reference/video-generation/bria/video/background-removal/realtime) — Video Background Removal Realtime is Bria's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### Creatify

- [Creatify Aurora](/model-api-reference/video-generation/creatify/aurora) — Aurora by Creatify - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.

### ElevenLabs

- [ElevenLabs Dubbing](/model-api-reference/video-generation/elevenlabs/dubbing) — Dubbing by ElevenLabs - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### HeyGen

- [Heygen v5 Digital Twin](/model-api-reference/video-generation/heygen/avatar5/digital-twin) — Avatar5 Digital Twin by HeyGen - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [HeyGen Video Agent V3](/model-api-reference/video-generation/heygen/heygen/video-agent/v3) — Heygen Video Agent V3 is HeyGen's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [HeyGen Lipsync Precision](/model-api-reference/video-generation/heygen/heygen/lipsync/precision) — Heygen Lipsync Precision by HeyGen - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [HeyGen Lipsync Speed](/model-api-reference/video-generation/heygen/heygen/lipsync/speed) — Heygen Lipsync Speed by HeyGen - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [HeyGen Translate Speed](/model-api-reference/video-generation/heygen/heygen/translate/speed) — Heygen Translate Speed by HeyGen - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [HeyGen Translate Precision](/model-api-reference/video-generation/heygen/heygen/translate/precision) — Heygen Translate Precision by HeyGen - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [HeyGen Avatar 4 Image to Video](/model-api-reference/video-generation/heygen/heygen-avatar4/image-to-video) — Heygen Avatar4 is HeyGen's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [HeyGen Avatar 4 Digital Twin](/model-api-reference/video-generation/heygen/heygen-avatar4/digital-twin) — Heygen Avatar4 Digital Twin is HeyGen's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [HeyGen Avatar 3 Digital Twin](/model-api-reference/video-generation/heygen/heygen-avatar3/digital-twin) — Heygen Avatar3 Digital Twin is HeyGen's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [HeyGen Video Agent V2](/model-api-reference/video-generation/heygen/heygen/video-agent/v2) — Heygen Video Agent V2 is HeyGen's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.

### krea

- [Krea Wan 14b- Text to Video](/model-api-reference/video-generation/krea/krea-wan/text-to-video) — Krea Wan by krea - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Krea Wan 14B](/model-api-reference/video-generation/krea/krea-wan/video-to-video) — Krea Wan Video To Video is krea's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### KwaiVGI

- [Kling 3.0 Turbo Standard Image to Video](/model-api-reference/video-generation/kwaivgi/kling-video/3.0/turbo/standard/image-to-video) — Kling Video 3.0 Turbo is KwaiVGI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Kling 3.0 Turbo Pro Text to Video](/model-api-reference/video-generation/kwaivgi/kling-video/3.0/turbo/pro/text-to-video) — Kling Video 3.0 Turbo is KwaiVGI's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Kling 3.0 Turbo Pro Image to Video](/model-api-reference/video-generation/kwaivgi/kling-video/3.0/turbo/pro/image-to-video) — Kling Video 3.0 Turbo by KwaiVGI - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Kling 3.0 Turbo Standard Text to Video](/model-api-reference/video-generation/kwaivgi/kling-video/3.0/turbo/standard/text-to-video) — Kling Video 3.0 Turbo by KwaiVGI - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Kling Video O3 4k](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/reference-to-video) — Kling Video O3 4k by KwaiVGI - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Kling Video O3 4k](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/image-to-video) — Kling Video O3 4k by KwaiVGI - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Kling Video O3 4k](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/text-to-video) — Kling Video O3 4k is KwaiVGI's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Kling Video V3 4k](/model-api-reference/video-generation/kwaivgi/kling-video/v3/4k/image-to-video) — Kling Video V3 4k by KwaiVGI - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Kling Video V3 4k](/model-api-reference/video-generation/kwaivgi/kling-video/v3/4k/text-to-video) — Kling Video V3 4k is KwaiVGI's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Kling Video V3 Pro](/model-api-reference/video-generation/kwaivgi/kling-video/v3/pro/image-to-video) — Kling Video V3 Pro is KwaiVGI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Kling Video V3 Standard](/model-api-reference/video-generation/kwaivgi/kling-video/v3/standard/image-to-video) — Kling Video V3 Standard by KwaiVGI - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Kling Video V3 Pro](/model-api-reference/video-generation/kwaivgi/kling-video/v3/pro/text-to-video) — Kling Video V3 Pro by KwaiVGI - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- …and 48 more models in the sidebar.

### Lightricks

- [Ltx 2.3 ](/model-api-reference/video-generation/lightricks/ltx-2.3/reframe) — Ltx 2.3 Reframe is Lightricks's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Ltx 2.3 Quality](/model-api-reference/video-generation/lightricks/ltx-2.3-quality/extend-video) — Ltx 2.3 Quality Extend Video by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Ltx 2.3 Quality](/model-api-reference/video-generation/lightricks/ltx-2.3-quality/hdr) — Ltx 2.3 Quality Hdr is Lightricks's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Ltx 2.3 Quality](/model-api-reference/video-generation/lightricks/ltx-2.3-quality/image-to-video) — Ltx 2.3 Quality by Lightricks - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Ltx 2.3 Quality](/model-api-reference/video-generation/lightricks/ltx-2.3-quality/text-to-video) — Ltx 2.3 Quality is Lightricks's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [LTX-2.3 22B Distilled](/model-api-reference/video-generation/lightricks/ltx-2.3-22b/distilled/reference-video-to-video/lora) — Ltx 2.3 22b Distilled Reference Video To Video is Lightricks's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [LTX 2.3 22B Distilled Reference to Video](/model-api-reference/video-generation/lightricks/ltx-2.3-22b-distilled/reference-to-video) — Ltx 2.3 22b Distilled by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [LTX 2.3 22B](/model-api-reference/video-generation/lightricks/ltx-2.3-22b/reference-video-to-video/lora) — Ltx 2.3 22b Reference Video To Video Lora is Lightricks's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [LTX 2.3 22B Reference to Video](/model-api-reference/video-generation/lightricks/ltx-2.3-22b/reference-to-video) — Ltx 2.3 22b by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [LTX-2.3 22B](/model-api-reference/video-generation/lightricks/ltx-2.3-22b/extend-video/lora) — Ltx 2.3 22b Extend Video Lora is Lightricks's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [LTX 2.3 22B Extend](/model-api-reference/video-generation/lightricks/ltx-2.3-22b/extend) — Ltx 2.3 22b Extend by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [LTX-2.3 22B Distilled](/model-api-reference/video-generation/lightricks/ltx-2.3-22b/distilled/video-to-video/lora) — Ltx 2.3 22b Distilled Video To Video is Lightricks's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- …and 55 more models in the sidebar.

### meituan

- [LongCat Single Avatar](/model-api-reference/video-generation/meituan/longcat-single-avatar/image-audio-to-video) — Longcat Single Avatar Image Audio To Video by sandbase-ai - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [LongCat Video](/model-api-reference/video-generation/meituan/longcat-video/text-to-video/720p) — Longcat Video 720p by meituan - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [LongCat Video](/model-api-reference/video-generation/meituan/longcat-video/image-to-video) — Longcat Video is meituan's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [LongCat Video](/model-api-reference/video-generation/meituan/longcat-video/image-to-video-480p) — Longcat Video Image To Video 480p is meituan's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [LongCat Video](/model-api-reference/video-generation/meituan/longcat-video/text-to-video/480p) — Longcat Video 480p by meituan - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [LongCat Video Distilled](/model-api-reference/video-generation/meituan/longcat-video/distilled/image-to-video) — Longcat Video Distilled is meituan's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [LongCat Video Distilled](/model-api-reference/video-generation/meituan/longcat-video/distilled/text-to-video-720p) — Longcat Video Distilled Text To Video 720p by sandbase-ai - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [LongCat Video Distilled](/model-api-reference/video-generation/meituan/longcat-video/distilled/image-to-video-480p) — Longcat Video Distilled Image To Video 480p is meituan's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [LongCat Video Distilled](/model-api-reference/video-generation/meituan/longcat-video/distilled/text-to-video/480p) — Longcat Video Distilled 480p by meituan - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.

### Meta

- [SAM 3.1 Video](/model-api-reference/video-generation/meta/sam-3-1/video-rle) — Sam 3 1 Video Rle is Meta's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Sam 3](/model-api-reference/video-generation/meta/sam-3/video) — Sam 3 Video is Meta's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### NVIDIA

- [Cosmos 3 Super Image to Video](/model-api-reference/video-generation/nvidia/cosmos-3-super/image-to-video) — Cosmos 3 Super is NVIDIA's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.

### Pixelcut

- [Pixelcut Video Background Removal](/model-api-reference/video-generation/pixelcut/video-background-removal) — Video Background Removal by Pixelcut - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.

### PixVerse

- [PixVerse C1 Reference to Video](/model-api-reference/video-generation/pixverse/c1/reference-to-video) — C1 is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse C1 Text to Video](/model-api-reference/video-generation/pixverse/c1/text-to-video) — C1 by PixVerse - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [PixVerse C1 Image to Video](/model-api-reference/video-generation/pixverse/c1/image-to-video) — C1 is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse C1 Transition](/model-api-reference/video-generation/pixverse/c1/transition) — C1 Transition is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse V6 Transition](/model-api-reference/video-generation/pixverse/v6/transition) — V6 Transition is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse V6 Image to Video](/model-api-reference/video-generation/pixverse/v6/image-to-video) — V6 is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse V6 Text to Video](/model-api-reference/video-generation/pixverse/v6/text-to-video) — V6 by PixVerse - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [PixVerse V5.6 Transition](/model-api-reference/video-generation/pixverse/v5.6/transition) — V5.6 Transition is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse V5.6 Image to Video](/model-api-reference/video-generation/pixverse/v5.6/image-to-video) — V5.6 is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse V5.6 Text to Video](/model-api-reference/video-generation/pixverse/v5.6/text-to-video) — V5.6 by PixVerse - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [PixVerse V5.5 Effects](/model-api-reference/video-generation/pixverse/v5.5/effects) — V5.5 Effects by PixVerse - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [PixVerse V5.5 Transition](/model-api-reference/video-generation/pixverse/v5.5/transition) — V5.5 Transition is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- …and 28 more models in the sidebar.

### Sonilo

- [V1.1 Video to Video Music](/model-api-reference/video-generation/sonilo/1.1/video-to-video-music) — 1.1 Video To Video Music by Sonilo - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [V1.1 Video to Video Sound Effects](/model-api-reference/video-generation/sonilo/1.1/video-to-video-sound-effects) — 1.1 Video To Video Sound Effects by Sonilo - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.

### Stability AI

- [Stable Avatar](/model-api-reference/video-generation/stability-ai/stable-avatar) — Stable Avatar by stability-ai - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [High Quality Stable Video Diffusion](/model-api-reference/video-generation/stability-ai/stable-video) — Stable Video by Stability AI - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.

### Sync Labs

- [sync-3 Avatar Image to Video](/model-api-reference/video-generation/sync/sync-lipsync/3.0/image-to-video) — Sync Lipsync 3.0 is Sync Labs's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.

### Tencent

- [Hunyuan Video 1.5 Image to Video](/model-api-reference/video-generation/tencent/hunyuan-video/1.5/image-to-video) — Hunyuan Video 1.5 by Tencent - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Hunyuan Video 1.5 Text to Video](/model-api-reference/video-generation/tencent/hunyuan-video/1.5/text-to-video) — Hunyuan Video 1.5 is Tencent's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Hunyuan Video Foley](/model-api-reference/video-generation/tencent/hunyuan-video/foley) — Hunyuan Video Foley is Tencent's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Hunyuan Avatar](/model-api-reference/video-generation/tencent/hunyuan-avatar) — Hunyuan Avatar by Tencent - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Hunyuan Portrait](/model-api-reference/video-generation/tencent/hunyuan-portrait) — Hunyuan Portrait by Tencent - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Hunyuan Custom](/model-api-reference/video-generation/tencent/hunyuan-custom) — Hunyuan Custom by Tencent - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Hunyuan Video Image to Video](/model-api-reference/video-generation/tencent/hunyuan-video/image-to-video) — Hunyuan Video by Tencent - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Hunyuan Video Video to Video](/model-api-reference/video-generation/tencent/hunyuan-video/video-to-video) — Hunyuan Video Video To Video by Tencent - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [Hunyuan Video LoRA Inference](/model-api-reference/video-generation/tencent/hunyuan-video-lora) — Hunyuan Video Lora by Tencent - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Hunyuan Video Text to Video](/model-api-reference/video-generation/tencent/hunyuan-video/text-to-video) — Hunyuan Video is Tencent's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.

### Topaz Labs

- [Topaz Video Upscale](/model-api-reference/video-generation/topaz/upscale/video) — Upscale Video is Topaz Labs's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### Vidu

- [Vidu Q3 Reference to Video Mix](/model-api-reference/video-generation/vidu/q3/reference-to-video/mix) — Vidu Q3 Mix by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q3 Image to Video Turbo](/model-api-reference/video-generation/vidu/q3/image-to-video/turbo) — Vidu Q3 Turbo by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q3 Text to Video Turbo](/model-api-reference/video-generation/vidu/q3/text-to-video/turbo) — Vidu Q3 Turbo is Shengshu's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Vidu Q3 Image to Video](/model-api-reference/video-generation/vidu/q3/image-to-video) — Vidu Q3 by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q3 Text to Video](/model-api-reference/video-generation/vidu/q3/text-to-video) — Vidu Q3 is Shengshu's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Vidu Q2 Reference to Video Pro](/model-api-reference/video-generation/vidu/q2/reference-to-video/pro) — Vidu Q2 Pro by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q2 Video Extension Pro](/model-api-reference/video-generation/vidu/q2/video-extension/pro) — Vidu Q2 Video Extension is Shengshu's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Vidu Q2 Image to Video Turbo](/model-api-reference/video-generation/vidu/q2/image-to-video/turbo) — Vidu Q2 Turbo by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q2 Image to Video Pro](/model-api-reference/video-generation/vidu/q2/image-to-video/pro) — Vidu Q2 Pro by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q2 Text to Video](/model-api-reference/video-generation/vidu/q2/text-to-video) — Vidu Q2 is Shengshu's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Vidu Q1 Reference to Video](/model-api-reference/video-generation/vidu/q1/reference-to-video) — Vidu Q1 by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q1 Start-End to Video](/model-api-reference/video-generation/vidu/q1/start-end-to-video) — Vidu Q1 Start End To Video by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- …and 6 more models in the sidebar.

### xAI

- [Grok Imagine Video 1.5](/model-api-reference/video-generation/xai/grok-imagine-video/1.5/image-to-video) — Grok Imagine Video 1.5 is xAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Grok Imagine Video Reference to Video](/model-api-reference/video-generation/xai/grok-imagine-video/reference-to-video) — Grok Imagine Video is xAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Grok Imagine Video](/model-api-reference/video-generation/xai/grok-imagine-video/image-to-video) — Grok Imagine Video is xAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Grok Imagine Video](/model-api-reference/video-generation/xai/grok-imagine-video/text-to-video) — Grok Imagine Video by xAI - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.

## Capability coverage

`audio-to-video`, `edit-video`, `first-last-frame-to-video`, `image-to-video`, `reference-to-video`, `text-to-video`, `video-regeneration`, `video-to-video`
