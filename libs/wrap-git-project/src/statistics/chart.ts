import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import * as OR from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { get } from 'spectacles-ts'

export type Chart = {
  type: ChartType
  labels: RNEA.ReadonlyNonEmptyArray<Label>
  datasets: RNEA.ReadonlyNonEmptyArray<Dataset>
}

export const chartTypes = ['bar', 'line', 'area', 'radar'] as const
export type ChartType = typeof chartTypes[number]

type Label = NES.NonEmptyString

type Dataset = {
  label: NES.NonEmptyString
  data: RNEA.ReadonlyNonEmptyArray<number>
}

const hasDatapointForAllLabels = (chart: Chart): boolean =>
  pipe(chart, get('datasets'), RA.every(flow(get('data'), RA.size, OR.equals(N.Ord)(get('labels.length')(chart)))))

export type CreateChart = (c: Chart) => O.Option<Chart>
export const createChart: CreateChart = O.fromPredicate(hasDatapointForAllLabels)

export const createFakeChart = (c: Partial<Chart>): Chart => ({
  type: 'bar',
  labels: [NES.unsafeFromString('label 1'), NES.unsafeFromString('label 2')],
  datasets: [
    { label: NES.unsafeFromString('bar label 1'), data: [1, 2] },
    { label: NES.unsafeFromString('bar label 2'), data: [3, 4] },
  ],
  ...c,
})
