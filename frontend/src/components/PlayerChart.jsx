/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { playerSetStats } from '../reducers/statsReducer'
import * as d3 from 'd3'
import '../lineChart.css'

const LineChart = ({ playerName }) => {
  const dispatch = useDispatch()
  const playerStats = useSelector((state) => state.stats.playerStats)
  const svgRef = useRef(null)

  useEffect(() => {
    if (playerName) {
      dispatch(playerSetStats(playerName))
    }
  }, [playerName, dispatch])

  const data = playerStats

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const width = 900 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
    svg.selectAll('*').remove()

    const formattedData = data.map((d) => ({
      matchid: +d.matchid,
      kills: +d.kills,
    }))

    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(formattedData, (d) => d.matchid),
        d3.max(formattedData, (d) => d.matchid),
      ])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(formattedData, (d) => d.kills)])
      .range([height, 0])

    const line = d3
      .line()
      .x((d) => xScale(d.matchid))
      .y((d) => yScale(d.kills))

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const g = svg.select('g')

    g.append('path').data([formattedData]).attr('class', 'line').attr('d', line)

    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
      .style('fill', 'white')
      .text('Match ID')

    g.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale))
      .selectAll('text')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text('Kills')

    g.selectAll('.dot')
      .data(formattedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .attr('cx', (d) => xScale(d.matchid))
      .attr('cy', (d) => yScale(d.kills))
  }, [data])

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default LineChart
