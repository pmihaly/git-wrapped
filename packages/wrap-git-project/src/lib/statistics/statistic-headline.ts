import * as O from 'fp-ts/Option'
import * as B from 'fp-ts/boolean'
import { flow } from 'fp-ts/function'
import * as S from 'fp-ts/string'

export type StatisticHeadline = string

export type FromString = (s: string) => O.Option<StatisticHeadline>

export const fromString: FromString = flow(
  O.fromPredicate(flow(S.isEmpty, B.BooleanAlgebra.not))
)
