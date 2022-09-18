import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'

import { createChart, createFakeChart } from '.'

describe('Chart', () => {
  describe('createChart', () => {
    it('should construct a valid chart', () => {
      const toCreate = createFakeChart({})

      const chart = createChart(toCreate)

      expect(chart).toStrictEqual(O.some(toCreate))
    })

    it('should not construct chart if number of labels is not equal the number of data in datasets', () => {
      const toCreate = createFakeChart({
        labels: [NES.unsafeFromString('label 1'), NES.unsafeFromString('label 2')],
        datasets: [
          { type: 'bar', label: NES.unsafeFromString('bar label 1'), data: [1, 2] },
          { type: 'bar', label: NES.unsafeFromString('bar label 1'), data: [3] },
        ],
      })

      const chart = createChart(toCreate)

      expect(chart).toStrictEqual(O.none)
    })
  })
})
