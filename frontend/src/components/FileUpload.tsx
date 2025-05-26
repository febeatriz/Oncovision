// src/components/FileUpload.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assumindo que esta importação funciona no seu setup
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const FileUpload = ({ onFileUpload, isLoading, setIsLoading, setUploadError }) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [showMascot, setShowMascot] = useState(true); // Lógica do mascote mantida do seu código original

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer'); // Seu código original procura por 'footer'
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        setShowMascot(footerRect.top > window.innerHeight);
      } else {
        setShowMascot(true); // Mostra se não houver footer
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  // Função de processamento de CSV do SEU CÓDIGO ORIGINAL.
  // No nosso novo fluxo, esta função não é mais necessária aqui,
  // pois o backend FastAPI fará o parsing e tratamento.
  // O FileUpload agora apenas envia o arquivo.
  /*
  const processCSV = (text) => {
    try {
      // ... (sua lógica de processCSV) ...
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Failed to process CSV file. Please check the format.");
      return { columns: [], rows: [] };
    }
  };
  */

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files?.length) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => { // Tornada async para o fetch
    if (!file.name.endsWith('.csv')) {
      toast.error("Por favor, envie um arquivo CSV");
      setUploadError("Formato de arquivo inválido. Por favor, envie um CSV.");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file); // 'file' é o nome esperado pelo backend FastAPI

    try {
      const response = await fetch('http://localhost:8000/upload_csv/', { // Verifique a porta
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Falha no upload: ${response.statusText}`);
      }

      // onFileUpload agora recebe os dados já processados pelo backend
      onFileUpload(responseData);
      // toast.success("Arquivo enviado e processado com sucesso!"); // O Index.jsx pode dar este toast

    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error(error.message || "Ocorreu um erro durante o upload.");
      setUploadError(error.message || "Ocorreu um erro durante o upload.");
      onFileUpload(null); // Informa o componente pai que falhou
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Seu JSX do FileUpload com a área de drag-and-drop e o mascote aqui...
    // Vou usar o JSX que você forneceu originalmente para este componente:
    <div className="relative w-full min-h-[500px] flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Arquivo CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center 
               ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"
              } hover:border-primary/50 transition-colors cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById("file-upload-main")?.click()} // ID único
          >
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <p className="font-medium">Arraste e solte seu arquivo CSV aqui para análise</p>
                <p className="text-sm text-muted-foreground">
                  {fileName ? `Selecionado: ${fileName}` : "Apenas arquivos CSV"}
                </p>
              </div>
            </div>
            <input
              id="file-upload-main" // ID único
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <p>Certifique-se de que seu arquivo CSV contém as características necessárias.</p>
        </CardFooter>
      </Card>
      {/* Mascote com balão de fala */}
      <div
        className={`block relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 mt-8 md:mt-0 z-50 transition-all duration-300 max-w-[300px] w-full 
           ${showMascot ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0 pointer-events-none'
          }`}
      >
        <div className="relative bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md w-full max-w-[256px] mb-4 mx-auto">
          <div className="text-center">
            <p className="text-sm mb-3">Se seu arquivo não está no formato necessário, converta aqui</p>
            <button
              onClick={() => window.open("https://convertio.co/pt/conversor-csv/", "_blank")}
              className="bg-pink-600 hover:bg-pink-700 text-orange-50 px-4 py-2 text-sm rounded-md border-none"
            >
              Converter
            </button>
          </div>
          <div className="absolute -bottom-2 left-[70%] -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 border-t-0 border-l-0 transform rotate-45"></div>
        </div>
        <div className="flex justify-center">
          <img
            src="/oncovision-mascot.png" // Certifique-se que este caminho está correto na sua pasta public
            alt="OncoVision Mascot"
            className="w-24 md:w-32 ml-16"
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;