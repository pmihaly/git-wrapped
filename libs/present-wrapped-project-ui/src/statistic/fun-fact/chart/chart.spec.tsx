import { createFakeChart } from '@git-wrapped/wrap-git-project'
import { render, screen } from '@testing-library/react'

import { Chart } from '.'

const MockChartJs: any = ({ type, data }: any) => (
  <>
    <p id="type">{type}</p>
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
  it('should display labels of a chart', () => {
    const chart = createFakeChart({})

    render(<Chart chartJs={MockChartJs} chart={chart} />)

    const labels = screen.getAllByLabelText('label').map((x) => x.textContent)

    expect(labels).toStrictEqual(chart.labels)
  })
})
