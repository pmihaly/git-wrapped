import { NextUIProvider } from '@nextui-org/react'
import { createTheme } from '@nextui-org/react'

const theme = createTheme({
  type: 'dark',
})

export type UiProviderProps = { children: JSX.Element }
export const UiProvider: React.FC<UiProviderProps> = (props) => (
  <NextUIProvider theme={theme}>{props.children}</NextUIProvider>
)
