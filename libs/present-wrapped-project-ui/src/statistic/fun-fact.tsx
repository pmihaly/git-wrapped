import { FunFact as FunFactModel } from '@git-wrapped/wrap-git-project'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'
import { constant, pipe } from 'fp-ts/function'

import { GradientMarkdownText, GradientMarkdownTextProps, Theme } from '..'

export type FunFactProps = { theme: Theme; funFact: FunFactModel; headlineProps?: Partial<GradientMarkdownTextProps> }
export const FunFact: React.FC<FunFactProps> = ({ theme, funFact, headlineProps }) => (
  <>
    {pipe(
      funFact.claim.headline,
      O.match(constant(null), (text) => (
        <GradientMarkdownText
          textProps={{ h1: true }}
          textGradient={NES.toString(theme.textGradient)}
          {...headlineProps}
          children={NES.toString(text)}
        />
      ))
    )}
  </>
)
