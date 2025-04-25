
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUpload: (data: { columns: string[], rows: any[] }) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const processCSV = (text: string) => {
    try {
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map(header => header.trim());
      
      const rows = lines.slice(1).map(line => {
        const values = line.split(",").map(value => value.trim());
        const row: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          // Try to convert numeric values
          const value = values[index] || "";
          const numericValue = parseFloat(value);
          row[header] = isNaN(numericValue) ? value : numericValue;
        });
        
        return row;
      });

      return { columns: headers, rows };
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Failed to process CSV file. Please check the format.");
      return { columns: [], rows: [] };
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = processCSV(text);
      
      if (data.rows.length > 0) {
        onFileUpload(data);
        toast.success("File uploaded successfully!");
      }
    };
    
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    
    reader.readAsText(file);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Arquivo CSV</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"
          } hover:border-primary/50 transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
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
                {fileName ? `Selected: ${fileName}` : "Apenas arquivos CSV"}
              </p>
            </div>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Certifique-se de que seu arquivo CSV contém as características necessárias para a análise</p>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
