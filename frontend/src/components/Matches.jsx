/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography,
  TextField,
} from '@mui/material'
import Stats from './Stats'
import { initializeMatches } from '../reducers/statsReducer'

const SimpleTable = () => {
  // eslint-disable-next-line no-unused-vars
  const [selectedRowIndex, setSelectedRowIndex] = useState(null)
  const [filterText, setFilterText] = useState('')

  const dispatch = useDispatch()
  const data = useSelector((state) => state.stats.matches)

  useEffect(() => {
    dispatch(initializeMatches())
  }, [])

  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>
  }

  const headers = Object.keys(data[0])

  const handleRowClick = (index) => {
    setSelectedRowIndex(index === selectedRowIndex ? null : index)
  }

  const handleLinkClick = (e) => {
    e.stopPropagation()
  }

  const filteredRows = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  )

  return (
    <TableContainer component={Paper}>
      <TextField
        variant="outlined"
        placeholder="Search for a game..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow
                onClick={() => handleRowClick(index)}
                style={{ cursor: 'pointer' }}
              >
                {headers.map((header) => (
                  <TableCell key={header}>
                    {row[header] !== null && row[header].includes('leetify') ? (
                      <Link
                        href={row[header]}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLinkClick()}
                      >
                        Leetify
                      </Link>
                    ) : (
                      row[header]
                    )}
                  </TableCell>
                ))}
              </TableRow>
              {selectedRowIndex === index && (
                <TableRow>
                  <TableCell colSpan={headers.length}>
                    <Stats id={row[headers[0]]} />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SimpleTable
