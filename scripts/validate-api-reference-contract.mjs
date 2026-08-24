import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

const generatedSpecsSource = readFileSync('.vitepress/theme/generatedApiReferenceSpecs.ts', 'utf8')
const generatedSpecsMatch = generatedSpecsSource.match(
  /export const generatedApiReferenceSpecs[^=]*=\s*(\{[\s\S]*\})\s*$/,
)
assert.ok(generatedSpecsMatch, 'Could not parse generatedApiReferenceSpecs.ts')
const generatedApiReferenceSpecs = JSON.parse(generatedSpecsMatch[1])

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

function normalizePath(value) {
  return value.replace(/\{[^}]+\}/g, '{}')
}

function pathMatches(template, candidate) {
  const expected = template.split('/')
  const actual = candidate.split('/')
  const vendorQualifiedTail = expected.at(-1) === '{id_or_name}'
  if ((!vendorQualifiedTail && expected.length !== actual.length) || (vendorQualifiedTail && actual.length < expected.length)) {
    return false
  }
  return expected.every((segment, index) => {
    if (vendorQualifiedTail && index === expected.length - 1) return actual.slice(index).join('/').length > 0
    return /^\{[^}]+\}$/.test(segment) || segment === actual[index]
  })
}

function resolveRef(value, document) {
  if (!value?.$ref) return value
  return value.$ref
    .replace(/^#\//, '')
    .split('/')
    .reduce((current, segment) => current?.[segment], document)
}

function schemaFields(schema, document, seen = new Set()) {
  if (!schema) return { names: new Set(), allowsAdditional: false }
  if (schema.$ref) {
    if (seen.has(schema.$ref)) return { names: new Set(), allowsAdditional: false }
    return schemaFields(resolveRef(schema, document), document, new Set([...seen, schema.$ref]))
  }

  const names = new Set(Object.keys(schema.properties ?? {}))
  let allowsAdditional = schema.additionalProperties === true
  for (const keyword of ['allOf', 'oneOf', 'anyOf']) {
    for (const child of schema[keyword] ?? []) {
      const nested = schemaFields(child, document, seen)
      for (const name of nested.names) names.add(name)
      allowsAdditional ||= nested.allowsAdditional
    }
  }
  return { names, allowsAdditional }
}

function operationParameters(pathItem, operation, document) {
  return [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])].map((parameter) =>
    resolveRef(parameter, document),
  )
}

const apiReferenceKeys = []
const inlineApiReferences = []
for (const file of walk('api-reference').filter((entry) => entry.endsWith('.md'))) {
  const source = readFileSync(file, 'utf8')
  const match = source.match(/^apiReferenceKey:\s*["']([^"']+)["']\s*$/m)
  if (match) apiReferenceKeys.push([file, match[1]])
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatter) {
    const metadata = parse(frontmatter[1])
    if (metadata?.apiReference) inlineApiReferences.push([file, metadata.apiReference])
  }
}

const missingSpecs = apiReferenceKeys.filter(([, key]) => !generatedApiReferenceSpecs[key])
assert.deepEqual(missingSpecs, [], `API pages with no generated spec:\n${missingSpecs.map(([file, key]) => `${file}: ${key}`).join('\n')}`)

const referencedKeys = new Set(apiReferenceKeys.map(([, key]) => key))
const unusedSpecs = Object.keys(generatedApiReferenceSpecs).filter((key) => !referencedKeys.has(key))
assert.deepEqual(unusedSpecs, [], `Generated API specs with no page:\n${unusedSpecs.join('\n')}`)

const openapi = parse(readFileSync('public/openapi.yaml', 'utf8'))
const openapiPaths = new Map(
  Object.entries(openapi.paths).map(([apiPath, operations]) => [normalizePath(apiPath), operations]),
)
const openapiOperations = Object.entries(openapi.paths).flatMap(([apiPath, operations]) =>
  ['get', 'post', 'put', 'patch', 'delete']
    .filter((method) => operations[method])
    .map((method) => ({ method: method.toUpperCase(), path: apiPath })),
)

const contractMismatches = []
const referenceSpecs = [
  ...Object.entries(generatedApiReferenceSpecs),
  ...inlineApiReferences.map(([file, spec]) => [`inline:${file}`, spec]),
]

for (const [key, spec] of referenceSpecs) {
  const operations = openapiPaths.get(normalizePath(spec.path))
  const method = String(spec.method).toLowerCase()
  const operation = operations?.[method]
  if (!operation) {
    contractMismatches.push(`${key}: ${spec.method} ${spec.path}`)
    continue
  }

  const parameters = operationParameters(operations, operation, openapi)
  const requestSchema = operation.requestBody?.content?.['application/json']?.schema
    ?? operation.requestBody?.content?.['multipart/form-data']?.schema
  const requestFields = schemaFields(requestSchema, openapi)

  for (const group of spec.groups ?? []) {
    const title = String(group.title).toLowerCase()
    let allowed
    let allowsAdditional = false
    if (title.includes('request body')) {
      allowed = requestFields.names
      allowsAdditional = requestFields.allowsAdditional
    } else if (title.includes('query parameter')) {
      allowed = new Set(parameters.filter((parameter) => parameter.in === 'query').map((parameter) => parameter.name))
    } else {
      continue
    }

    for (const field of group.fields ?? []) {
      if (!allowed.has(field.name) && !allowsAdditional) {
        contractMismatches.push(`${key}: ${group.title} field ${field.name} is missing from OpenAPI`)
      }
    }
  }

  if (spec.response?.code) {
    let exampleResponse
    try {
      exampleResponse = JSON.parse(spec.response.code)
    } catch {
      exampleResponse = undefined
    }

    if (exampleResponse && !Array.isArray(exampleResponse) && typeof exampleResponse === 'object') {
      const status = String(spec.response.status ?? '').match(/^\d{3}/)?.[0]
      const response = operation.responses?.[status]
        ?? Object.entries(operation.responses ?? {}).find(([code]) => /^2/.test(code))?.[1]
      const responseSchema = response?.content?.['application/json']?.schema
      const responseFields = schemaFields(responseSchema, openapi)
      if (responseSchema) {
        for (const field of Object.keys(exampleResponse)) {
          if (!responseFields.names.has(field) && !responseFields.allowsAdditional) {
            contractMismatches.push(`${key}: response field ${field} is missing from OpenAPI`)
          }
        }
      }
    }
  }
}

for (const match of JSON.stringify(referenceSpecs).matchAll(
  /\b(GET|POST|PUT|PATCH|DELETE) (\/(?:v1|events)\/[A-Za-z0-9_{}./:-]+)/g,
)) {
  const candidate = match[2].replace(/[.,;:]$/, '')
  if (!openapiOperations.some((operation) => operation.method === match[1] && pathMatches(operation.path, candidate))) {
    contractMismatches.push(`embedded API reference is missing from OpenAPI: ${match[1]} ${candidate}`)
  }
}

assert.deepEqual(contractMismatches, [], `API page operations missing from OpenAPI:\n${contractMismatches.join('\n')}`)
console.log(`API reference contract: ok (${apiReferenceKeys.length + inlineApiReferences.length} pages)`)
