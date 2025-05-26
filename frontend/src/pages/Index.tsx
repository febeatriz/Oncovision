// src/pages/Index.jsx
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Importe se for usar o Button de shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Se for usar Cards para resumo
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Importe Tabs

import FileUploader from "@/components/FileUpload";
import TopographyChart from "@/components/TopographyChart";
import PatientSexChart from "@/components/PatientSexChart";
import DataTable from "@/components/DataTable"; // Assumindo que você quer usar o DataTable

// Se você tiver um Header para esta página, descomente
// import Header from "@/components/Header";

const Index = () => {
  // Estado para os dados brutos do CSV (apenas para passar ao DataTable, se necessário)
  // No nosso caso, o backend já trata, então 'processedDataFromBackend' é mais preciso
  const [processedDataFromBackend, setProcessedDataFromBackend] = useState(null);

  // Estado para controlar a visibilidade dos gráficos
  const [showCharts, setShowCharts] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // Para o FileUploader
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  // Chamado pelo FileUploader quando o backend retorna os dados tratados
  const handleDataReceivedFromBackend = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      setProcessedDataFromBackend(jsonData);
      setUploadError(null);
      setShowCharts(false); // Reseta a exibição de gráficos ao carregar novos dados
      setActiveTab("viewData"); // Muda para a aba de visualização/análise
      toast.success("Arquivo processado pelo backend e dados recebidos!");
    } else if (jsonData && jsonData.length === 0) {
      setProcessedDataFromBackend(null);
      setShowCharts(false);
      toast.warn("Arquivo processado, mas sem dados retornados pelo backend.");
    } else if (!jsonData && !uploadError) { // Caso o upload falhe
      setProcessedDataFromBackend(null);
      setShowCharts(false);
    }
  };

  const handleVisualizeCharts = () => {
    if (!processedDataFromBackend || processedDataFromBackend.length === 0) {
      toast.error("Nenhum dado carregado para gerar gráficos.");
      return;
    }
    setShowCharts(true);
    setActiveTab("charts"); // Muda para a aba de gráficos
    toast.info("Gerando visualizações gráficas...");
  };

  // Preparar dados para o DataTable (colunas e linhas)
  const tableColumns = processedDataFromBackend && processedDataFromBackend.length > 0
    ? Object.keys(processedDataFromBackend[0])
    : [];

  const dataForTable = {
    columns: tableColumns,
    rows: processedDataFromBackend || []
  };

  return (
    <div className="flex flex-col">
      {/* <Header /> */}
      <main className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard de Análise de Dados de Pacientes
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
            Siga as abas para carregar, visualizar e analisar seus dados.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="upload">1. Upload</TabsTrigger>
            <TabsTrigger value="viewData" disabled={!processedDataFromBackend}>
              2. Visualizar Dados
            </TabsTrigger>
            <TabsTrigger value="charts" disabled={!showCharts || !processedDataFromBackend}>
              3. Gráficos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="max-w-md mx-auto text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Faça o Upload do seu Arquivo</h2>
              <p className="text-muted-foreground">
                Envie um arquivo CSV para análise. O backend fará o tratamento inicial dos dados.
              </p>
            </div>
            <div className="flex justify-center">
              <FileUploader
                onFileUpload={handleDataReceivedFromBackend}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setUploadError={setUploadError}
              />
            </div>
            {isLoading && <p className="text-center mt-4">Enviando e processando arquivo...</p>}
            {uploadError && <p className="text-center mt-4" style={{ color: 'red' }}>Erro no upload: {uploadError}</p>}
          </TabsContent>

          <TabsContent value="viewData" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Revise os Dados Tratados</h2>
              <p className="text-muted-foreground">
                Os dados abaixo foram tratados pelo backend. Clique no botão para gerar os gráficos.
              </p>
            </div>

            {processedDataFromBackend && (
              <>
                <DataTable data={dataForTable} />
                <div className="flex justify-center mt-8">
                  <Button size="lg" onClick={handleVisualizeCharts} disabled={showCharts}>
                    {showCharts ? "Gráficos Gerados" : "Visualizar Estatísticas / Gráficos"}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Visualização Gráfica</h2>
              <p className="text-muted-foreground">
                Gráficos baseados nos dados tratados pelo backend.
              </p>
            </div>

            {showCharts && processedDataFromBackend && (
              <div className="grid gap-8 lg:grid-cols-2"> {/* Layout para múltiplos gráficos */}
                <TopographyChart rawData={processedDataFromBackend} />
                <PatientSexChart rawData={processedDataFromBackend} />
                {/* Adicione mais componentes de gráfico aqui conforme necessário */}
              </div>
            )}
            {!showCharts && processedDataFromBackend && (
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Clique em "Visualizar Estatísticas / Gráficos" na aba anterior para gerar as visualizações.
                </p>
                <Button onClick={() => setActiveTab("viewData")}>
                  Voltar para Visualizar Dados
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Dashboard de Pacientes
        </div>
      </footer>
    </div>
  );
};

export default Index;