import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AppEnvironmentalImpactChart({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '30%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value, { seriesIndex, dataPointIndex, w }) => {
          const unit = series[seriesIndex].unit || ''; // Get unit from series object
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} ${unit}`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  // Check if there are no values in the series
  const hasValues = series && series.some((s) => s.data && s.data.length > 0);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        {hasValues ? (
          <Chart
            dir="ltr"
            type="bar"
            series={series.map((s) => ({ name: s.name, data: s.data }))}
            options={chartOptions}
            width="100%"
            height={364}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: "center",
              fontSize: "1.2rem",
              color: "rgba(0, 0, 0, 0.54)",
            }}
          >
            <span>No data found</span>
          </div>
        )}
      </Box>
    </Card>
  );
}

AppEnvironmentalImpactChart.propTypes = {
  chart: PropTypes.shape({
    labels: PropTypes.array,
    colors: PropTypes.array,
    series: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        unit: PropTypes.string,
        fill: PropTypes.string,
      })
    ),
    options: PropTypes.object,
  }),
  subheader: PropTypes.string,
  title: PropTypes.string,
};
