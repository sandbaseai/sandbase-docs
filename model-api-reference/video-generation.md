---
title: Video Generation
description: Browse SandBase Video Generation APIs by provider and open a model page for its exact request format.
---

# Video Generation

Browse enabled video generation models by provider in the left navigation. Open an entry for its exact model identifier, supported capabilities, and a working request.

Video Generation models use the SandBase generation protocol declared in each model registry file. Most are asynchronous: submit a request, receive an opaque run ID, then poll GET /v1/run/{id} until the generation is completed, failed, or timed out. Check the selected model page's execution mode because synchronous models return their result in the initial response.

## Providers

### ByteDance

- [Seedance 2.5 Text to Video](/model-api-reference/video-generation/bytedance/seedance/2.5/text-to-video) — ByteDance's next-generation text-to-video model, generating native single-shot clips up to 30 seconds at 720p with coherent motion, native audio, and director-level camera control for professional-grade video creation.
- [Seedance 2.5 Image to Video](/model-api-reference/video-generation/bytedance/seedance/2.5/image-to-video) — ByteDance's next-generation image-to-video model, animating a single still into a native clip up to 30 seconds at 720p with continuous, coherent motion, native audio, and director-level camera control.
- [Seedance 2.5 Reference to Video](/model-api-reference/video-generation/bytedance/seedance/2.5/reference-to-video) — ByteDance's next-generation reference-to-video model, generating video from multimodal references (images, videos, audio) and locking a character, set, and palette across a full take up to 30 seconds for production-grade consistency.
- [Seedance 2.0 Mini Reference to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/mini/reference-to-video) — Seedance 2.0 Mini by ByteDance - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Seedance 2.0 Mini Image to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/mini/image-to-video) — Seedance 2.0 Mini by ByteDance - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Seedance 2.0 Mini Text to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/mini/text-to-video) — Seedance 2.0 Mini is ByteDance's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Seedance 2.0 Text to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/text-to-video) — ByteDance's most advanced text-to-video model delivering cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Reference to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/reference-to-video) — ByteDance's most advanced reference-to-video model generating cinematic video guided by reference content, with native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Fast Text to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/fast/text-to-video) — ByteDance's most advanced text-to-video model in its fast tier delivering lower latency and cost without compromising on cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Image to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/image-to-video) — ByteDance's most advanced image-to-video model transforming still images into cinematic video with native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Fast Reference to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/fast/reference-to-video) — ByteDance's most advanced reference-to-video model in its fast tier delivering lower latency and cost without compromising on cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- [Seedance 2.0 Fast Image to Video](/model-api-reference/video-generation/bytedance/seedance/2.0/fast/image-to-video) — ByteDance's most advanced image-to-video model in its fast tier delivering lower latency and cost without compromising on cinematic output, native audio, multi-shot editing, and director-level camera control for professional-grade video creation.
- …and 4 more models in the sidebar.

### Google

