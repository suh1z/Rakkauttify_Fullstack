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
  TextField,
  Typography,
} from '@mui/material'

const DataTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState(null)
  const [filterText, setFilterText] = useState('')

  if (!data || data.length === 0)
    return <Typography>No data available</Typography>
  const filteredMetrics = [
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

  const getSortedData = () => {
    let sortableData = [...data]
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredData = getSortedData().filter((player) =>
    player.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '8px' }}
    >
      <TextField
        variant="outlined"
        placeholder="Search by player name"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ marginBottom: '10px', width: '20%' }}
        InputProps={{
          sx: { color: '#fff', backgroundColor: '#333' },
        }}
        InputLabelProps={{ sx: { color: '#fff' } }}
      />
      <Table sx={{ minWidth: 650, backgroundColor: '#2c2c2c' }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                cursor: 'pointer',
                backgroundColor: '#333',
                color: '#fff',
              }}
              onClick={() => handleSort('name')}
            >
              Player Name
            </TableCell>
            {metrics.map((metric) => (
              <TableCell
                key={metric}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: '#333',
                  color: '#fff',
                }}
                onClick={() => handleSort(metric)}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((player) => (
            <TableRow
              key={player.name}
              sx={{
                backgroundColor: '#2c2c2c',
                '&:hover': { backgroundColor: '#444' },
              }}
            >
              <TableCell sx={{ color: '#fff' }}>{player.name}</TableCell>
              {metrics.map((metric) => (
                <TableCell key={metric} sx={{ color: '#fff' }}>
                  {player[metric]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
