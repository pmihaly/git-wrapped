import { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'

export type MarkdownTextProps = {
  children: string
  bold: ({ children }: { children: ReactNode }) => JSX.Element
  normal: ({ children }: { children: ReactNode }) => JSX.Element
}
export const MarkdownText: React.FC<MarkdownTextProps> = ({ children, bold, normal }) => (
  <ReactMarkdown components={{ strong: bold, p: normal }}>{children}</ReactMarkdown>
)