- [Gemini Omni Flash 1.1 Edit](/model-api-reference/video-generation/google/gemini-omni-flash/1.1/edit) — Gemini Omni Flash 1.1 Edit by Google applies natural-language edits to an existing video of up to ten seconds, such as changing style, lighting, or objects, at 360p to 4K output.
- [Gemini Omni Flash 1.1 Text to Video](/model-api-reference/video-generation/google/gemini-omni-flash/1.1/text-to-video) — Gemini Omni Flash 1.1 is Google's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Gemini Omni Flash 1.1 Image to Video](/model-api-reference/video-generation/google/gemini-omni-flash/1.1/image-to-video) — Gemini Omni Flash 1.1 by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Gemini Omni Flash 1.1 Reference to Video](/model-api-reference/video-generation/google/gemini-omni-flash/1.1/reference-to-video) — Gemini Omni Flash 1.1 Reference to Video by Google generates a short video with synchronized audio guided by up to ten reference images and up to three short reference videos.
- [Gemini Omni Flash Reference to Video](/model-api-reference/video-generation/google/gemini-omni-flash/reference-to-video) — Gemini Omni Flash Reference to Video by Google generates a short video with synchronized audio that keeps subjects, products, or style consistent with up to ten reference images.
- [Gemini Omni Flash Image to Video](/model-api-reference/video-generation/google/gemini-omni-flash/image-to-video) — Gemini Omni Flash by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Gemini Omni Flash Edit](/model-api-reference/video-generation/google/gemini-omni-flash/edit) — Gemini Omni Flash Edit by Google applies natural-language edits to an existing short video, such as changing style, lighting, or objects, while keeping the rest of the scene consistent.
- [Gemini Omni Flash Text to Video](/model-api-reference/video-generation/google/gemini-omni-flash/text-to-video) — Gemini Omni Flash is Google's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Veo 3.1 Fast Reference to Video](/model-api-reference/video-generation/google/veo3.1/fast/reference-to-video) — Veo3.1 Fast by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Veo 3.1 Lite First-Last Frame to Video](/model-api-reference/video-generation/google/veo3.1/lite/first-last-frame-to-video) — Veo3.1 Lite First Last Frame To Video is Google's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Veo 3.1 Lite Image to Video](/model-api-reference/video-generation/google/veo3.1/lite/image-to-video) — Veo3.1 Lite by Google - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Veo 3.1 Lite Text to Video](/model-api-reference/video-generation/google/veo3.1/lite/text-to-video) — Veo3.1 Lite is Google's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- …and 9 more models in the sidebar.

### Luma

- [Luma Ray 3.2 Text to Video](/model-api-reference/video-generation/luma/ray/3.2/text-to-video) — Agent Ray 3.2 is Luma's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Luma Ray 3.2 Image to Video](/model-api-reference/video-generation/luma/ray/3.2/image-to-video) — Agent Ray 3.2 by Luma - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.

### MiniMax

- [MiniMax H3 Max Turbo Video Extend](/model-api-reference/video-generation/minimax/h3-max-turbo/video-extend) — MiniMax H3 Max Turbo, the fastest tier of the H3 family post-trained by fal, continues an existing video with 1-15 seconds of new footage with native audio.
- [MiniMax H3 Max Turbo Text to Video](/model-api-reference/video-generation/minimax/h3-max-turbo/text-to-video) — MiniMax H3 Max Turbo, the fastest tier of the H3 family post-trained by fal, turns a text prompt into a 5-15 second video with native audio.
- [MiniMax H3 Max Turbo Image to Video](/model-api-reference/video-generation/minimax/h3-max-turbo/image-to-video) — MiniMax H3 Max Turbo, the fastest tier of the H3 family post-trained by fal, animates a first frame (and optional last frame) into a 5-15 second video with native audio.
- [MiniMax H3 Max Reference to Video](/model-api-reference/video-generation/minimax/h3-max/reference-to-video) — MiniMax H3 Max by MiniMax generates a 5-15 second video with native audio at 480P or 768P that keeps subjects, motion, and voice consistent with reference images, videos, and audio.
- [MiniMax H3 Max Image to Video](/model-api-reference/video-generation/minimax/h3-max/image-to-video) — MiniMax H3 Max by MiniMax animates a first frame, optionally toward a last frame, into a 5-15 second video with native audio at 480P or 768P.
- [MiniMax H3 Max Text to Video](/model-api-reference/video-generation/minimax/h3-max/text-to-video) — MiniMax H3 Max by MiniMax turns a text prompt into a 5-15 second video with native audio at 480P or 768P, generating faster than MiniMax H3.
- [MiniMax H3 Text to Video](/model-api-reference/video-generation/minimax/h3/text-to-video) — Generate native-stereo 2K video from text with MiniMax H3.
- [MiniMax H3 Image to Video](/model-api-reference/video-generation/minimax/h3/image-to-video) — Generate native-stereo 2K video from a first frame and optional last frame with MiniMax H3.
- [MiniMax H3 Reference to Video](/model-api-reference/video-generation/minimax/h3/reference-to-video) — Generate native-stereo 2K video guided by image, video, and audio references with MiniMax H3.
- [MiniMax Hailuo 2.3 Pro Image to Video](/model-api-reference/video-generation/minimax/hailuo/2.3/pro/image-to-video) — MiniMax Hailuo 2.3 Pro by MiniMax animates a still image into a 6-second 1080P video with realistic motion and expressive characters.
- [MiniMax Hailuo 2.3 Fast Standard Image to Video](/model-api-reference/video-generation/minimax/hailuo/2.3-fast/standard/image-to-video) — MiniMax Hailuo 2.3 Fast Standard by MiniMax animates a still image into a 6 or 10 second 768P video at lower cost and latency than Hailuo 2.3 Standard.
- [MiniMax Hailuo 2.3 Standard Image to Video](/model-api-reference/video-generation/minimax/hailuo/2.3/standard/image-to-video) — MiniMax Hailuo 2.3 Standard by MiniMax animates a still image into a 6 or 10 second 768P video with realistic motion.
- …and 3 more models in the sidebar.

