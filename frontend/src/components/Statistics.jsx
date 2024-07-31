/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { initializeStatistics } from '../reducers/statsReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TableContainer,
  TableSortLabel,
  Paper,
} from '@mui/material'

const Statistics = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.stats.statistics)
  const [filterText, setFilterText] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [sortColumn, setSortColumn] = useState('')
  const [recentGamesCount, setRecentGamesCount] = useState(30)

  useEffect(() => {
    dispatch(initializeStatistics(recentGamesCount))
  }, [dispatch, recentGamesCount])

  if (!data) {
    return <div>Loading...</div>
  }

  const columns = Object.keys(Object.values(data)[0] || {})
  const keys = Object.keys(data)
  let rows = keys.map((key) => Object.values(data[key]))

  const filteredRows = rows.filter((row) =>
    row[0].toLowerCase().includes(filterText.toLowerCase())
  )

  if (sortColumn) {
    filteredRows.sort((a, b) => {
      const aValue = a[columns.indexOf(sortColumn)]
      const bValue = b[columns.indexOf(sortColumn)]
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  const handleRequestSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc'
    setSortDirection(isAsc ? 'desc' : 'asc')
    setSortColumn(column)
  }

  return (
    <div>
      <TextField
        variant="outlined"
        placeholder="Search by player name"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <TextField
        variant="outlined"
        type="number"
        label="Number of Recent Games"
        value={recentGamesCount}
        onChange={(e) => setRecentGamesCount(parseInt(e.target.value, 10))}
        style={{ marginBottom: '20px' }}
      />
      <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index}>
                  <TableSortLabel
                    active={sortColumn === col}
                    direction={sortColumn === col ? sortDirection : 'asc'}
                    onClick={() => handleRequestSort(col)}
                  >
                    {col}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Statistics
