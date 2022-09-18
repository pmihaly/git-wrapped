import { Chart as ChartModel } from '@git-wrapped/wrap-git-project'
import { TextProps } from '@nextui-org/react'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { pipe } from 'fp-ts/lib/function'
import { Chart as ReactChartJs } from 'react-chartjs-2'

export type ChartProps = { chartJs: typeof ReactChartJs; chart: ChartModel; labelsProps?: TextProps }
export const Chart: React.FC<ChartProps> = ({ chartJs: ChartJs, chart }) => (
  <ChartJs type="bar" data={{ labels: pipe(chart.labels, RNEA.map(NES.toString), RA.toArray), datasets: [] }} />
)