### VEED

- [VEED Lipsync 2.0](/model-api-reference/video-generation/veed/lipsync/2.0) — VEED Lipsync 2.0 makes the person in a video articulate a new audio track.

### Alibaba

- [Wan 2.7 Video Edit](/model-api-reference/video-generation/alibaba/wan/2.7/video-edit) — Alibaba Wan 2.7 video editing model.
- [Wan 2.7 Video Extend](/model-api-reference/video-generation/alibaba/wan/2.7/video-extend) — Alibaba Wan 2.7 Video Extend continues an input clip from a text instruction, optionally ending on a chosen last frame, for a total length of up to 15 seconds.
- [Wan 3.0 Video Edit](/model-api-reference/video-generation/alibaba/wan/3.0/video-edit) — Wan 3.0 Video Edit by Alibaba restyles or modifies an input video from a text instruction, optionally guided by reference images and audio, keeping the original length.
- [Wan 3.0 Video Extend](/model-api-reference/video-generation/alibaba/wan/3.0/video-extend) — Wan 3.0 Video Extend by Alibaba continues an input video forward from a text instruction, optionally guided by reference images and audio, with native audio.
- [Wan 3.0 Prime Video Edit](/model-api-reference/video-generation/alibaba/wan/3.0/prime/video-edit) — Wan 3.0 Prime Video Edit by Alibaba restyles or modifies an input video from a text instruction, optionally guided by reference images and audio, keeping the original length.
- [Wan 3.0 Prime Video Extend](/model-api-reference/video-generation/alibaba/wan/3.0/prime/video-extend) — Wan 3.0 Prime Video Extend by Alibaba continues an input video forward from a text instruction, optionally guided by reference images and audio, with native audio.
- [Wan 3.0 Prime Text to Video](/model-api-reference/video-generation/alibaba/wan/3.0/prime/text-to-video) — Wan 3.0 Prime by Alibaba turns a text prompt into a video of up to 30 seconds at 30fps, with native dialogue, music, and sound effects.
- [Wan 3.0 Prime Reference to Video](/model-api-reference/video-generation/alibaba/wan/3.0/prime/reference-to-video) — Wan 3.0 Prime by Alibaba generates up to 30-second videos with native audio from reference images, videos, and audio, keeping subjects, motion, and voice consistent with the references.
- [Wan 3.0 Prime Video](/model-api-reference/video-generation/alibaba/wan/3.0/prime/video) — Alibaba Wan 3.0 Prime Video generates videos up to 30 seconds with native audio from text, a first/last frame, or reference images, videos, and audio.
- [Wan 3.0 Prime Image to Video](/model-api-reference/video-generation/alibaba/wan/3.0/prime/image-to-video) — Wan 3.0 Prime by Alibaba - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Wan 3.0 Reference to Video](/model-api-reference/video-generation/alibaba/wan/3.0/reference-to-video) — Wan 3.0 by Alibaba generates up to 30-second videos with native audio from reference images, videos, and audio, keeping subjects, motion, and voice consistent with the references.
- [Wan 3.0 Image to Video](/model-api-reference/video-generation/alibaba/wan/3.0/image-to-video) — Wan 3.0 by Alibaba - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- …and 23 more models in the sidebar.

