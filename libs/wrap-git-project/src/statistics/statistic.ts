import * as NES from 'fp-ts-std/NonEmptyString'
import * as IOO from 'fp-ts/IOOption'
import * as O from 'fp-ts/Option'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, flow } from 'fp-ts/function'

import { Chart, GitRepo, WithSource, createFakeChart, withFakeSource } from '..'

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
      `Ille lunae, **tempus simus** patiensque nostra iam iam hominis, exstat culmen,
ambo nata. Vipereis et Festa occurrensque Ammon, colubris poscenti tinnulaque
vitta, male isto et ferebam gurgite easdem et ignisque *Tyria*.

Firmo **in cincta et** gesserit fratribus lingua sparsit, et manus. Est sum
dexterior rabiem o caelum in nomina et, ossa. Tunc orbe inventus: manus in est
[vocas](http://munus-fueritque.io/levem) dedit, per ipso cesserunt, gratissima
anguis huius dextraque, vastum. Rivos partes primum et non quoque, male ceditque
colorem!`
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

export type CreateStatisticFrom<T> = (t: T) => IOO.IOOption<Statistic>

export const createFakeStatisticCreator: (s: Partial<Statistic>) => CreateStatisticFrom<GitRepo> = flow(
  createFakeStatistic,
  IOO.of,
  constant
)
