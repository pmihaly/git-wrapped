import * as NES from 'fp-ts-std/NonEmptyString'

import { Theme } from '..'

export const nextUiDefault: Theme = {
  primaryColor: NES.unsafeFromString('#0072F5'),
  textGradient: NES.unsafeFromString('112deg, #06B7DB -63.59%, #FF4ECD -20.3%, #0072F5 70.46%'),
}
