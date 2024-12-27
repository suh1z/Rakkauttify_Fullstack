import { PieChart } from '@mui/x-charts/PieChart';
import PropTypes from 'prop-types';

const Pie = (props) => {
  const { playerName, mapData } = props;

  const chartData = Object.entries(mapData).map(([map, stats]) => ({
    value: stats.matches_played,
    label: map,
  }));

  const palette = ['orange', 'lightYellow', 'grey', 'blue', 'green', 'purple'];

  return (
    <div>
      <h3>Performance for {playerName}</h3>
      <PieChart
        colors={palette}
        series={[
          {
            data: chartData,
          },
        ]}
        width={500}
        height={200}
        paddingAngle={200}
      />
    </div>
  );
};

Pie.propTypes = {
  playerName: PropTypes.string.isRequired,
  mapData: PropTypes.object.isRequired,
};

export default Pie;
