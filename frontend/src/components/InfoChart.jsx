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
import Bars from './BarChart'

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

  const metrics = Object.keys(data[0]).filter((key) =>
    filteredMetrics.includes(key)
  )
  const sortData = (data) => {
    if (sortColumn) {
      return [...data].sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    return data
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
                    {metric}
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
        <div>
          <Typography variant="h6">
            Recent 10 Games of {selectedPlayer}
          </Typography>
          <Bars playerName={selectedPlayer} />
        </div>
      )}
    </div>
  )
}

export default DataTable
