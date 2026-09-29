export const templateLabel = t => t.name || t.names?.find(Boolean) || t.aliases?.find(Boolean) || t.templateID || t.id
export function redact(value, secrets) {
  let text = typeof value === 'string' ? value : JSON.stringify(value, (key, v) => /token|secret|password|authorization|api.?key/i.test(key) ? '[redacted]' : v, 2)
  for (const secret of secrets) if (secret) text = text.split(secret).join('[redacted]')
  return text
}
// Connect protocol framing must tolerate arbitrary network chunk boundaries.
export async function readCommandStream(body, onEvent) {
  const reader = body.getReader(), decoder = new TextDecoder(); let pending = new Uint8Array(), ended = false, transportEnd = false, total = 0
  try { for (;;) {
    const { value, done } = await reader.read(); if (done) break
    total += value.length; if (total > 1048576) throw new Error('output_limit_result_unknown')
    const merged = new Uint8Array(pending.length + value.length); merged.set(pending); merged.set(value, pending.length); pending = merged
    while (pending.length >= 5) {
      const flags = pending[0], length = new DataView(pending.buffer, pending.byteOffset).getUint32(1)
      if (length > 1048576) throw new Error('frame_too_large')
      if (pending.length < length + 5) break
      if (flags !== 0 && flags !== 2) throw new Error('unsupported_frame')
      const message = JSON.parse(decoder.decode(pending.slice(5, length + 5))); pending = pending.slice(length + 5)
      if (flags === 2) { if (message.error) throw new Error('command_stream_error'); transportEnd = true; continue }
      if (transportEnd) throw new Error('invalid_stream_order')
      if (message.event?.end) ended = true
      onEvent(message.event || {})
    }
  }
  if (pending.length || !ended || !transportEnd) throw new Error('stream_interrupted_result_unknown')
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock() }
}
export function decodeOutput(base64) { return new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0))) }
