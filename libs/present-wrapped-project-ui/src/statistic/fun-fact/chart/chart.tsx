import { Chart as ChartModel, ChartType, Dataset } from '@git-wrapped/wrap-git-project'
import { ChartComponentLike, ChartDataset, Chart as ChartJs, ChartType as ChartJsType } from 'chart.js'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/lib/function'
import { useMemo } from 'react'
import { Chart as ReactChartJs } from 'react-chartjs-2'

const toChartJsType: (c: ChartType) => ChartJsType = (c) => (c === 'area' ? 'line' : c)
const toChartJsDataset: (ds: Dataset) => ChartDataset = (ds) => ({
  label: NES.toString(ds.label),
  data: RA.toArray(ds.data),
})

export type ChartProps = {
  chartJsReact: typeof ReactChartJs
  chartJsComponents?: ChartComponentLike[]
  chartJs?: typeof ChartJs
  chart: ChartModel
}
export const Chart: React.FC<ChartProps> = ({ chartJsReact: ChartJsReact, chart, chartJs, chartJsComponents }) => {
  useMemo(() => chartJsComponents && chartJs?.register(...chartJsComponents), [chartJsComponents, chartJs])

  return (
    <ChartJsReact
      type={toChartJsType(chart.type)}
      data={{
        labels: pipe(chart.labels, RNEA.map(NES.toString), RA.toArray),
        datasets: pipe(chart.datasets, RNEA.map(toChartJsDataset), RA.toArray),
      }}
    />
  )
}
