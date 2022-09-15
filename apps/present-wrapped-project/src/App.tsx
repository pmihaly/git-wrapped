import { HelloWorldLogic } from '@git-wrapped/present-wrapped-project-logic'
import { HelloWorld, UiProvider } from '@git-wrapped/present-wrapped-project-ui'

export const App: React.FC = () => (
  <UiProvider>
    <HelloWorldLogic helloWorldUi={<HelloWorld />} />
  </UiProvider>
)
