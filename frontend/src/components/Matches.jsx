/* eslint-disable react/prop-types */
import { useTheme } from '@mui/material/styles'
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
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme()

  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>
  }

  const headers = Object.keys(data[0])

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
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={header}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SimpleTable
