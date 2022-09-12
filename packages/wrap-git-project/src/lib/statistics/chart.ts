import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import * as OR from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { get } from 'spectacles-ts'

export const chartTypes = ['bar', 'line', 'area', 'radar'] as const
export type ChartType = typeof chartTypes[number]

type Label = NES.NonEmptyString

type Dataset = {
  data: RNEA.ReadonlyNonEmptyArray<number>
}

export type Chart = {
  type: ChartType
  labels: RNEA.ReadonlyNonEmptyArray<Label>
  datasets: RNEA.ReadonlyNonEmptyArray<Dataset>
}

const hasDatapointForAllLabels = (chart: Chart): boolean =>
  pipe(
    chart,
    get('datasets'),
    RA.every(
      flow(get('data'), RA.size, OR.equals(N.Ord)(get('labels.length')(chart)))
    )
  )

export type CreateChart = (c: Chart) => O.Option<Chart>
export const createChart: CreateChart = flow(
  O.some,
  O.chain(O.fromPredicate(hasDatapointForAllLabels))
)
