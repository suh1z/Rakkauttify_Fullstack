/* eslint-disable react/prop-types */
// /components/BarChart.jsx

const barWidth = 60

const BarChart = ({ width, height, data }) => {
  const valuedata = data.flatMap((data) => data)
  const maxValue = valuedata.map((d) => d.value)
  const scaler = (height - 20) / Math.max(...maxValue)

  return (
    <div className="container">
      <svg
        className="viz"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g className="bars">
          {valuedata.map((d, i) => (
            <g key={i}>
              <rect
                width={barWidth}
                height={height - scaler}
                x={i * (barWidth + 5)}
                y={height - d.value * scaler}
                fill="#6baed6"
              />
              <text
                x={i * (barWidth + 5) + barWidth / 2}
                y={height - d.value * scaler - 5}
                textAnchor="middle"
                fill="#000"
                fontSize="12"
              >
                {d.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

export default BarChart
