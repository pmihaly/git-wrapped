import { HelloWorldLogic } from '@git-wrapped/present-wrapped-project-logic'
import { HelloWorld } from '@git-wrapped/present-wrapped-project-ui'

export const App = () => (
  <>
    <HelloWorldLogic helloWorldUi={<HelloWorld />} />
  </>
)
