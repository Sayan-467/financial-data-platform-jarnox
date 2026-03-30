import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StockChart({ data, symbol, predictedPrices = [], showPrediction = false }) {
  if (!data?.length) {
    return <p className="status">No stock data available for chart.</p>;
  }

  const actualLabels = data.map((item) => new Date(item.Date).toLocaleDateString());
  const predictionLength = showPrediction ? predictedPrices.length : 0;
  const lastDate = new Date(data[data.length - 1].Date);
  const futureLabels = Array.from({ length: predictionLength }, (_, index) => {
    const future = new Date(lastDate);
    future.setDate(future.getDate() + index + 1);
    return future.toLocaleDateString();
  });
  const labels = [...actualLabels, ...futureLabels];

  const closeSeries = data.map((item) => Number(item.Close));
  const closeWithFuturePadding = [...closeSeries, ...Array(predictionLength).fill(null)];
  const movingAverageSeries = data.map((item) =>
    item.MA_7 === null || item.MA_7 === undefined ? null : Number(item.MA_7)
  );
  const movingAverageWithFuturePadding = [...movingAverageSeries, ...Array(predictionLength).fill(null)];

  const predictionSeries = showPrediction
    ? [
        ...Array(Math.max(data.length - 1, 0)).fill(null),
        Number(data[data.length - 1].Close),
        ...predictedPrices
      ]
    : [];

  const chartData = {
    labels,
    datasets: [
      {
        label: `${symbol} Close Price`,
        data: closeWithFuturePadding,
        borderColor: "#177e89",
        backgroundColor: "rgba(23, 126, 137, 0.2)",
        borderWidth: 2,
        tension: 0.28,
        pointRadius: 1.5
      },
      {
        label: `${symbol} 7-Day MA`,
        data: movingAverageWithFuturePadding,
        borderColor: "#db3a34",
        backgroundColor: "rgba(219, 58, 52, 0.2)",
        borderWidth: 2,
        tension: 0.28,
        pointRadius: 1.2
      },
      ...(showPrediction
        ? [
            {
              label: `${symbol} Predicted Price`,
              data: predictionSeries,
              borderColor: "#6b7280",
              backgroundColor: "rgba(107, 114, 128, 0.2)",
              borderWidth: 2,
              borderDash: [8, 6],
              tension: 0.22,
              pointRadius: 1,
              spanGaps: true
            }
          ]
        : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: `${symbol} Price Trend`
      }
    }
  };

  return (
    <div className="chart-panel">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default StockChart;