### BFL

- [Flux 3 Text to Video](/model-api-reference/video-generation/bfl/flux-3/text-to-video) — Flux 3 by BFL - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Flux 3 Image to Video](/model-api-reference/video-generation/bfl/flux-3/image-to-video) — Flux 3 is BFL's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.

### ElevenLabs

- [ElevenLabs Dubbing](/model-api-reference/video-generation/elevenlabs/dubbing) — ElevenLabs Dubbing translates the speech in a video into another language while preserving each speaker's voice, timing, and background audio.

### HeyGen

- [HeyGen Avatar 5 Digital Twin](/model-api-reference/video-generation/heygen/avatar5/digital-twin) — Avatar5 Digital Twin by HeyGen - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [HeyGen Video Agent V3](/model-api-reference/video-generation/heygen/video-agent/v3) — Heygen Video Agent V3 is HeyGen's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [HeyGen Lipsync Precision](/model-api-reference/video-generation/heygen/lipsync/precision) — HeyGen v3 Lipsync (precision) replaces the speech in a video and re-syncs the speaker's lips to the new audio.
- [HeyGen Lipsync Speed](/model-api-reference/video-generation/heygen/lipsync/speed) — HeyGen v3 Lipsync (speed) replaces the speech in a video and re-syncs the speaker's lips to the new audio.
- [HeyGen Avatar 4 Image to Video](/model-api-reference/video-generation/heygen/heygen-avatar4/image-to-video) — Heygen Avatar4 is HeyGen's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.

### KwaiVGI

- [Kling O3 4K Video Edit](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/edit) — Kling O3 4K Video Edit by Kuaishou edits an input video from a text instruction, optionally guided by reference images, at native 4K.
- [Kling O3 4K Video Reference](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/video-to-video) — Kling O3 4K Video Reference by Kuaishou generates a new native 4K shot that follows the style and camera motion of a reference video, optionally guided by reference images.
- [Kling O3 4K Reference to Video](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/reference-to-video) — Kling O3 4K Reference to Video by Kuaishou generates a 3-15 second native 4K video that keeps characters and objects from reference images consistent with optional native audio.
- [Kling O3 4K Image to Video](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/image-to-video) — Kling O3 4K Image to Video by Kuaishou animates a start image, optionally toward an end image, into a 3-15 second native 4K video with optional native audio.
- [Kling O3 4K Text to Video](/model-api-reference/video-generation/kwaivgi/kling-video/o3/4k/text-to-video) — Kling O3 4K Text to Video by Kuaishou turns a text prompt into a 3-15 second native 4K video with optional native audio.
- [Kling V3 4K Image to Video](/model-api-reference/video-generation/kwaivgi/kling-video/v3/4k/image-to-video) — Kling V3 4K Image to Video by Kuaishou animates a start image, optionally toward an end image, into a 3-15 second native 4K video with optional native audio.
- [Kling V3 4K Text to Video](/model-api-reference/video-generation/kwaivgi/kling-video/v3/4k/text-to-video) — Kling V3 4K Text to Video by Kuaishou turns a text prompt into a 3-15 second native 4K video with optional native audio.
- [Kling V3 Standard Motion Control](/model-api-reference/video-generation/kwaivgi/kling-video/v3/standard/motion-control) — Kling V3 Standard Motion Control by Kuaishou transfers the motion, expressions, and camera movement of a reference video onto the character in an image, producing a 720p video up to 30 seconds.
- [Kling V3 Pro Motion Control](/model-api-reference/video-generation/kwaivgi/kling-video/v3/pro/motion-control) — Kling V3 Pro Motion Control by Kuaishou transfers the motion, expressions, and camera movement of a reference video onto the character in an image, producing a 1080p video up to 30 seconds.
- [Kling O3 Pro Text to Video](/model-api-reference/video-generation/kwaivgi/kling-video/o3/pro/text-to-video) — Kling O3 Pro Text to Video by Kuaishou turns a text prompt into a 3-15 second 1080p video with optional native audio.
- [Kling O3 Standard Text to Video](/model-api-reference/video-generation/kwaivgi/kling-video/o3/standard/text-to-video) — Kling O3 Standard Text to Video by Kuaishou turns a text prompt into a 3-15 second 720p video with optional native audio.
- [Kling O3 Pro Image to Video](/model-api-reference/video-generation/kwaivgi/kling-video/o3/pro/image-to-video) — Kling O3 Pro Image to Video by Kuaishou animates a start image, optionally toward an end image, into a 3-15 second 1080p video with optional native audio.
- …and 26 more models in the sidebar.

