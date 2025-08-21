import React, { useState, useEffect, useCallback } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { PieChartOutline } from 'components/Outline';
import { useResource } from 'components/Resource';
import ReactEcharts from 'echarts-for-react';
import * as PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { findByID } from '../../types/risklevels';
import { useEntity } from './context';

// not the final solution
const colours = {
    risk: {
        high: '#F56D32',
        moderate: '#1DA090',
        low: '#396076',
        undefined: '#D1D3D8',
    }
}

export const RiskSummary = ({ className }) => {
    const navigate = useNavigate();
    const [chartOption, setChartOption] = useState(chart);
    const [riskCount, setRiskCount] = useState(null);
    const { state, riskSummary } = useEntity();
    const { risks, pending } = state;
    const { state: { labels } } = useResource();

    useEffect(() => {
        riskSummary();
    }, [riskSummary]);

    const renderChart = useCallback((custRisk) => {
        let custCount = 0;
        chart.color = [];
        chart.series[0].data = [];

        custRisk.forEach(insight => {
            const risk = findByID(insight.getRisk())
            chart.color.push(colours.risk[risk.key.toLowerCase()]);
            chart.series[0].data.push({
                value: insight.getCount(), name: risk.label,
                key: risk.value
            });
            chart.legend.selected[risk.label] = true;
            custCount += insight.getCount();
        });

        setChartOption(chart);
        setRiskCount(custCount);

    }, []);

    useEffect(() => {
        renderChart(risks)
    }, [renderChart, risks]);

    const onLegendSelect = (event) => {
        chartOption.legend.selected = event.selected;

        const custCount = chartOption.series[0].data.reduce((count, data) => {
            if (event.selected[data.name] === true) {
                count += data.value;
            }
            return count;
        }, 0);

        setRiskCount(custCount);
    };

    return (
        <Card sx={{ className }} elevation={0} data-test="customer-risk">
            <CardHeader
                disableTypography
                title={<>
                    <Typography variant="h2" color="secondary" style={{ display: 'inline' }}>{labels.insights.title}</Typography>
                    <Chip
                        label={riskCount} size="small" sx={{
                            marginTop: -1,
                            marginLeft: 1
                        }} />
                </>}
            />
            <CardContent>
                <PieChartOutline visible={pending} />
                {!pending && chartOption &&
                    <ReactEcharts
                        option={chartOption}
                        onEvents={{
                            'click': (event) => navigate(`/customers/risk-${event.data.key}`),
                            'legendselectchanged': (event) => onLegendSelect(event)
                        }}
                        style={{ height: '410px' }}
                    />
                }
            </CardContent>
        </Card>
    );
};

const chart = {
    color: [],
    legend: {
        show: true,
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
            decoration: 'none',
            fontFamily: "'inter', sans-serif",
            fontSize: 12,
            lineHeight: 12,
        },
        itemGap: 20,
        selected: {},
    },
    textStyle: {
        fontSize: 12,
        decoration: 'none',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 24
    },
    series: [
        {
            type: 'pie',
            radius: ['30%', '55%'],
            center: ['50%', '35%'],
            data: [],
            itemStyle: {
                label: {
                    formatter: function (params) {
                        return `${params.name}\n(${params.percent}%)`;
                    }
                },
                shadowBlur: 100,
                shadowColor: 'rgba(0, 0, 0, 0.05)',
            }
        }
    ]
};

RiskSummary.propTypes = {
    className: PropTypes.string
};

export default RiskSummary;
