import { Text, TextProps } from '@nextui-org/react'

import { MarkdownText } from '.'

export type GradientMarkdownTextProps = {
  children: string
  textGradient: string
  textProps?: TextProps
  normalTextProps?: TextProps
  gradientTextProps?: TextProps
}

export const GradientMarkdownText: React.FC<GradientMarkdownTextProps> = ({
  children,
  textGradient,
  textProps,
  normalTextProps,
  gradientTextProps,
}) => (
  <MarkdownText
    bold={({ children }) => (
      <Text weight="extrabold" css={{ textGradient, display: 'inline' }} {...textProps} {...gradientTextProps}>
        {children}
      </Text>
    )}
    normal={({ children }) => (
      <Text {...textProps} {...normalTextProps}>
        {children}
      </Text>
    )}
    children={children}
  />
)
