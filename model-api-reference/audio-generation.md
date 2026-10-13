---
title: Audio Generation
description: Browse SandBase Audio Generation APIs by provider and open a model page for its exact request format.
---

# Audio Generation

Browse enabled audio generation models by provider in the left navigation. Open an entry for its exact model identifier, supported capabilities, and a working request.

Audio Generation models use the SandBase generation protocol declared in each model registry file. Most are asynchronous: submit a request, receive an opaque run ID, then poll GET /v1/run/{id} until the generation is completed, failed, or timed out. Check the selected model page's execution mode because synchronous models return their result in the initial response.

## Providers

### OpenAI

- [Wizper (Whisper v3)](/model-api-reference/audio-generation/openai/wizper) — Wizper by OpenAI - accurate speech-to-text transcription with AI. Convert audio and video to text with high accuracy, multilingual support, and speaker identification.

### ElevenLabs

- [ElevenLabs Eleven v4 Turbo](/model-api-reference/audio-generation/elevenlabs/v4-turbo) — Eleven v4 Turbo is the low-latency tier of ElevenLabs' v4 text-to-speech generation, for real-time and high-volume narration.
- [ElevenLabs Eleven v4](/model-api-reference/audio-generation/elevenlabs/v4) — Eleven v4 is ElevenLabs' most expressive text-to-speech model, with natural pacing, emotion and multilingual delivery.
- [ElevenLabs Music v2.5](/model-api-reference/audio-generation/elevenlabs/music/2.5) — ElevenLabs Music v2.5 generates studio-quality songs and instrumentals with vocals from a text prompt, up to 10 minutes long.
- [ElevenLabs Music v2](/model-api-reference/audio-generation/elevenlabs/music/2) — ElevenLabs Music v2 generates studio-quality songs and instrumentals with vocals from a text prompt, up to 10 minutes long.
- [Scribe V2](/model-api-reference/audio-generation/elevenlabs/scribe-v2) — Scribe V2 is ElevenLabs's speech recognition model. Transcribe audio content with industry-leading accuracy across multiple languages and accents.
- [ElevenLabs Music](/model-api-reference/audio-generation/elevenlabs/music) — Music is ElevenLabs's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.
- [Text To Dialogue](/model-api-reference/audio-generation/elevenlabs/text-to-dialogue) — Text To Dialogue by ElevenLabs - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [Sound Effects V2](/model-api-reference/audio-generation/elevenlabs/sound-effects-v2) — Sound Effects V2 by ElevenLabs - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [V3](/model-api-reference/audio-generation/elevenlabs/v3) — V3 by ElevenLabs - generate music, sound effects, and audio from text descriptions with AI. Create original compositions, ambient sounds, and audio content for any creative project.
- [Turbo V2.5](/model-api-reference/audio-generation/elevenlabs/turbo-v2.5) — Turbo V2.5 by ElevenLabs - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.
- [Multilingual V2](/model-api-reference/audio-generation/elevenlabs/multilingual-v2) — Multilingual V2 is ElevenLabs's AI audio generation model. Produce high-quality music tracks, sound effects, and audio landscapes from natural language prompts.

### Google

- [Gemini 3.8 Flash TTS](/model-api-reference/audio-generation/google/gemini-3.8-flash-tts) — Gemini 3.8 Flash TTS by Google turns text into expressive speech with 30 prebuilt voices and natural-language style direction.
- [Gemini 3.8 Flash Lite TTS](/model-api-reference/audio-generation/google/gemini-3.8-flash-lite-tts) — Gemini 3.8 Flash Lite TTS by Google turns text into expressive speech with 30 prebuilt voices and natural-language style direction.
- [Lyria 3.5](/model-api-reference/audio-generation/google/lyria-3.5) — Lyria 3.5 is Google's flagship music generation model for full-length songs up to a few minutes, with verses, choruses, bridges, expressive vocals, timed lyrics, and rich instrumental arrangements. It generates high-quality 44.1kHz stereo audio from a text prompt, optionally guided by an image.
- [Gemini 3.1 Flash TTS](/model-api-reference/audio-generation/google/gemini-3.1-flash-tts) — Gemini 3.1 Flash Tts by Google - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.

