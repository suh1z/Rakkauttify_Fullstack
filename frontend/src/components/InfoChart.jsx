/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Graph from './Graphs'

const DataTable = ({ data }) => {
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme()
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [sortColumn, setSortColumn] = useState('')

  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>
  }

  const filteredMetrics = [
    'name',
    'kills',
    'deaths',
    'damage',
    'assists',
    'enemy5ks',
    'enemy4ks',
    'enemy3ks',
    'enemy2ks',
  ]

  const metrics = filteredMetrics.filter((metric) => metric in data[0])

  const sortData = (data) => {
    if (!sortColumn) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      const aNumeric = isNaN(Number(aValue)) ? aValue : Number(aValue)
      const bNumeric = isNaN(Number(bValue)) ? bValue : Number(bValue)

      if (typeof aNumeric === 'string' && typeof bNumeric === 'string') {
        return sortDirection === 'asc'
          ? aNumeric.localeCompare(bNumeric)
          : bNumeric.localeCompare(aNumeric)
      }

      if (typeof aNumeric === 'number' && typeof bNumeric === 'number') {
        return sortDirection === 'asc'
          ? aNumeric - bNumeric
          : bNumeric - aNumeric
      }

      return 0
    })
  }

  const sortedData = sortData(data)

  const handleRequestSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc'
    setSortDirection(isAsc ? 'desc' : 'asc')
    setSortColumn(column)
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {metrics.map((metric) => (
                <TableCell key={metric}>
                  <TableSortLabel
                    active={sortColumn === metric}
                    direction={sortColumn === metric ? sortDirection : 'asc'}
                    onClick={() => handleRequestSort(metric)}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((player) => (
              <TableRow
                key={player.name}
                onClick={() => setSelectedPlayer(player.name)}
                style={{ cursor: 'pointer' }}
              >
                {metrics.map((metric) => (
                  <TableCell key={metric}>{player[metric]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedPlayer && (
        <div style={{ padding: '20px', backgroundColor: '#1e1e1e' }}>
          <Graph playerName={selectedPlayer} />
        </div>
      )}
    </div>
  )
}

export default DataTable
