import { Chart as ChartModel, ChartType } from '@git-wrapped/wrap-git-project'
import { ChartDataset, ChartType as ChartJsType } from 'chart.js'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/lib/function'
import { Chart as ReactChartJs } from 'react-chartjs-2'

const toChartJsType: (c: ChartType) => ChartJsType = (c) => (c === 'area' ? 'line' : c)
const toChartJsDataset: (ds: ChartModel['datasets'][number]) => ChartDataset = (ds) => ({
  label: NES.toString(ds.label),
  data: RA.toArray(ds.data),
})

export type ChartProps = { chartJs: typeof ReactChartJs; chart: ChartModel }
export const Chart: React.FC<ChartProps> = ({ chartJs: ChartJs, chart }) => (
  <ChartJs
    type={toChartJsType(chart.type)}
    data={{
      labels: pipe(chart.labels, RNEA.map(NES.toString), RA.toArray),
      datasets: pipe(chart.datasets, RNEA.map(toChartJsDataset), RA.toArray),
    }}
  />
)