### MiniMax

- [MiniMax Music 3](/model-api-reference/audio-generation/minimax/music/3) — MiniMax Music 3 by MiniMax composes a complete song up to five minutes long with expressive vocals and evolving arrangements from a style prompt and lyrics.
- [MiniMax Music 2.6](/model-api-reference/audio-generation/minimax/music/2.6) — MiniMax Music 2.6 by MiniMax composes a full song with vocals and accompaniment from a style prompt and lyrics, or an instrumental track without lyrics.
- [MiniMax Speech 2.8 HD](/model-api-reference/audio-generation/minimax/speech/2.8/hd) — MiniMax Speech 2.8 HD by MiniMax converts text into expressive, high-fidelity speech in 40+ languages with system or cloned voices and emotion control.
- [MiniMax Speech 2.8 Turbo](/model-api-reference/audio-generation/minimax/speech/2.8/turbo) — MiniMax Speech 2.8 Turbo by MiniMax converts text into expressive speech in 40+ languages with low latency, system or cloned voices, and emotion control.
- [MiniMax Speech 2.6 Turbo](/model-api-reference/audio-generation/minimax/speech/2.6/turbo) — MiniMax Speech 2.6 Turbo by MiniMax converts text into natural speech in 40+ languages with low latency, system or cloned voices, and emotion control.
- [MiniMax Speech 2.6 HD](/model-api-reference/audio-generation/minimax/speech/2.6/hd) — MiniMax Speech 2.6 HD by MiniMax converts text into natural, high-fidelity speech in 40+ languages with system or cloned voices and emotion control.
- [MiniMax Voice Design](/model-api-reference/audio-generation/minimax/voice-design) — MiniMax Voice Design by MiniMax creates a new reusable voice from a text description of its timbre, age, and style, and returns a spoken preview.
- [MiniMax Voice Clone](/model-api-reference/audio-generation/minimax/voice-clone) — MiniMax Voice Clone by MiniMax creates a reusable custom voice from a reference recording of at least 10 seconds and returns a short preview spoken in that voice.

### stability-ai

- [Stable Audio 3 Medium Text to Audio](/model-api-reference/audio-generation/stability-ai/stable-audio/3/medium/text-to-audio) — Stable Audio 3 Medium by Stability AI generates music, ambience and sound design up to about 6 minutes from a text prompt.
- [Stable Audio 3 Small Music](/model-api-reference/audio-generation/stability-ai/stable-audio/3/small/music/text-to-audio) — Stable Audio 3 Small Music by Stability AI is a fast, low-cost music generator producing tracks up to 2 minutes from a text prompt.

### Alibaba

- [Qwen 3 TTS - Text to Speech [1.7B]](/model-api-reference/audio-generation/alibaba/qwen-3-tts/1.7b) — Qwen 3 Tts 1.7b is Alibaba's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.
- [Qwen 3 TTS - Text to Speech [0.6B]](/model-api-reference/audio-generation/alibaba/qwen-3-tts/0.6b) — Qwen 3 Tts 0.6b is Alibaba's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.

### ByteDance

- [Bytedance Seed Speech Text to Speech](/model-api-reference/audio-generation/bytedance/seed-speech/tts/2.0) — Seed Speech Tts 2.0 is ByteDance's text-to-speech AI model. Generate human-like voiceovers with expressive intonation, multilingual support, and customizable voice characteristics.

### xAI

- [xAI Text to Speech](/model-api-reference/audio-generation/xai/grok-tts) — Grok Tts by xAI - convert text to natural-sounding speech with AI. Supports multiple voices, languages, emotions, and speaking styles for content creation and accessibility.

## Capability coverage

`speech-to-text`, `text-to-audio`, `text-to-music`, `text-to-speech`
