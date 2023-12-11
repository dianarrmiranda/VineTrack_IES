import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled, useTheme } from '@mui/material/styles';
import { fNumber } from 'src/utils/format-number';
import Chart, { useChart } from 'src/components/chart';

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

const NoGrapesFoundAnnotation = {
  x: '50%', // X-coordinate where the annotation will appear (centered)
  y: '50%', // Y-coordinate where the annotation will appear (centered)
  borderColor: '#FF4560',
  label: {
    borderColor: '#FF4560',
    style: {
      color: '#fff',
      background: '#FF4560',
    },
    text: 'No types of grapes found',
  },
};

export default function AppNutritionChart({ title, subheader, chart, ...other }) {
  const theme = useTheme();
  const { colors, series, options } = chart;

  // Check if there are no series data
  const chartSeries = series.length === 0 ? [100] : series.map((i) => i.value); // Fill with 100% if no data

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.length === 0 ? ["No types of grapes found"] : series.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    // Only add annotation if there are no series data
    ...(series && series.length === 0 ? { annotations: { points: [NoGrapesFoundAnnotation] } } : {}),
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />
      <StyledChart dir="ltr" type="pie" series={chartSeries} options={chartOptions} width="100%" height={280} />
    </Card>
  );
}


AppNutritionChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
