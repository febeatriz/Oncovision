import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DataTable from "@/components/DataTable"; // Reutilizando nosso componente de tabela!

// Tipagem para a linha de resultado do modelo
interface PredictionResult {
    gabarito: string;
    previsão: string;
}

// Tipagem para as props do componente
interface PredictionsPageProps {
    results: PredictionResult[] | null;
    accuracy: number | null;
}

const PredictionsPage = ({ results, accuracy }: PredictionsPageProps) => {
    // Guarda de proteção caso os dados ainda não tenham chegado
    if (!results || accuracy === null) {
        return (
            <div className="text-center text-muted-foreground py-10">
                <p>Aguardando dados de previsão...</p>
                <p className="text-sm">Faça o upload de um arquivo para ver os resultados do modelo.</p>
            </div>
        );
    }

    // Formata a acurácia para exibição
    const accuracyPercentage = (accuracy * 100).toFixed(2);

    // Prepara os dados para o nosso componente DataTable reutilizável
    const predictionTableData = {
        columns: ['gabarito', 'previsão'],
        rows: results,
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Resultados do Modelo Preditivo</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Análise da performance do modelo CatBoost treinado com uma parte dos seus dados e testado em outra parte, para simular um cenário real de previsão.
                </p>
            </div>

            {/* Card de Acurácia */}
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>Acurácia do Modelo</CardTitle>
                    <CardDescription>
                        Percentual de previsões corretas sobre o conjunto de teste (20% dos dados).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                        <span className="text-5xl font-bold text-primary">{accuracyPercentage}%</span>
                    </div>
                    <Progress value={parseFloat(accuracyPercentage)} className="w-full" />
                </CardContent>
            </Card>

            {/* Card da Tabela de Comparação */}
            <Card>
                <CardHeader>
                    <CardTitle>Comparação: Gabarito vs. Previsão</CardTitle>
                    <CardDescription>
                        Tabela comparando os valores reais (gabarito) com os valores previstos pelo modelo para o conjunto de teste.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable data={predictionTableData} />
                </CardContent>
            </Card>
        </div>
    );
};

export default PredictionsPage;