import * as NES from 'fp-ts-std/NonEmptyString'

export type WithSource<T> = {
  claim: T
  source: NES.NonEmptyString
}

export const withFakeSource =
  (source: NES.NonEmptyString = NES.unsafeFromString('test source')) =>
  <T>(claim: T): WithSource<T> => ({
    claim,
    source,
  })
