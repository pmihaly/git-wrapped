import { createFakeFunFact } from '@git-wrapped/wrap-git-project'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as NES from 'fp-ts-std/NonEmptyString'
import * as O from 'fp-ts/Option'

import { FunFact } from '.'
import { createFakeTheme } from '..'

describe('FunFact', () => {
  it('should display headline if given', () => {
    const funFact = createFakeFunFact({
      claim: {
        headline: O.some(NES.unsafeFromString('test headline')),
        text: O.none,
        chart: O.none,
      },
    })

    render(
      <FunFact theme={createFakeTheme({})} funFact={funFact} headlineProps={{ textProps: { role: 'presentation' } }} />
    )

    expect(screen.getByRole('presentation')).toHaveTextContent('test headline')
  })

  it('should not display headline if not given', () => {
    const funFact = createFakeFunFact({
      claim: {
        headline: O.none,
        text: O.none,
        chart: O.none,
      },
    })

    render(
      <FunFact theme={createFakeTheme({})} funFact={funFact} headlineProps={{ textProps: { role: 'presentation' } }} />
    )

    expect(screen.queryByRole('presentation')).toBeNull()
  })
})
