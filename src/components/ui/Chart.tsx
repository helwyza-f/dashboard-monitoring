import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

interface ChartProps {
  labels: string[];
  data: number[];
  colors: string[];
}

const Chart: React.FC<ChartProps> = ({ labels, data, colors }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Jumlah Tes",
        data,
        backgroundColor: colors,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default Chart;
