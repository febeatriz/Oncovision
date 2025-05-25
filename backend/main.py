# backend-fastapi/main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
# import plotly.express as px # Removido pois não está sendo usado para gerar a resposta JSON
from io import BytesIO

app = FastAPI()

# ATENÇÃO: Ajuste "allow_origins" para o endereço do seu frontend React (geralmente http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # <--- ENDEREÇO DO SEU FRONTEND REACT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...)):
    conteudo = await file.read()
    
    try:
        df_PI = pd.read_csv(BytesIO(conteudo))
    except Exception as e:
        return {"error": f"Erro ao ler o arquivo CSV: {str(e)}"}


    def trataBase(df_PI: pd.DataFrame) -> pd.DataFrame:
        # removendo colunas que não vão ser usadas
        colunas_a_remover = ["ibge", "t", "n", "m", "pt", "pn", "pm", "s", "g", "meta01", "meta02", "meta03", "outracla"]
        # Verificar se as colunas existem antes de tentar removê-las
        colunas_existentes_para_remover = [col for col in colunas_a_remover if col in df_PI.columns]
        df_PI = df_PI.drop(columns=colunas_existentes_para_remover, errors='ignore')


        simNao = {
            1: "SIM",
            0: "NÃO"
        }
    
        dicionarioCompleto = {
            "cateatend": {1: "CONVENIO", 2: "SUS", 3: "PARTICULAR", 9: "SEM INFORMÇÃO"},
            "clinica": {1: "ALERGIA/IMUNOLOGIA", 2: "CIRURGIA CARDIACA", 3: "CIRURGIA CABEÇA E PESCOÇO", 4: "CIRURGIA GERAL", 5: "CIRURGIA PEDIATRICA", 6: "CIRURGIA PLASTICA", 7: "CIRURGIA TORAXICA", 8: "CIRURGIA VASCULAR", 9: "CLINICA MEDICA", 10: "DERMATOLOGIA", 11: "ENDOCRINOLOGIA", 12: "GASTROCIRURGIA", 13: "GASTROENTEROLOGIA", 14: "GERIATRIA", 15: "GINECOLOGIA", 16: "GINECOLOGIA / OBSTETRICIA", 17: "HEMATOLOGIA", 18: "INFECTOLOGIA", 19: "NEFROLOGIA", 20: "NEUROCIRURGIA", 21: "NEUROLOGIA", 22: "OFTALMOLOGIA", 23: "ONCOLOGIA CIRURGICA", 24: "ONCOLOGIA CLINICA", 25: "ONCOLOGIA PEDIATRICA", 26: "ORTOPEDIA", 27: "OTORRINOLARINGOLOGIA", 28: "PEDIATRIA", 29: "PNEUMOLOGIA", 30: "PROCTOLOGIA", 31: "RADIOTERAPIA", 32: "UROLOGIA", 33: "MASTOLOGIA", 34: "ONCOLOGIA CUTANEA", 35: "CIRURGIA PELVICA", 36: "CIRURGIA ABDOMINAL", 37: "ODONTOLOGIA", 38: "TRANSPLANTE HEPATICO", 99: "IGNORADO"},
            "escolari": {1: "ANALFABETO", 2: "ENS. FUND. INCOMPLETO", 3: "ENS. FUND. COMPLETO", 4: "ENSINO MÉDIO", 5: "SUPERIOR", 9: "IGNORADA"},
            "sexo": {1: "MASCULINO", 2: "FEMININO"},
            "ufnasc": {"SI": "SEM INFORMAÇÃO", "OP": "OUTRA PAÍS"},
            "ufresid": {"OP": "OUTRO PAÍS"},
            "diagprev": {1: "SEM DIAGNÓSTICO / SEM TRATAMENTO", 2: "COM DIAGNÓSTICO / SEM TRATAMENTO", 3: "COM DIAGNÓSTICO / COM TRATAMENTO", 4: "OUTROS" },
            "basediag": {1: "EXAME CLINICO", 2: "RECURSOS AUXILIARES NÃO MICROSCÓPICOS", 3: "CONFIRMAÇÃO MICROSCÓPICA", 4: "SEM INFORMAÇÃO" },
            "localtnm": {1: "SUPERIOR", 2: "MEDIO", 3: "INFERIOR", 8: "NÃO SE APLICA", 9: "X" },
            "idmitotic": {1: "ALTA", 2: "BAIXA", 8: "NÃO SE APLICA", 9: "X"},
            "psa": {1: "MENOR QUE 10", 2: "MAIOR OU IGUAL A 10 E MENOR QUE 20", 3: "MAIOR OU IGUAL A 20", 8: "NÃO SE APLICA", 9: "X" },
            "gleason": {1: "MENOR OU IGUAL A 6", 2: "IGUAL A 7", 3: "MAIOR OU IGUAL A 8", 8: "NÃO SE APLICA", 9: "X"},
            "naotrat": {1: "RECUSA DO TRATAMENTO", 2: "DOENÇA AVANÇADA, FALTA DE CONDIÇÕES CLINICAS", 3: "OUTRAS DOENÇAS ASSOCIADAS", 4: "ABANDONO DE TRATAMENTO", 5: "OBITO POR CANCER", 6: "OBITO POR OUTRAS CAUSAS, SOE", 7: "OUTRAS", 8: "NÃO SE APLICA (CASO TENHA TRATAMENTO)", 9: "SEM INFORMAÇÃO"},
            "tratamento": {"A": "CIRURGIA", "B": "RADIOTERAPIA", "C": "Quimioterapia", "D": "Cirurgia + Radioterapia", "E": "Cirurgia + Quimioterapia", "F": "Radioterapia + Quimioterapia", "G": "Cirurgia + Radio + Quimo", "H": "Cirurgia + Radio + Quimo + Hormônio", "I": "Outras combinações de tratamento", "J": "Nenhum tratamento realizado"},
            "trathosp": {"A": "Cirurgia", "D": "Cirurgia + Radioterapia", "E": "Cirurgia + Quimioterapia", "C": "Quimioterapia", "B": "Radioterapia", "F": "Radioterapia + Quimioterapia", "G": "Cirurgia + Radio + Quimo", "H": "Cirurgia + Radio + Quimo + Hormônio", "I": "Outras combinações de tratamento", "J": "Nenhum tratamento realizado"},
            "tratfantes": {"A": "Cirurgia", "B": "Radioterapia", "C": "Quimioterapia", "D": "Cirurgia + Radioterapia", "E": "Cirurgia + Quimioterapia", "F": "Radioterapia + Quimioterapia", "G": "Cirurgia + Radio + Quimo", "H": "Cirurgia + Radio + Quimo + Hormônio", "I": "Outras combinações de tratamento", "J": "Nenhum tratamento realizado", "K": "Sem informação" },
            "tratfapos": {"A": "Cirurgia", "B": "Radioterapia", "C": "Quimioterapia", "D": "Cirurgia + Radioterapia", "E": "Cirurgia + Quimioterapia", "F": "Radioterapia + Quimioterapia", "G": "Cirurgia + Radio + Quimo", "H": "Cirurgia + Radio + Quimo + Hormônio", "I": "Outras combinações de tratamento", "J": "Nenhum tratamento realizado", "K": "Sem informação" },
            "nenhum": simNao, "cirurgia": simNao, "radio": simNao, "quimio": simNao, "hormonio": simNao, "tmo": simNao, "imuno": simNao, "outros": simNao,
            "nenhumant": simNao, "cirurant": simNao, "radioant": simNao, "quimioant": simNao, "hormoant": simNao, "tmoant": simNao, "imunoant": simNao, "outroant": simNao,
            "nenhumapos": simNao, "cirurapos": simNao, "radioapos": simNao, "quimioapos":simNao, "hormoapos": simNao, "tmoapos": simNao, "imunoapos": simNao, "outroapos": simNao,
            "ultinfo": {1: "ATIVO", 2: "ATIVO COM RECIDIVA", 3: "OBITO POR CANCER", 4: "OBITO POR OUTRA CAUSA", 9: "SEM INFORMACAO"}, # Adicionei um mapeamento para ultinfo, ajuste conforme necessário
            "laterali": {1: "DIREITA", 2: "ESQUERDA", 3: "BILATERAL", 8: "NÃO SE APLICA"},
            "perdaseg": {0: "NÃO", 1: "SIM", 8: "Não se aplica (excluído do cálculo para o indicador perda de seguimento)" },
            "erro": {0: "SEM", 1: "COM"},
            "reclocal": simNao, "recregio": simNao, "recdist":simNao,
            "habilit": {1:  "UNACON", 2:  "UNACON com Serviço de Radioterapia", 3:  "UNACON com Serviço de Hematologia", 5:  "UNACON exclusiva de Oncologia Pediátrica", 6:  "CACON", 7:  "CACON com Serviço de Oncologia Pediátrica", 8:  "Hospital Geral com Cirurgia Oncológica", 9:  "UNACON com Serviços de Radioterapia e de Hematologia", 10:  "UNACON com Serviços de Hematologia e de Oncologia Pediátrica", 12:  "UNACON com Serviços de Radioterapia, de Hematologia e de Oncologia Pediátrica", 13:  "Voluntário", 14:  "Inativo", 15:  "UNACON exclusiva de Oncologia Pediátrica com Serviço de Radioterapia"},
            "habilit1": {1: "UNACON", 2: "UNACON exclusivo de Oncologia Pediátrica", 3: "CACON", 4: "Hospital Geral", 5: "Voluntários", 6: "Inativos"},
            "habilit2": {1: "UNACON", 2: "CACON", 3: "Hospital Geral", 4: "Voluntários", 5: "Inativos"}
        }

        for coluna, mapeamento in dicionarioCompleto.items():
            if coluna in df_PI.columns:
                # Converter a coluna para string antes de tentar replace se o mapeamento for para strings
                # Isso evita erros se a coluna for numérica e o mapeamento tiver chaves numéricas
                # mas os valores do mapeamento forem strings.
                if any(isinstance(v, str) for v in mapeamento.values()):
                     df_PI[coluna] = df_PI[coluna].astype(str).replace(mapeamento.keys(), mapeamento.values())
                else: # Se os valores do mapeamento também forem numéricos ou não strings
                     df_PI[coluna] = df_PI[coluna].replace(mapeamento)


        # Convertendo colunas de data para o tipo data
        date_columns = ["dtconsult", "dtdiag", "dtultinfo", "dtrecidiva", "dttrat"]
        for col in date_columns:
            if col in df_PI.columns:
                df_PI[col] = pd.to_datetime(df_PI[col], errors='coerce').astype(str) # Coerce para NaT se houver erro, depois string

        return df_PI

    try:
        df_tratada = trataBase(df_PI.copy())
        # Garantir que todos os NaT (Not a Time) e NaN sejam convertidos para None (null em JSON)
        df_tratada = df_tratada.where(pd.notnull(df_tratada), None)
        return df_tratada.to_dict(orient="records")
    except Exception as e:
        return {"error": f"Erro ao tratar os dados: {str(e)}"}

# Para rodar: uvicorn main:app --reload --port 8000