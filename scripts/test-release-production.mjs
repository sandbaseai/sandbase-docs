import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assertReadyPR } from './release-production.mjs'

const ready = () => ({state: 'OPEN', isDraft: false, baseRefName: 'main', mergeable: 'MERGEABLE',
  headRefOid: 'a'.repeat(40), statusCheckRollup: [{name: 'validate', status: 'COMPLETED', conclusion: 'SUCCESS'}]})

test('only a current, validated, mergeable main PR is accepted', () => {
  assert.doesNotThrow(() => assertReadyPR(ready(), {behind_by: 0}))
  for (const change of [{isDraft: true}, {state: 'MERGED'}, {baseRefName: 'test'},
    {mergeable: 'CONFLICTING'}, {headRefOid: 'main'}, {statusCheckRollup: []},
    {statusCheckRollup: [{name: 'validate', status: 'COMPLETED', conclusion: 'FAILURE'}]},
    {statusCheckRollup: [{name: 'validate', status: 'IN_PROGRESS', conclusion: ''}]}]) {
    assert.throws(() => assertReadyPR({...ready(), ...change}, {behind_by: 0}))
  }
  assert.throws(() => assertReadyPR(ready(), {behind_by: 1}))
  const pr = ready()
  pr.statusCheckRollup.push({name: 'additional-security-check', status: 'COMPLETED', conclusion: 'FAILURE'})
  assert.throws(() => assertReadyPR(pr, {behind_by: 0}))
})