### Lightricks

- [LTX 2.3 Fast Image to Video](/model-api-reference/video-generation/lightricks/ltx-2.3-fast/image-to-video) — Ltx 2.3 Fast is Lightricks's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [LTX 2.3 Fast Text to Video](/model-api-reference/video-generation/lightricks/ltx-2.3-fast/text-to-video) — Ltx 2.3 Fast by Lightricks - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [LTX 2.3 Pro Image to Video](/model-api-reference/video-generation/lightricks/ltx-2.3-pro/image-to-video) — Ltx 2.3 Pro by Lightricks - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [LTX 2.3 Pro Text to Video](/model-api-reference/video-generation/lightricks/ltx-2.3-pro/text-to-video) — Ltx 2.3 Pro is Lightricks's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [LTX 2.3 Pro Retake](/model-api-reference/video-generation/lightricks/ltx-2.3-pro/retake) — Ltx 2.3 Pro Retake by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.
- [LTX 2.3 Pro Audio to Video](/model-api-reference/video-generation/lightricks/ltx-2.3-pro/audio-to-video) — Ltx 2.3 Pro Audio To Video by Lightricks - advanced AI model for audio-to-video. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [LTX 2.3 Pro Video Extend](/model-api-reference/video-generation/lightricks/ltx-2.3-pro/video-extend) — Ltx 2.3 Pro Extend by Lightricks - AI-powered video editing and transformation. Apply style transfer, motion control, lip-sync, and visual effects to existing videos with natural language instructions.

### MeiGen-AI

- [InfiniteTalk Video to Video](/model-api-reference/video-generation/meigen/infinitetalk/video-to-video) — InfiniteTalk dubs an existing video: it re-animates lips, face and body to match new speech audio.
- [InfiniteTalk Text to Video](/model-api-reference/video-generation/meigen/infinitetalk/text-to-video) — InfiniteTalk speaks the given text with a chosen voice and animates the portrait into a talking video.
- [InfiniteTalk Image to Video](/model-api-reference/video-generation/meigen/infinitetalk/image-to-video) — InfiniteTalk turns a portrait image and speech audio into a long-form talking video with natural lip sync, head and body motion.

### PixVerse

- [PixVerse C1 Image to Video](/model-api-reference/video-generation/pixverse/c1/image-to-video) — C1 is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [PixVerse V6 Image to Video](/model-api-reference/video-generation/pixverse/v6/image-to-video) — V6 is PixVerse's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.

### Sync Labs

- [Sync 3 Avatar Image to Video](/model-api-reference/video-generation/sync/lipsync/3.0/image-to-video) — Sync 3 animates the face in a still image so it speaks the provided audio; the output matches the audio length.
- [Sync 3 Lipsync](/model-api-reference/video-generation/sync/lipsync/3.0/video-to-video) — Sync 3 by sync. re-animates the speaker's lips in an existing video to match new audio, with studio-grade identity preservation.

### Tencent

- [Hunyuan Video 1.5 Text to Video](/model-api-reference/video-generation/tencent/hunyuan-video/1.5/text-to-video) — Hunyuan Video 1.5 is Tencent's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.

### Topaz Labs

- [Topaz Video Upscale](/model-api-reference/video-generation/topaz/upscale/video) — Upscale Video is Topaz Labs's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.

### Vidu

