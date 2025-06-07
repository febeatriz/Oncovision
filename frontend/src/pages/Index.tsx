import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

import Header from "@/components/Header";
import WelcomePopup from "@/components/WelcomePopup";
import FileUploader from "@/components/FileUpload";
import DataTable from "@/components/DataTable";

// --- NOVOS COMPONENTES DE GRÁFICO (crie estes arquivos) ---
import MortalityByTypeChart from "@/components/charts/MortalityByTypeChart";
import MortalityByAgeChart from "@/components/charts/MortalityByAgeChart";
import TreatmentOutcomeChart from "@/components/charts/TreatmentOutcomeChart";
import SurvivalDaysChart from "@/components/charts/SurvivalDaysChart";

// Tipagem para uma linha da tabela
interface TableRow {
  id?: number | string;
  [key: string]: any;
}

// Tipagem para os dados da tabela
interface DataTableData {
  columns: string[];
  rows: TableRow[];
}

// --- NOVO: Tipagem para a resposta completa da API ---
interface ApiResponse {
  base_tratada: TableRow[];
  grafico_tipo_mortalidade: any[];
  grafico_idade_mortalidade: any[];
  grafico_tratamento_resultado: any[];
  grafico_sobrevida_diagnostico: any[];
}

const Index = () => {
  // --- ESTADOS ALTERADOS ---
  const [dataTableData, setDataTableData] = useState<DataTableData>({ columns: [], rows: [] });
  const [mortalityByTypeData, setMortalityByTypeData] = useState<any[] | null>(null);
  const [mortalityByAgeData, setMortalityByAgeData] = useState<any[] | null>(null);
  const [treatmentOutcomeData, setTreatmentOutcomeData] = useState<any[] | null>(null);
  const [survivalData, setSurvivalData] = useState<any[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);

  // Efeito para o pop-up de boas-vindas (sem alterações)
  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcomeDashboardShown');
    if (welcomeShown) {
      setShowWelcomePopup(false);
    }
  }, []);

  const handleCloseWelcomePopup = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('welcomeDashboardShown', 'true');
  };

  // --- LÓGICA ALTERADA PARA LIDAR COM A NOVA RESPOSTA DA API ---
  const handleDataReceivedFromBackend = (apiResponse: ApiResponse | null) => {
    setIsLoading(false);

    if (apiResponse && apiResponse.base_tratada) {
      const {
        base_tratada,
        grafico_tipo_mortalidade,
        grafico_idade_mortalidade,
        grafico_tratamento_resultado,
        grafico_sobrevida_diagnostico
      } = apiResponse;

      // 1. Processa dados para a Tabela
      if (base_tratada.length > 0) {
        const columnNames = Object.keys(base_tratada[0]);
        setDataTableData({ columns: columnNames, rows: base_tratada });
      } else {
        setDataTableData({ columns: [], rows: [] });
      }

      // 2. Armazena dados para os gráficos
      setMortalityByTypeData(grafico_tipo_mortalidade);
      setMortalityByAgeData(grafico_idade_mortalidade);
      setTreatmentOutcomeData(grafico_tratamento_resultado);
      setSurvivalData(grafico_sobrevida_diagnostico);

      setUploadError(null);
      setActiveTab("viewData");
      toast.success("Arquivo processado e dados recebidos com sucesso!");
    } else {
      // Reseta todos os estados em caso de erro ou resposta vazia
      setDataTableData({ columns: [], rows: [] });
      setMortalityByTypeData(null);
      setMortalityByAgeData(null);
      setTreatmentOutcomeData(null);
      setSurvivalData(null);
      if (uploadError) {
        toast.error(uploadError || "Falha ao processar o arquivo.");
      } else {
        toast.warn("Arquivo processado, mas sem dados retornados.");
      }
    }
  };

  const hasData = dataTableData.rows.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}
      <Header />

      <main className="flex-1 container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 bg-pink-100">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="viewData" disabled={!hasData || isLoading}>Análises</TabsTrigger>
            <TabsTrigger value="charts" disabled={!hasData || isLoading}>Gráficos</TabsTrigger>
          </TabsList>

          {/* Aba de Upload (sem grandes alterações na renderização) */}
          <TabsContent value="upload">
            <div className="max-w-md mx-auto text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Faça o Upload do seu Arquivo</h2>
              <p className="text-muted-foreground">
                Envie um arquivo CSV para análise. O backend fará o tratamento e a agregação dos dados.
              </p>
            </div>
            <div className="flex justify-center">
              {/* O FileUploader agora passa o objeto ApiResponse completo para a função de callback */}
              <FileUploader
                onFileUpload={handleDataReceivedFromBackend}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setUploadError={setUploadError}
              />
            </div>
            {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <p className="text-muted-foreground">Enviando e processando arquivo...</p>
              </div>
            )}
            {uploadError && !isLoading && (
              <p className="text-center mt-4 text-destructive">{uploadError}</p>
            )}
          </TabsContent>

          {/* Aba de Visualização de Dados (Tabela) */}
          <TabsContent value="viewData">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Revise os Dados Tratados</h2>
              <p className="text-muted-foreground">
                Os dados abaixo foram tratados pelo backend.
              </p>
            </div>
            {hasData ? (
              <>
                <DataTable data={dataTableData} />
                <div className="flex justify-center mt-8">
                  <Button size="lg" onClick={() => setActiveTab("charts")}>
                    Visualizar Gráficos
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                Nenhum dado para visualizar. Por favor, faça o upload de um arquivo.
              </p>
            )}
          </TabsContent>

          {/* --- ABA DE GRÁFICOS TOTALMENTE REFEITA --- */}
          <TabsContent value="charts">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Visualização Gráfica</h2>
              <p className="text-muted-foreground">
                Gráficos baseados nos dados agregados pelo backend.
              </p>
            </div>
            {hasData ? (
              <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Mortalidade por Tipo de Câncer</CardTitle>
                    <CardDescription>Quantidade de óbitos por tipo de tumor (CID).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MortalityByTypeChart data={mortalityByTypeData} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Mortalidade por Faixa Etária</CardTitle>
                    <CardDescription>Distribuição dos óbitos por idade.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MortalityByAgeChart data={mortalityByAgeData} />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Resultado por Tipo de Tratamento</CardTitle>
                    <CardDescription>Relação entre o tratamento realizado e o desfecho do paciente.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TreatmentOutcomeChart data={treatmentOutcomeData} />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Distribuição da Sobrevida Após Diagnóstico</CardTitle>
                    <CardDescription>Histograma do tempo (em dias) entre o diagnóstico e o óbito.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SurvivalDaysChart data={survivalData} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Nenhum dado carregado para gerar gráficos. Faça upload na aba "Upload".
              </p>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            OncoVision Dashboard - Análise de Dados de Pacientes.
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Seu Nome/Organização Aqui
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;