import { FunFact as FunFactModel } from '@git-wrapped/wrap-git-project'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import { constant, pipe } from 'fp-ts/function'
import { useMemo } from 'react'

import { GradientMarkdownText, GradientMarkdownTextProps, Theme } from '../..'

export type FunFactProps = {
  theme: Theme
  funFact: FunFactModel
  headlineProps?: Partial<GradientMarkdownTextProps>
  textProps?: Partial<GradientMarkdownTextProps>
}
export const FunFact: React.FC<FunFactProps> = ({ theme, funFact, headlineProps, textProps }) => {
  const headline = useMemo(
    () =>
      pipe(
        funFact.claim.headline,
        O.match(constant(null), (headline) => (
          <GradientMarkdownText
            normalTextProps={{ h2: true }}
            textGradient={NES.toString(theme.textGradient)}
            {...headlineProps}
            children={NES.toString(headline)}
          />
        ))
      ),
    [funFact.claim.headline, headlineProps, theme.textGradient]
  )

  const text = useMemo(
    () =>
      pipe(
        funFact.claim.text,
        O.match(constant(null), (text) => (
          <GradientMarkdownText
            textGradient={NES.toString(theme.textGradient)}
            {...textProps}
            children={NES.toString(text)}
          />
        ))
      ),
    [funFact.claim.text, textProps, theme.textGradient]
  )

  return (
    <>
      {headline}
      {text}
    </>
  )
}
