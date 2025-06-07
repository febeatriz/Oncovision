# backend-fastapi/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO

app = FastAPI()

# --- MELHORIA: Adicionado localhost para maior compatibilidade ---
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    # Adicione aqui outras origens se necessário (ex: porta do Vite)
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...)):

    # --- CORREÇÃO: Tratamento de erro na leitura do arquivo ---
    try:
        conteudo = await file.read()
        df_PI = pd.read_csv(BytesIO(conteudo))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao ler o arquivo CSV. Verifique o formato. Detalhe: {str(e)}"
        )

    # --- CORREÇÃO: Envolver todo o processamento em um try/except ---
    try:
        df_tratada = trataBase(df_PI.copy())

        # --- MELHORIA: Adicionado .copy() para evitar SettingWithCopyWarning ---
        df_obito_cancer = df_tratada[df_tratada["ultinfo"] == "OBITO POR CANCER"].copy()

        # grafico tipo_mortalidade
        df_obito_por_tipo = df_obito_cancer['descido'].value_counts().reset_index()
        df_obito_por_tipo.columns = ['tipo_cancer', 'quantidade']

        # grafico_faixa_morte
        df_faixa_morte = df_obito_cancer["faixaetar"].value_counts().reset_index()
        df_faixa_morte.columns = ["Idade", "quantidade"]

        # gráfico tratamento_resultado
        df_tratamento_raw = df_tratada[df_tratada["ultinfo"].isin([
            "OBITO POR CANCER", "VIVO, COM CANCER", "VIVO, SOE"
        ])]
        df_tratamento = df_tratamento_raw.groupby(["tratamento", "ultinfo"]).size().unstack(fill_value=0)
        
        # --- MELHORIA: Lida com o caso de não haver dados para o gráfico ---
        if not df_tratamento.empty:
            df_tratamento["total"] = df_tratamento.sum(axis=1)
            df_tratamento = df_tratamento.sort_values(by="total", ascending=False).drop(columns="total")
        df_tratamento_resultado = df_tratamento.reset_index()

        # gráfico sobrevida_diagnostico
        df_sobrevida = df_obito_cancer # .copy() já foi feito acima
        df_sobrevida = df_sobrevida[df_sobrevida["dtdiag"].notna() & df_sobrevida["dtultinfo"].notna()]
        if not df_sobrevida.empty:
            df_sobrevida["dias_sobrevida"] = (df_sobrevida["dtultinfo"] - df_sobrevida["dtdiag"]).dt.days
            df_sobrevida = df_sobrevida[df_sobrevida["dias_sobrevida"] >= 0]
        
        df_sobrevida_json = df_sobrevida[["dias_sobrevida"]] # Apenas os dias são necessários para o histograma

        # --- CORREÇÃO CRÍTICA: Converter NaN/NaT para None (null em JSON) ---
        # Isso garante que dados ausentes sejam enviados corretamente para o frontend.
        base_tratada_json = df_tratada.astype(object).where(pd.notnull(df_tratada), None).to_dict(orient="records")

        return {
            "base_tratada": base_tratada_json,
            "grafico_tipo_mortalidade": df_obito_por_tipo.to_dict(orient="records"),
            "grafico_idade_mortalidade": df_faixa_morte.to_dict(orient="records"),
            "grafico_tratamento_resultado": df_tratamento_resultado.to_dict(orient="records"),
            "grafico_sobrevida_diagnostico": df_sobrevida_json.to_dict(orient="records")
        }

    except Exception as e:
        # Retorna um erro 500 se algo der errado no tratamento dos dados
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno ao processar os dados: {str(e)}"
        )

# A função trataBase agora é interna, pode ser movida para dentro do endpoint ou mantida aqui
def trataBase(df_PI: pd.DataFrame) -> pd.DataFrame:
    # --- CORREÇÃO: Remoção segura de colunas ---
    colunas_a_remover = ["ibge", "t", "n", "m", "pt", "pn", "pm", "s", "g", "meta01", "meta02", "meta03", "outracla", "cici", "cicigrup", "cicisubgru", "rec01", "rec02", "rec03", "rec04"]
    colunas_existentes_para_remover = [col for col in colunas_a_remover if col in df_PI.columns]
    df_PI = df_PI.drop(columns=colunas_existentes_para_remover)

    # O dicionário gigante vai aqui...
    simNao = {1: "SIM", 0: "NÃO"}
    dicionarioCompleto = { "sexo": {1: "MASCULINO", 2: "FEMININO"}, "ultinfo": {1: "VIVO, COM CANCER", 2: "VIVO, SOE", 3: "OBITO POR CANCER", 4: "OBITO POR OUTRAS CAUSAS, SOE"}, "cirurgia": simNao, "escolari": {1: "ANALFABETO", 2: "ENS. FUND. INCOMPLETO", 3: "ENS. FUND. COMPLETO", 4: "ENSINO MÉDIO", 5: "SUPERIOR", 9: "IGNORADA"} } # ...etc, coloque seu dicionário completo
    
    for coluna, mapeamento in dicionarioCompleto.items():
        if coluna in df_PI.columns:
            # A lógica de replace já é robusta o suficiente
            df_PI[coluna] = df_PI[coluna].replace(mapeamento)
    
    # passando as colunas de data para o tipo data
    date_columns = ["dtconsult", "dtdiag", "dtultinfo", "dtrecidiva", "dttrat"]
    for col in date_columns:
        if col in df_PI.columns:
            df_PI[col] = pd.to_datetime(df_PI[col], errors="coerce")

    return df_PI