- [Vidu Q4 Image to Video](/model-api-reference/video-generation/vidu/q4/image-to-video) — Vidu Q4 Preview by Shengshu animates a first-frame image into a 3 to 16 second video at up to 4K. Prompts can direct motion, camera cuts, and spoken dialogue, with native speech and sound effects.
- [Vidu Q4 Reference to Video](/model-api-reference/video-generation/vidu/q4/reference-to-video) — Vidu Q4 Preview by Shengshu builds a 3 to 16 second video at up to 4K from up to 12 reference images and 3 voice clips, keeping characters, products, and voices consistent across the clip.
- [Vidu Q3 Reference to Video Mix](/model-api-reference/video-generation/vidu/q3/reference-to-video/mix) — Vidu Q3 Mix by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q3 Image to Video Turbo](/model-api-reference/video-generation/vidu/q3/image-to-video/turbo) — Vidu Q3 Turbo by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q3 Text to Video Turbo](/model-api-reference/video-generation/vidu/q3/text-to-video/turbo) — Vidu Q3 Turbo is Shengshu's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.
- [Vidu Q3 Image to Video](/model-api-reference/video-generation/vidu/q3/image-to-video) — Vidu Q3 by Shengshu - animate still images into dynamic videos with AI. Transform photos into cinematic clips with natural motion, camera movement, and optional audio generation.
- [Vidu Q3 Text to Video](/model-api-reference/video-generation/vidu/q3/text-to-video) — Vidu Q3 is Shengshu's text-to-video AI model. Turn written scripts and prompts into professional-quality video clips with realistic motion, lighting, and scene composition.

### xAI

- [Grok Imagine Video 1.5 Lite Image to Video](/model-api-reference/video-generation/xai/grok-imagine-video/1.5/lite/image-to-video) — Grok Imagine Video 1.5 Lite, the low-cost tier of xAI's video model, animates an image into a 1-15 second video with native audio.
- [Grok Imagine Video 1.5 Lite Text to Video](/model-api-reference/video-generation/xai/grok-imagine-video/1.5/lite/text-to-video) — Grok Imagine Video 1.5 Lite, the low-cost tier of xAI's video model, turns a text prompt into a 1-15 second video with native audio.
- [Grok Imagine Video 1.5 Reference to Video](/model-api-reference/video-generation/xai/grok-imagine-video/1.5/reference-to-video) — Grok Imagine Video 1.5 is xAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Grok Imagine Video 1.5 Text to Video](/model-api-reference/video-generation/xai/grok-imagine-video/1.5/text-to-video) — Grok Imagine Video 1.5 by xAI - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.
- [Grok Imagine Video 1.5 Image to Video](/model-api-reference/video-generation/xai/grok-imagine-video/1.5/image-to-video) — Grok Imagine Video 1.5 is xAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Grok Imagine Video Reference to Video](/model-api-reference/video-generation/xai/grok-imagine-video/reference-to-video) — Grok Imagine Video is xAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Grok Imagine Video Extend](/model-api-reference/video-generation/xai/grok-imagine-video/video-extend) — Grok Imagine Video Extend is xAI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Grok Imagine Video Edit](/model-api-reference/video-generation/xai/grok-imagine-video/video-edit) — Grok Imagine Video Edit is xAI's video-to-video AI model. Transform, enhance, and edit video content using text prompts - from style changes to object manipulation and scene modification.
- [Grok Imagine Video Image to Video](/model-api-reference/video-generation/xai/grok-imagine-video/image-to-video) — Grok Imagine Video is xAI's image-to-video AI model. Bring static images to life with fluid animation, consistent character motion, and professional-grade video output.
- [Grok Imagine Video Text to Video](/model-api-reference/video-generation/xai/grok-imagine-video/text-to-video) — Grok Imagine Video by xAI - generate cinematic videos from text descriptions with AI. Create high-quality video content with natural motion, camera control, and optional audio generation.

## Capability coverage

`audio-to-video`, `coming-soon`, `first-last-frame-to-video`, `image-to-video`, `reference-to-video`, `text-to-video`, `video-to-video`
