import type { ThemeRegistration } from 'shiki'

// SandBase syntax theme for fenced code. Code panels are dark in both site
// themes, so one palette serves light and dark. Colours match the --sb-syntax-*
// tokens in theme/custom.css that the API example panels use.
const fg = '#e4e4e7'
const keyword = '#b8abff'
const string = '#d4f27a'
const constant = '#ffc078'
const comment = '#8e8e99'
const punctuation = '#a1a1aa'

export const sandbaseSyntaxTheme: ThemeRegistration = {
  name: 'sandbase-dark',
  type: 'dark',
  colors: {
    'editor.background': '#18181b',
    'editor.foreground': fg,
  },
  tokenColors: [
    { settings: { foreground: fg } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: comment, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.operator.new', 'keyword.control'], settings: { foreground: keyword } },
    { scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'string.unquoted.argument.shell'], settings: { foreground: string } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character', 'variable.other.normal.shell', 'variable.other.special.shell', 'punctuation.definition.variable.shell', 'variable.other.constant'], settings: { foreground: constant } },
    { scope: ['support.type.property-name.json', 'meta.object-literal.key', 'entity.name.tag.yaml'], settings: { foreground: fg } },
    { scope: ['constant.other.option', 'support.function.builtin.shell', 'entity.name.command.shell'], settings: { foreground: keyword } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: fg } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: punctuation } },
    { scope: ['markup.inserted'], settings: { foreground: string } },
    { scope: ['markup.deleted'], settings: { foreground: '#ff9a8a' } },
  ],
}
