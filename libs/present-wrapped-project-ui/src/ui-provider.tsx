import { NextUIProvider } from '@nextui-org/react'

export type UiProviderProps = { children: JSX.Element }
export const UiProvider: React.FC<UiProviderProps> = (props) => <NextUIProvider>{props.children}</NextUIProvider>
