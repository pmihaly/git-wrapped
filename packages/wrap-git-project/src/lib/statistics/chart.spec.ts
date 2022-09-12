import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'

import { Chart, createChart } from '.'

describe('Chart', () => {
  describe('createChart', () => {
    it('should construct a valid chart', () => {
      const toCreate: Chart = {
        type: 'bar',
        labels: [
          'label 1',
          'label 2',
        ] as unknown as RNEA.ReadonlyNonEmptyArray<NES.NonEmptyString>,
        datasets: [{ data: [1, 2] }, { data: [3, 4] }],
      }

      const chart = createChart(toCreate)

      expect(chart).toStrictEqual(O.some(toCreate))
    })

    it('should not construct chart if number of labels is not equal the number of data in datasets', () => {
      const toCreate: Chart = {
        type: 'bar',
        labels: [
          'label 1',
          'label 2',
        ] as unknown as RNEA.ReadonlyNonEmptyArray<NES.NonEmptyString>,
        datasets: [{ data: [1, 2] }, { data: [3] }],
      }

      const chart = createChart(toCreate)

      expect(chart).toStrictEqual(O.none)
    })
  })
})
