/* eslint-disable react/prop-types */
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

const SimpleTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>
  }

  const headers = Object.keys(data[0])

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: '100%',
        margin: '20px auto',
        padding: '10px',
        backgroundColor: '#333',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#555',
                  color: '#FFC107',
                }}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} sx={{ backgroundColor: '#333' }}>
              {headers.map((header) => (
                <TableCell key={header} sx={{ color: '#FFC107' }}>
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SimpleTable
