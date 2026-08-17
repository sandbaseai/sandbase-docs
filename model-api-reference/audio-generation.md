---
title: Audio Generation
description: Browse SandBase Audio Generation APIs by provider and open a model page for its exact request format.
---

# Audio Generation

SandBase currently publishes API reference pages for 49 enabled audio generation models across 12 providers. Choose a provider in the left navigation, then open a model page for its exact API identifier, supported capabilities, and a working request.

Audio Generation models use the async SandBase generation protocol declared in each model registry file. Submit a request, receive a task id, then poll the result endpoint until the generation is completed, failed, or timed out.

## Providers

### OpenAI

- [Wizper (Whisper v3)](/model-api-reference/audio-generation/openai/wizper) — Wizper by OpenAI - accurate speech-to-text transcription with AI. Convert audio and video to text with high accuracy, multilingual support, and speaker identification.

### ElevenLabs

- [Voice Changer](/model-api-reference/audio-generation/elevenlabs/voice-changer) — Voice Changer by ElevenLabs - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Scribe V2](/model-api-reference/audio-generation/elevenlabs/scribe-v2) — Scribe V2 is ElevenLabs's speech recognition model. Transcribe audio content with industry-leading accuracy across multiple languages and accents.
- [Music](/model-api-reference/audio-generation/elevenlabs/music) — Music is ElevenLabs's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.
- [Text To Dialogue](/model-api-reference/audio-generation/elevenlabs/text-to-dialogue) — Text To Dialogue by ElevenLabs - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [Sound Effects V2](/model-api-reference/audio-generation/elevenlabs/sound-effects-v2) — Sound Effects V2 by ElevenLabs - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [V3](/model-api-reference/audio-generation/elevenlabs/v3) — V3 by ElevenLabs - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [Turbo V2.5](/model-api-reference/audio-generation/elevenlabs/turbo-v2.5) — Turbo V2.5 by ElevenLabs - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.
- [Multilingual V2](/model-api-reference/audio-generation/elevenlabs/multilingual-v2) — Multilingual V2 is ElevenLabs's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.
- [ElevenLabs Audio Isolation](/model-api-reference/audio-generation/elevenlabs/audio-isolation) — Audio Isolation by ElevenLabs - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### Google

- [Gemini 3.1 Flash Tts](/model-api-reference/audio-generation/google/gemini-3.1-flash-tts) — Gemini 3.1 Flash Tts by Google - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.
- [Gemini TTS](/model-api-reference/audio-generation/google/gemini-tts) — Gemini TTS by Google - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.
- [Lyria2](/model-api-reference/audio-generation/google/lyria-2) — Lyria 2 is Google's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.

### MiniMax

- [MiniMax Music 2.5](/model-api-reference/audio-generation/minimax/music/2.5) — MiniMax Music 2.5 text-to-music model with lyrics support, instrumental generation, and configurable audio output.
- [MiniMax Music 2.6](/model-api-reference/audio-generation/minimax/music/2.6) — MiniMax Music 2.6 text-to-music model with enhanced quality, lyrics support, instrumental generation, and configurable audio output.
- [MiniMax Speech 2.8 HD](/model-api-reference/audio-generation/minimax/speech/2.8/hd) — MiniMax Speech 2.8 HD text-to-speech model with high-definition voice synthesis, enhanced expressiveness, 40+ language support, and voice cloning.
- [MiniMax Speech 2.8 Turbo](/model-api-reference/audio-generation/minimax/speech/2.8/turbo) — MiniMax Speech 2.8 Turbo text-to-speech model with fast voice synthesis, enhanced expressiveness, 40+ language support, and voice cloning.
- [Minimax Music](/model-api-reference/audio-generation/minimax/music/v2) — Music V2 by MiniMax - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [MiniMax Speech 2.6 Turbo](/model-api-reference/audio-generation/minimax/speech/2.6/turbo) — MiniMax Speech 2.6 Turbo text-to-speech model with fast voice synthesis, 40+ language support, voice cloning, and expressive emotion control.
- [MiniMax Speech 2.6 HD](/model-api-reference/audio-generation/minimax/speech/2.6/hd) — MiniMax Speech 2.6 HD text-to-speech model with high-definition voice synthesis, 40+ language support, voice cloning, and expressive emotion control.
- [MiniMax (Hailuo AI) Music v1.5](/model-api-reference/audio-generation/minimax/music/v1.5) — Music V1.5 by MiniMax - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [Minimax](/model-api-reference/audio-generation/minimax/preview/speech-2.5-hd) — Preview Speech 2.5 Hd is MiniMax's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.
- [MiniMax Speech 2.5 Turbo](/model-api-reference/audio-generation/minimax/preview/speech-2.5-turbo) — Preview Speech 2.5 Turbo by MiniMax - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.
- [MiniMax Voice Design](/model-api-reference/audio-generation/minimax/voice-design) — Voice Design by MiniMax - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.
- [MiniMax Voice Cloning](/model-api-reference/audio-generation/minimax/voice-clone) — Voice Clone is MiniMax's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.
- …and 3 more models in the sidebar.

