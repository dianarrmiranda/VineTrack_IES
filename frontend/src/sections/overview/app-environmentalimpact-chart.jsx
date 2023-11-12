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

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <Box sx={{ p: 3, pb: 1 }}>
                <Chart
                    dir="ltr"
                    type="line"
                    series={series.map((s) => ({ name: s.name, data: s.data }))}
                    options={chartOptions}
                    width="100%"
                    height={364}
                />
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

