import { Statistic, UiProvider, createFakeTheme } from '@git-wrapped/present-wrapped-project-ui'
import { createFakeStatistic } from '@git-wrapped/wrap-git-project'

export const App: React.FC = () => (
  <UiProvider>
    <Statistic theme={createFakeTheme({})} statistic={createFakeStatistic({})} />
  </UiProvider>
)