### Mirelo

- [Mirelo SFX1.6](/model-api-reference/audio-generation/mirelo/sfx1.6/text-to-audio) — Sfx1.6 by Mirelo - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.

### stability-ai

- [Stable Audio 2.5 Audio to Audio](/model-api-reference/audio-generation/stability-ai/stable-audio/2.5/audio-to-audio) — Stable Audio 2.5 Audio To Audio by stability-ai - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Stable Audio 2.5 Text to Audio](/model-api-reference/audio-generation/stability-ai/stable-audio/2.5/text-to-audio) — Stable Audio 2.5 by stability-ai - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [Stable Audio 2.5 Inpaint](/model-api-reference/audio-generation/stability-ai/stable-audio/2.5/inpaint) — Stable Audio 2.5 Inpaint by stability-ai - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Stable Audio Open](/model-api-reference/audio-generation/stability-ai/stable-audio/open) — Stable Audio Open is stability-ai's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.

### Alibaba

- [Qwen 3 TTS - Voice Design [1.7B]](/model-api-reference/audio-generation/alibaba/qwen-3-tts/voice-design/1.7b) — Qwen 3 Tts Voice Design 1.7b by Alibaba - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.
- [Qwen 3 TTS - Text to Speech [1.7B]](/model-api-reference/audio-generation/alibaba/qwen-3-tts/1.7b) — Qwen 3 Tts 1.7b is Alibaba's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.
- [Qwen 3 TTS - Text to Speech [0.6B]](/model-api-reference/audio-generation/alibaba/qwen-3-tts/0.6b) — Qwen 3 Tts 0.6b is Alibaba's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.
- [Qwen 3 TTS - Clone Voice [1.7B]](/model-api-reference/audio-generation/alibaba/qwen-3-tts/clone-voice/1.7b) — Qwen 3 Tts Clone Voice 1.7b by Alibaba - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Qwen 3 TTS - Clone Voice [0.6B]](/model-api-reference/audio-generation/alibaba/qwen-3-tts/clone-voice/0.6b) — Qwen 3 Tts Clone Voice 0.6b by Alibaba - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.

### ace

- [ACE-Step Audio Outpaint](/model-api-reference/audio-generation/ace/ace-step/audio-outpaint) — Ace Step Audio Outpaint by ace - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [ACE-Step](/model-api-reference/audio-generation/ace/ace-step/audio-inpaint) — Ace Step Audio Inpaint by ace - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [ACE-Step](/model-api-reference/audio-generation/ace/ace-step/audio-to-audio) — Ace Step Audio To Audio by ace - advanced AI model for audio-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [ACE-Step](/model-api-reference/audio-generation/ace/ace-step/prompt-to-audio) — Ace Step Prompt To Audio by ace - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [ACE-Step](/model-api-reference/audio-generation/ace/ace-step) — Ace Step by ace - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.

### Bytedance

- [Bytedance Seed Speech Text to Speech](/model-api-reference/audio-generation/bytedance/seed-speech/tts/2.0) — Seed Speech Tts 2.0 is Bytedance's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.

### KwaiVGI

- [Kling Video](/model-api-reference/audio-generation/kwaivgi/kling-video/video-to-audio) — Kling Video Video To Audio by KwaiVGI - advanced AI model for video-to-audio. Delivers high-quality results with fast inference, suitable for both creative and production workflows.
- [Kling TTS](/model-api-reference/audio-generation/kwaivgi/kling-tts) — Kling Tts is KwaiVGI's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.

### Sonilo

- [V1.1 Text to Sound Effects](/model-api-reference/audio-generation/sonilo/1.1/text-to-sound-effects) — 1.1 Text To Sound Effects is Sonilo's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.
- [Sonilo V1.1 Text to Music](/model-api-reference/audio-generation/sonilo/1.1/text-to-music) — 1.1 Text To Music is Sonilo's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.

### xAI

- [xAI Text to Speech](/model-api-reference/audio-generation/xai/grok-tts) — Grok Tts by xAI - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.

## Capability coverage

`audio-to-audio`, `speech-to-text`, `text-to-audio`, `text-to-music`, `text-to-speech`, `video-to-audio`
