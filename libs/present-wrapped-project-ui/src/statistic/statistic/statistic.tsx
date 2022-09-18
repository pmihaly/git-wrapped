import { Statistic as StatisticModel } from '@git-wrapped/wrap-git-project'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, pipe } from 'fp-ts/function'
import { useMemo } from 'react'

import { FunFact, FunFactProps } from '..'
import { GradientMarkdownText, GradientMarkdownTextProps, Theme } from '../..'

export type StatisticProps = {
  statistic: StatisticModel
  theme: Theme
  headlineProps?: Omit<Partial<GradientMarkdownTextProps>, 'children'>
  textProps?: Omit<Partial<GradientMarkdownTextProps>, 'children'>
  funFactsProps?: Partial<FunFactProps>
}
export const Statistic: React.FC<StatisticProps> = ({ funFactsProps, headlineProps, textProps, theme, statistic }) => {
  const headline = useMemo(
    () => (
      <GradientMarkdownText
        normalTextProps={{ h1: true }}
        textGradient={NES.toString(theme.textGradient)}
        {...headlineProps}
        children={NES.toString(statistic.headline)}
      />
    ),
    [theme.textGradient, headlineProps, statistic.headline]
  )

  const text = useMemo(
    () =>
      pipe(
        statistic.text,
        O.match(constant(null), (text) => (
          <GradientMarkdownText
            textGradient={NES.toString(theme.textGradient)}
            {...textProps}
            children={NES.toString(text)}
          />
        ))
      ),
    [statistic.text, theme.textGradient, textProps]
  )

  const funFacts = useMemo(
    () =>
      pipe(
        statistic.funFacts,
        RNEA.mapWithIndex((i, funFact) => (
          <FunFact key={`fun-fact-${i}`} theme={theme} funFact={funFact} {...funFactsProps} />
        ))
      ),
    [statistic.funFacts, theme, funFactsProps]
  )

  return (
    <>
      {headline}
      {text}
      {funFacts}
    </>
  )
}
