import * as O from 'fp-ts/Option'

import * as SH from './statistic-headline'

describe('StatisticHeadline', () => {
  describe('fromString', () => {
    it('should fail to parse empty string', () => {
      const s = ''

      const parsed = SH.fromString(s)

      expect(parsed).toStrictEqual(O.none)
    })

    it('should successfully parse from plain string', () => {
      const s = 'test'

      const parsed = SH.fromString(s)

      expect(parsed).toStrictEqual(O.some('test'))
    })
  })
})
