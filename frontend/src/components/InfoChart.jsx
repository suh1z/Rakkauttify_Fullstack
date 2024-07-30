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
import { useTheme } from '@mui/material/styles'
import LineChart from './PlayerChart'

const DataTable = ({ data }) => {
  const theme = useTheme()
  const [sortConfig, setSortConfig] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>
  }

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
    <div>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(2),
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search by player name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          sx={{
            marginBottom: theme.spacing(2),
            width: '20%',
            '& .MuiInputBase-input': { color: theme.palette.text.primary },
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.grey[800],
            },
          }}
          InputLabelProps={{ sx: { color: theme.palette.text.primary } }}
        />
        <Table
          sx={{
            minWidth: 650,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  cursor: 'pointer',
                  backgroundColor: theme.palette.grey[700],
                  color: theme.palette.text.primary,
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
                    backgroundColor: theme.palette.grey[700],
                    color: theme.palette.text.primary,
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
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': { backgroundColor: theme.palette.grey[600] },
                }}
                onClick={() => setSelectedPlayer(player.name)}
              >
                <TableCell sx={{ color: theme.palette.text.primary }}>
                  {player.name}
                </TableCell>
                {metrics.map((metric) => (
                  <TableCell
                    key={metric}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {player[metric]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedPlayer && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">
            Recent 10 Games of {selectedPlayer}
          </Typography>
          <LineChart playerName={selectedPlayer} />
        </div>
      )}
    </div>
  )
}

export default DataTable
