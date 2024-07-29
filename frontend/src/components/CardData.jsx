/* eslint-disable react/prop-types */
import { Button, Card, CardContent, Typography, Link, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const DataCard = (props) => {
  const { id, title, data, played, leetify_url, onCardClick } = props
  const theme = useTheme()

  const handleClick = () => {
    onCardClick({ id, title, data, played, leetify_url })
  }

  const handleLikeClick = (event) => {
    event.stopPropagation()
  }

  const handleLeetifyClick = (event) => {
    event.stopPropagation()
    if (leetify_url) {
      window.open(leetify_url, '_blank')
    }
  }

  const textData = [
    { text: `${played}`, variant: 'body2', component: 'div' },
    { text: `ID ${title}`, variant: 'body2', component: 'div' },
  ]

  const imageUrl = `../public/images/${data}.jpg`

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
      <Card
        sx={{
          width: 220,
          height: 300,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: theme.palette.text.primary,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: theme.shadows[4],
          },
          '&:hover .card-actions': {
            opacity: 1,
            visibility: 'visible',
          },
        }}
        onClick={handleClick}
      >
        <CardContent>
          {textData.map((item, index) => (
            <Typography
              key={index}
              variant={item.variant}
              component={item.component}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '5px',
                marginRight: index < textData.length - 1 ? '100px' : '0',
                marginBottom: '5px',
                borderRadius: '4px',
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body2.fontSize,
                display: 'inline-block',
              }}
            >
              {item.url ? (
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener"
                  sx={{ color: theme.palette.text.primary }}
                >
                  {item.text}
                </Link>
              ) : (
                item.text
              )}
            </Typography>
          ))}
        </CardContent>
        <Box
          className="card-actions"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            opacity: 0,
            visibility: 'hidden',
            transition: 'opacity 0.3s, visibility 0.3s',
          }}
        >
          <Button
            size="small"
            sx={{
              color: theme.palette.text.primary,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: theme.palette.text.primary,
            }}
            onClick={handleLikeClick}
          >
            Like
          </Button>
          <Button
            size="small"
            sx={{
              color: theme.palette.text.primary,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: theme.palette.text.primary,
            }}
            onClick={handleLeetifyClick}
          >
            Leetify
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default DataCard
