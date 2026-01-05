// src/components/reports/BehaviorChart.jsx
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import styles from './BehaviorChart.module.css';

const getBarColor = (type) => {
    switch (type) {
        case "Positive": 
            return "#4ade80"; // green
        case "Negative":
            return "#f87171"; // red
        default: 
            return "#facc15"; // yellow
    }
}

const BehaviorChart = ({ data }) => {
    if (!data || !data.length) return <p>No behavior data to display.</p>;

    return (
        <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip wrapperClassName={styles.tooltip} />
                    <Legend wrapperStyle={styles.legend} />
                    <Bar dataKey="count">
                        {data.map((entry, index) => {
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BehaviorChart;
