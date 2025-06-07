// src/components/DataTable.jsx
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DataTable = ({ data }) => { // data = { columns: [], rows: [] }
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleRows, setVisibleRows] = useState(5);

  if (!data || !data.rows || !data.columns) {
    return (
      <Card className="w-full max-w-[1300px]">
        <CardHeader>
          <CardTitle className="text-xl">Visualização dos Dados</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Sem dados para exibir ou formato de dados incorreto.</p>
        </CardContent>
      </Card>
    );
  }

  const filteredRows = data.rows.filter(row => {
    const values = Object.values(row).map(value =>
      value != null ? value.toString().toLowerCase() : "" // Adicionado != null para segurança
    );
    return values.some(value =>
      value.includes(searchTerm.toLowerCase())
    );
  });

  const displayedRows = filteredRows.slice(0, visibleRows);

  const handleLoadMore = () => {
    setVisibleRows(prev => prev + 5);
  };

  return (
    <Card className="w-full max-w-[1300px]">
      <CardHeader>
        <CardTitle className="text-xl">Visualização dos Dados Tratados</CardTitle>
        <CardDescription>
          Vendo {displayedRows.length} de {filteredRows.length} entradas (Total original: {data.rows.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Procurar nos dados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border overflow-hidden max-h-[400px] overflow-y-auto overflow-x-auto">
          <Table className="min-w-max">
            <TableHeader className="sticky top-0 bg-background z-10"> {/* Adicionado z-index */}
              <TableRow>
                {data.columns.map((column, idx) => (
                  <TableHead key={idx} className="font-semibold">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedRows.length > 0 ? (
                displayedRows.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {data.columns.map((column, colIdx) => (
                      <TableCell key={colIdx}>
                        {row[column] !== undefined && row[column] !== null ? row[column].toString() : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={data.columns.length} className="text-center py-4">
                    Nenhum dado encontrado para o termo "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {visibleRows < filteredRows.length && (
          <div className="mt-4 text-center">
            <button
              onClick={handleLoadMore}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Carregar mais entradas
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;