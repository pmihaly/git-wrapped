import * as NES from 'fp-ts-std/NonEmptyString'
import * as IOO from 'fp-ts/IOOption'
import * as O from 'fp-ts/Option'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, flow } from 'fp-ts/function'

import { Chart, GitRepo, createFakeChart } from '..'

export type WithSource<T> = {
  claim: T
  source: NES.NonEmptyString
}

const withFakeSource =
  (source: NES.NonEmptyString = NES.unsafeFromString('test source')) =>
  <T>(claim: T): WithSource<T> => ({
    claim,
    source,
  })

export type FunFact = WithSource<{
  headline: O.Option<NES.NonEmptyString>
  text: O.Option<NES.NonEmptyString>
  chart: O.Option<Chart>
}>

export const createFakeFunFact = (f: Partial<FunFact>): FunFact => ({
  ...withFakeSource()({
    headline: NES.fromString('Fun fact headline 1'),
    text: NES.fromString('Fun fact text 1'),
    chart: O.none,
  }),
  ...f,
})

export type Statistic = {
  name: NES.NonEmptyString
  headline: NES.NonEmptyString
  text: O.Option<NES.NonEmptyString>
  funFacts: RNEA.ReadonlyNonEmptyArray<FunFact>
}

export const createFakeStatistic = (s: Partial<Statistic>): Statistic => ({
  name: NES.unsafeFromString('Test statistic'),
  headline: NES.unsafeFromString('Test statistic with **a value**'),
  text: O.some(
    NES.unsafeFromString(
      'Consectetur aliquam nulla eaque rem nemo? Dicta ex inventore id officia rerum Nam consequatur natus animi corporis optio asperiores. Doloribus recusandae repellat beatae quaerat deserunt? Facere reprehenderit et doloribus quod quia? Officia explicabo consequatur repudiandae veniam corporis saepe quis ad. Laborum elit libero dolor corrupti voluptatibus Accusantium ipsa recusandae fuga doloremque harum soluta similique. Deserunt sed suscipit sunt autem doloremque. Quo et a amet excepturi officiis. Optio nihil voluptates expedita beatae unde iure. Perspiciatis recusandae corrupti iusto distinctio alias, nesciunt! Ipsa adipisci magni libero voluptatem totam Similique et magni aperiam optio harum. Facilis neque hic autem deleniti ipsa? Ut animi.'
    )
  ),
  funFacts: [
    createFakeFunFact({
      claim: {
        headline: NES.fromString('Fun fact **headline 1**'),
        text: NES.fromString('Fun fact text 1'),
        chart: O.none,
      },
    }),
    createFakeFunFact({
      claim: {
        headline: NES.fromString('Fun fact **headline 2**'),
        text: O.none,
        chart: O.of(createFakeChart({})),
      },
    }),
    createFakeFunFact({
      claim: {
        headline: O.none,
        text: NES.fromString('Fun fact text 3'),
        chart: O.of(createFakeChart({})),
      },
    }),
  ],
  ...s,
})

export type CreateStatisticFrom<T> = (t: T) => IOO.IOOption<Statistic>

export const createFakeStatisticCreator: (s: Partial<Statistic>) => CreateStatisticFrom<GitRepo> = flow(
  createFakeStatistic,
  IOO.of,
  constant
)
