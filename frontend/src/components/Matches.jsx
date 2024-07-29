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
  const theme = useTheme()

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
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
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
                  backgroundColor: theme.palette.grey[700],
                  color: theme.palette.text.secondary,
                }}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: theme.palette.background.default,
                '&:hover': { backgroundColor: theme.palette.grey[600] },
              }}
            >
              {headers.map((header) => (
                <TableCell
                  key={header}
                  sx={{ color: theme.palette.text.secondary }}
                >
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
