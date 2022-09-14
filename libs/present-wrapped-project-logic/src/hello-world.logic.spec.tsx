import { render } from '@testing-library/react'

import { HelloWorldLogic } from '.'

describe('HelloWorldLogic', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HelloWorldLogic helloWorldUi={<p>Test</p>} />)

    expect(baseElement).toBeTruthy()
  })
})
