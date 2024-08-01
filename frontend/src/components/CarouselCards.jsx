/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Box } from '@mui/material'
import DataCard from './CardData'
import Stats from './Stats'
import Carousel from 'react-material-ui-carousel'

const chunkArray = (array, chunkSize) => {
  const results = []
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize))
  }
  return results
}

const CardCarousel = ({ cardsData }) => {
  const [selectedCard, setSelectedCard] = useState(null)

  const sortedData = [...cardsData].sort((a, b) => {
    const dateA = new Date(a['played'])
    const dateB = new Date(b['played'])
    return dateB - dateA
  })

  const cardGroups = chunkArray(sortedData, 5)

  const handleCardClick = (card) => {
    setSelectedCard(card)
  }

  return (
    <Box sx={{ width: '100%', margin: '0 auto', padding: '20px 0' }}>
      <Carousel
        navButtonsAlwaysVisible
        navButtonsProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
          },
        }}
        indicatorContainerProps={{
          style: {
            display: 'none',
          },
        }}
        autoPlay={false}
        cycleNavigation={false}
        interval={3000}
        animation="slide"
      >
        {cardGroups.map((group, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              padding: '10px',
            }}
          >
            {group.map((card) => (
              <DataCard
                key={card.id}
                id={card.id}
                title={card.matchid}
                data={card.map}
                played={card.played}
                leetify_url={card.leetify_url}
                onCardClick={handleCardClick}
              />
            ))}
          </Box>
        ))}
      </Carousel>
      {selectedCard && (
        <Box
          sx={{
            marginTop: '20px',
            maxWidth: '80%',
            margin: '0 auto',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <Stats id={selectedCard.title} />
        </Box>
      )}
    </Box>
  )
}

export default CardCarousel
