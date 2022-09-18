import { createFakeChart } from '@git-wrapped/wrap-git-project'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as STS from 'fp-ts-std/String'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { get } from 'spectacles-ts'

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
    <ul>
      {data.datasets.map((ds: any, i: number) => (
        <ul key={`dataset-${i}`} aria-label="dataset">
          {ds.data.map((d: number) => (
            <li key={`data-${d}`} aria-label="data">
              {d}
            </li>
          ))}
        </ul>
      ))}
    </ul>
  </>
)

describe('Chart', () => {
  it('should display a chart of given type', () => {
    const chart = createFakeChart({ type: 'radar' })

    render(<Chart reactChartJs={MockChartJs} chart={chart} />)

    expect(screen.getByLabelText('type')).toHaveTextContent('radar')
  })

  it('should convert area type to line', () => {
    const chart = createFakeChart({ type: 'area' })

    render(<Chart reactChartJs={MockChartJs} chart={chart} />)

    expect(screen.getByLabelText('type')).toHaveTextContent('line')
  })

  it('should display labels of a chart', () => {
    const chart = createFakeChart({})

    render(<Chart reactChartJs={MockChartJs} chart={chart} />)

    const labels = screen.getAllByLabelText('label').map((x) => x.textContent)

    expect(labels).toStrictEqual(chart.labels)
  })

  it('should display datasets of a chart', () => {
    const chart = createFakeChart({})

    render(<Chart reactChartJs={MockChartJs} chart={chart} />)

    const datasets = screen.getAllByLabelText('dataset')
    expect(datasets.length).toBe(chart.labels.length)
  })

  it('should display all data of all datasets', () => {
    const chart = createFakeChart({})
    const chartData = pipe(chart, get('datasets.[]>.data'), ([x, y]) => [x, y], RA.flatten, RA.map(STS.fromNumber))

    render(<Chart reactChartJs={MockChartJs} chart={chart} />)

    const renderedData = pipe(
      screen.getAllByLabelText('data'),
      RA.map((x) => x.textContent)
    )
    expect(renderedData).toStrictEqual(chartData)
  })

  it('should register chartjs components', () => {
    const chart = createFakeChart({})

    const component = { id: 'test component' }

    const chartJs: any = {
      register: jest.fn(),
    }

    render(<Chart reactChartJs={MockChartJs} chartJsComponents={[component]} chartJs={chartJs} chart={chart} />)

    expect(chartJs.register).toHaveBeenCalledWith(component)
  })
})
