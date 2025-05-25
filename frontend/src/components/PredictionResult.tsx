
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PredictionResultProps {
  prediction: {
    malignant: number;
    benign: number;
  } | null;
  confidence: number | null;
}

const PredictionResult = ({ prediction, confidence }: PredictionResultProps) => {
  if (!prediction) {
    return null;
  }

  const data = [
    { name: 'Benign', value: prediction.benign },
    { name: 'Malignant', value: prediction.malignant }
  ];

  const COLORS = ['#4ade80', '#f43f5e'];

  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={14}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getPredictionClass = () => {
    if (prediction.malignant > prediction.benign) {
      return "Malignant";
    } else {
      return "Benign";
    }
  };

  const predictionClass = getPredictionClass();
  const predictionColor = predictionClass === "Malignant" ? "text-destructive" : "text-green-500";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Prediction Result</CardTitle>
        <CardDescription>
          Analysis based on your dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-4 text-center">
          <p className="text-sm mb-1">Predicted Classification</p>
          <h3 className={`text-2xl font-bold ${predictionColor}`}>{predictionClass}</h3>
          {confidence !== null && (
            <p className="text-sm text-muted-foreground mt-1">
              Confidence: {(confidence * 100).toFixed(1)}%
            </p>
          )}
        </div>
        
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
