import { Statistic as StatisticModel } from '@git-wrapped/wrap-git-project'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import { constant, pipe } from 'fp-ts/function'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'

import { Theme } from '..'
import { GradientMarkdownText, GradientMarkdownTextProps } from '../typography'
import { FunFact, FunFactProps } from './fun-fact'

export type StatisticProps = {
  statistic: StatisticModel
  theme: Theme
  headlineProps?: Omit<Partial<GradientMarkdownTextProps>, 'children'>
  textProps?: Omit<Partial<GradientMarkdownTextProps>, 'children'>
  funFactsProps?: Partial<FunFactProps>
}
export const Statistic: React.FC<StatisticProps> = ({ funFactsProps, headlineProps, textProps, theme, statistic }) => (
  <>
    <GradientMarkdownText
      normalTextProps={{ h1: true }}
      textGradient={NES.toString(theme.textGradient)}
      {...headlineProps}
      children={NES.toString(statistic.headline)}
    />

    {pipe(
      statistic.text,
      O.match(constant(null), (text) => (
        <GradientMarkdownText
          textGradient={NES.toString(theme.textGradient)}
          {...textProps}
          children={NES.toString(text)}
        />
      ))
    )}

    {pipe(
      statistic.funFacts,
      RNEA.mapWithIndex((i, funFact) => (
        <FunFact key={`fun-fact-${i}`} theme={theme} funFact={funFact} {...funFactsProps} />
      ))
    )}
  </>
)
