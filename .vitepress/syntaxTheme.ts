import type { ThemeRegistration } from 'shiki'

// SandBase code theme, shared with the Blog (sandbase-blog config/shiki-sandbase.mjs).
// Keep the two in sync. Code panels are dark in both site themes, so one palette
// serves light and dark. The API example panels use the same colours through
// the --sb-syntax-* tokens in theme/custom.css.
const c = {
  bg: '#18181b',
  fg: '#e4e4e7',
  muted: '#8e8e98',
  punct: '#a1a1aa',
  keyword: '#b4a2ff',
  string: '#d9ff43',
  number: '#ffb877',
  func: '#8fd3ff',
  type: '#7fe0c4',
  prop: '#c9c2ff',
};

export const sandbaseSyntaxTheme: ThemeRegistration = {
  name: 'sandbase-ink',
  type: 'dark',
  colors: { 'editor.background': c.bg, 'editor.foreground': c.fg },
  tokenColors: [
    { settings: { foreground: c.fg } },
    { scope: ['comment', 'punctuation.definition.comment', 'string.comment'], settings: { foreground: c.muted, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python', 'keyword.operator.wordlike', 'variable.language.this', 'variable.language.self', 'support.type.primitive'], settings: { foreground: c.keyword } },
    { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'markup.inline.raw', 'string.unquoted.plain.out.yaml'], settings: { foreground: c.string } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character', 'constant.other', 'support.constant', 'variable.other.constant'], settings: { foreground: c.number } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function', 'support.function.builtin'], settings: { foreground: c.func } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.class', 'support.type', 'entity.other.inherited-class', 'entity.name.namespace', 'entity.name.tag'], settings: { foreground: c.type } },
    { scope: ['support.type.property-name', 'meta.object-literal.key', 'variable.other.property', 'variable.other.object.property', 'entity.other.attribute-name', 'entity.name.tag.yaml', 'support.type.property-name.json', 'variable.parameter.function.language.special', 'variable.parameter'], settings: { foreground: c.prop } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator', 'punctuation.separator', 'punctuation.terminator'], settings: { foreground: c.punct } },
    { scope: ['string.interpolated', 'meta.template.expression', 'punctuation.definition.template-expression', 'constant.character.format.placeholder', 'meta.fstring.python'], settings: { foreground: c.fg } },
    { scope: ['variable.other.normal.shell', 'variable.other.readwrite', 'variable.other.env'], settings: { foreground: c.fg } },
    { scope: ['markup.heading', 'markup.bold'], settings: { foreground: c.fg, fontStyle: 'bold' } },
    { scope: ['markup.inserted'], settings: { foreground: c.string } },
    { scope: ['markup.deleted', 'invalid'], settings: { foreground: '#ff8a80' } },
  ],
};
