import * as O from 'fp-ts/Option'

import { getGenerationsOfBananasOutlivedFunFact } from '.'

describe('generationsOfBananasOutlived', () => {
  it('should return 1 as the number of outlived banana generations when the last commit is 10 days ago', () => {
    const daysSinceLastCommit = 10

    const bananaGenerationsOutlivedFunFact = getGenerationsOfBananasOutlivedFunFact(daysSinceLastCommit)

    expect(bananaGenerationsOutlivedFunFact.claim.text).toStrictEqual(O.of(expect.stringContaining('1')))
  })

  it('should return 1.5 as the number of outlived banana generations when the last commit is 15 days ago', () => {
    const daysSinceLastCommit = 15

    const bananaGenerationsOutlivedFunFact = getGenerationsOfBananasOutlivedFunFact(daysSinceLastCommit)

    expect(bananaGenerationsOutlivedFunFact.claim.text).toStrictEqual(O.of(expect.stringContaining('1.5')))
  })
})
