import { Statistic as StatisticModel } from '@git-wrapped/wrap-git-project'
import * as NES from 'fp-ts-std/NonEmptyString'

import { Theme } from '..'
import { GradientMarkdownText, GradientMarkdownTextProps } from '../typography'

export type StatisticProps = {
  statistic: StatisticModel
  theme: Theme
  headlineProps?: Omit<Partial<GradientMarkdownTextProps>, 'children'>
}
export const Statistic: React.FC<StatisticProps> = ({ headlineProps, theme, statistic }) => (
  <GradientMarkdownText
    normalTextProps={{ h1: true }}
    textGradient={NES.toString(theme.textGradient)}
    {...headlineProps}
    children={NES.toString(statistic.headline)}
  />
)
