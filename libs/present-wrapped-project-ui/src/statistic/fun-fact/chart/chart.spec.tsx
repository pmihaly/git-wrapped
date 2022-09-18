import { createFakeChart } from '@git-wrapped/wrap-git-project'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { Chart } from '.'

const MockChartJs: any = ({ type, data }: any) => (
  <>
    <p aria-label="type">{type}</p>
    <ul>
      {data.labels.map((l: string, i: number) => (
        <li key={`label-${i}`} aria-label="label">
          {l}
        </li>
      ))}
    </ul>
  </>
)

describe('Chart', () => {
  it('should display a chart of given type', () => {
    const chart = createFakeChart({ type: 'radar' })

    render(<Chart chartJs={MockChartJs} chart={chart} />)

    expect(screen.getByLabelText('type')).toHaveTextContent('radar')
  })

  it('should convert area type to line', () => {
    const chart = createFakeChart({ type: 'area' })

    render(<Chart chartJs={MockChartJs} chart={chart} />)

    expect(screen.getByLabelText('type')).toHaveTextContent('line')
  })

  it('should display labels of a chart', () => {
    const chart = createFakeChart({})

    render(<Chart chartJs={MockChartJs} chart={chart} />)

    const labels = screen.getAllByLabelText('label').map((x) => x.textContent)

    expect(labels).toStrictEqual(chart.labels)
  })
})
