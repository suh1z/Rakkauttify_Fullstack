/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'
import Stats from './Stats'
import { initializeMatches } from '../reducers/statsReducer'

const SimpleTable = () => {
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme()
  const [selectedRowIndex, setSelectedRowIndex] = useState(null)
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

  return (
    <TableContainer component={Paper}>
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
          {data.map((row, index) => (
            <React.Fragment key={index}>
              <TableRow
                onClick={() => handleRowClick(index)}
                style={{ cursor: 'pointer' }}
              >
                {headers.map((header) => (
                  <TableCell key={header}>{row[header]}</TableCell>
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
