from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO
import logging
from sklearn.model_selection import train_test_split
from catboost import CatBoostClassifier
from sklearn.metrics import accuracy_score

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configuração de CORS
origins = [
    "http://localhost:8080", "http://127.0.0.1:8080",
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:3000", "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dicionários e Funções de Tratamento
def get_dicionario_mapeamento():
    """Retorna o dicionário completo de mapeamentos para manter o código principal limpo."""
    simNao = {1: "SIM", 0: "NÃO"}
    dicionario = {
        "ultinfo": {1: "VIVO, COM CANCER", 2: "VIVO, SOE", 3: "OBITO POR CANCER", 4: "OBITO POR OUTRAS CAUSAS, SOE"},
        "cateatend": {1: "CONVENIO", 2: "SUS", 3: "PARTICULAR", 9: "SEM INFORMÇÃO"},
        "clinica": {1: "ALERGIA/IMUNOLOGIA", 2: "CIRURGIA CARDIACA", 3: "CIRURGIA CABEÇA E PESCOÇO", 4: "CIRURGIA GERAL", 5: "CIRURGIA PEDIATRICA", 6: "CIRURGIA PLASTICA", 7: "CIRURGIA TORAXICA", 8: "CIRURGIA VASCULAR", 9: "CLINICA MEDICA", 10: "DERMATOLOGIA", 11: "ENDOCRINOLOGIA", 12: "GASTROCIRURGIA", 13: "GASTROENTEROLOGIA", 14: "GERIATRIA", 15: "GINECOLOGIA", 16: "GINECOLOGIA / OBSTETRICIA", 17: "HEMATOLOGIA", 18: "INFECTOLOGIA", 19: "NEFROLOGIA", 20: "NEUROCIRURGIA", 21: "NEUROLOGIA", 22: "OFTALMOLOGIA", 23: "ONCOLOGIA CIRURGICA", 24: "ONCOLOGIA CLINICA", 25: "ONCOLOGIA PEDIATRICA", 26: "ORTOPEDIA", 27: "OTORRINOLARINGOLOGIA", 28: "PEDIATRIA", 29: "PNEUMOLOGIA", 30: "PROCTOLOGIA", 31: "RADIOTERAPIA", 32: "UROLOGIA", 33: "MASTOLOGIA", 34: "ONCOLOGIA CUTANEA", 35: "CIRURGIA PELVICA", 36: "CIRURGIA ABDOMINAL", 37: "ODONTOLOGIA", 38: "TRANSPLANTE HEPATICO", 99: "IGNORADO"},
        "escolari": {1: "ANALFABETO", 2: "ENS. FUND. INCOMPLETO", 3: "ENS. FUND. COMPLETO", 4: "ENSINO MÉDIO", 5: "SUPERIOR", 9: "IGNORADA"},
        "sexo": {1: "MASCULINO", 2: "FEMININO"},
        "ufnasc": {"SI": "SEM INFORMAÇÃO", "OP": "OUTRA PAÍS"}, "ufresid": {"OP": "OUTRO PAÍS"},
        "diagprev": {1: "SEM DIAGNÓSTICO / SEM TRATAMENTO", 2: "COM DIAGNÓSTICO / SEM TRATAMENTO", 3: "COM DIAGNÓSTICO / COM TRATAMENTO", 4: "OUTROS" },
        "basediag": {1: "EXAME CLINICO", 2: "RECURSOS AUXILIARES NÃO MICROSCÓPICOS", 3: "CONFIRMAÇÃO MICROSCÓPICA", 4: "SEM INFORMAÇÃO" },
        "localtnm": {1: "SUPERIOR", 2: "MEDIO", 3: "INFERIOR", 8: "NÃO SE APLICA", 9: "X" }, "idmitotic": {1: "ALTA", 2: "BAIXA", 8: "NÃO SE APLICA", 9: "X"},
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
        "laterali": {1: "DIREITA", 2: "ESQUERDA", 3: "BILATERAL", 8: "NÃO SE APLICA"},
        "perdaseg": {0: "NÃO", 1: "SIM", 8: "Não se aplica (excluído do cálculo para o indicador perda de seguimento)" },
        "erro": {0: "SEM", 1: "COM"}, "reclocal": simNao, "recregio": simNao, "recdist":simNao,
        "habilit": {1:  "UNACON", 2:  "UNACON com Serviço de Radioterapia", 3:  "UNACON com Serviço de Hematologia", 5:  "UNACON exclusiva de Oncologia Pediátrica", 6:  "CACON", 7:  "CACON com Serviço de Oncologia Pediátrica", 8:  "Hospital Geral com Cirurgia Oncológica", 9:  "UNACON com Serviços de Radioterapia e de Hematologia", 10:  "UNACON com Serviços de Hematologia e de Oncologia Pediátrica", 12:  "UNACON com Serviços de Radioterapia, de Hematologia e de Oncologia Pediátrica", 13:  "Voluntário", 14:  "Inativo", 15:  "UNACON exclusiva de Oncologia Pediátrica com Serviço de Radioterapia"},
        "habilit1": {1: "UNACON", 2: "UNACON exclusivo de Oncologia Pediátrica", 3: "CACON", 4: "Hospital Geral", 5: "Voluntários", 6: "Inativos"},
        "habilit2": {1: "UNACON", 2: "CACON", 3: "Hospital Geral", 4: "Voluntários", 5: "Inativos"}
    }
    return dicionario

def trataBase(df: pd.DataFrame) -> pd.DataFrame:
    """Aplica todas as transformações e limpezas necessárias no DataFrame."""
    df.dropna(how='all', inplace=True)
    
    # Remove espaços em branco no início e fim de todas as colunas de texto
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].str.strip()

    colunas_a_remover = ["ibge", "t", "n", "m", "pt", "pn", "pm", "s", "g", "meta01", "meta02", "meta03", "outracla", "cici", "cicigrup", "cicisubgru", "rec01", "rec02", "rec03", "rec04"]
    colunas_existentes = [col for col in colunas_a_remover if col in df.columns]
    df = df.drop(columns=colunas_existentes)

    dicionarioCompleto = get_dicionario_mapeamento()
    
    # Lógica de mapeamento corrigida para lidar com chaves numéricas e de texto
    for coluna, mapeamento in dicionarioCompleto.items():
        if coluna in df.columns:
            # Se as chaves do mapeamento forem números, converte a coluna para numérico primeiro
            if mapeamento and isinstance(next(iter(mapeamento.keys())), int):
                df[coluna] = pd.to_numeric(df[coluna], errors='coerce')
            
            # Aplica o mapeamento
            df[coluna] = df[coluna].replace(mapeamento)
    
    date_columns = ["dtconsult", "dtdiag", "dtultinfo", "dtrecidiva", "dttrat"]
    for col in date_columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce', dayfirst=True)
            
    return df

@app.post("/upload_csv/")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(('.csv', '.CSV')):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Formato de arquivo inválido. Por favor, envie um arquivo .csv")

    try:
        conteudo = await file.read()
        df_PI = pd.read_csv(BytesIO(conteudo), sep=',', encoding='utf-8-sig', low_memory=False)
        if df_PI.shape[1] < 2: 
            logger.info("Separador por vírgula não funcionou, tentando ponto e vírgula.")
            df_PI = pd.read_csv(BytesIO(conteudo), sep=';', encoding='utf-8-sig', low_memory=False)
    
    except Exception as e:
        logger.error(f"Erro de parsing no CSV: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Não foi possível ler o arquivo CSV. Verifique o formato e a codificação. Erro: {e}")

    try:
        df_tratada = trataBase(df_PI.copy())

        # Análises para os gráficos existentes
        df_obito_cancer = df_tratada[df_tratada["ultinfo"] == "OBITO POR CANCER"].copy()

        df_obito_por_tipo = df_obito_cancer['descido'].value_counts().reset_index()
        df_obito_por_tipo.columns = ['tipo_cancer', 'quantidade']

        df_faixa_morte = df_obito_cancer["faixaetar"].value_counts().reset_index()
        df_faixa_morte.columns = ["Idade", "quantidade"]

        df_tratamento_raw = df_tratada[df_tratada["ultinfo"].isin(["OBITO POR CANCER", "VIVO, COM CANCER", "VIVO, SOE"])]
        if not df_tratamento_raw.empty:
            df_tratamento = df_tratamento_raw.groupby(["tratamento", "ultinfo"]).size().unstack(fill_value=0)
            if not df_tratamento.empty:
                df_tratamento["total"] = df_tratamento.sum(axis=1)
                df_tratamento = df_tratamento.sort_values(by="total", ascending=False).drop(columns="total")
            df_tratamento_resultado = df_tratamento.reset_index()
        else:
            df_tratamento_resultado = pd.DataFrame(columns=['tratamento'])

        df_sobrevida = df_obito_cancer[df_obito_cancer["dtdiag"].notna() & df_obito_cancer["dtultinfo"].notna()].copy()
        if not df_sobrevida.empty:
            df_sobrevida["dias_sobrevida"] = (df_sobrevida["dtultinfo"] - df_sobrevida["dtdiag"]).dt.days
            df_sobrevida = df_sobrevida[df_sobrevida["dias_sobrevida"] >= 0]
        df_sobrevida_json = df_sobrevida[["dias_sobrevida"]]
        
        # Análises para os novos gráficos
        df_faixa_geral = df_tratada["faixaetar"].value_counts().reset_index()
        df_faixa_geral.columns = ["Idade", "quantidade"]
        
        # --- CORREÇÃO DO BUG APLICADA AQUI ---
        df_tratamentos_geral = df_tratada["tratamento"].value_counts().reset_index()
        df_tratamentos_geral.columns = ["tratamento", "quantidade"]

        base_tratada_json = df_tratada.astype(object).where(pd.notnull(df_tratada), None).to_dict(orient="records")
        
        # Lógica de Machine Learning...
        features_para_modelo = [
            'sexo','desctopo','tratamento','trathosp','tratfapos',
            'cirurgia','radio','tmo','outros','nenhumant','nenhumapos','outroapos',
            'consdiag','tratcons','diagtrat','laterali','perdaseg',
            'recnenhum','reclocal','recregio','recdist','rec01','rec02','rec03','rec04'
        ]
        
        features_existentes = [f for f in features_para_modelo if f in df_PI.columns]
        X = df_PI[features_existentes].copy()
        y = df_PI['ultinfo'].copy()

        cat_features = X.select_dtypes(include=['object', 'category']).columns.tolist()
        for col in X.columns:
            if col not in cat_features:
                 X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0)
        X = X.fillna('Missing')
        
        y = pd.to_numeric(y, errors='coerce').dropna()
        X = X.loc[y.index]

        if y.nunique() < 2:
            raise HTTPException(status_code=400, detail="A coluna alvo 'ultinfo' tem menos de duas classes.")

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        model = CatBoostClassifier(iterations=100, learning_rate=0.1, depth=6, verbose=0, random_state=42)
        model.fit(X_train, y_train, cat_features=cat_features)
        y_pred = model.predict(X_test)

        mapping = get_dicionario_mapeamento().get('ultinfo', {})
        df_comp = pd.DataFrame({
            'gabarito': [mapping.get(int(code), code) for code in y_test.values.ravel()],
            'previsão': [mapping.get(int(code), code) for code in y_pred.ravel()]
        })
        result = df_comp.to_dict(orient='records')
        accuracy = accuracy_score(y_test, y_pred)

        return {
            "base_tratada": base_tratada_json,
            "grafico_tipo_mortalidade": df_obito_por_tipo.to_dict(orient="records"),
            "grafico_idade_mortalidade": df_faixa_morte.to_dict(orient="records"),
            "grafico_tratamento_resultado": df_tratamento_resultado.to_dict(orient="records"),
            "grafico_sobrevida_diagnostico": df_sobrevida_json.to_dict(orient="records"),
            'result_test': result,
            "accuracy": accuracy,
            "grafico_faixa_geral": df_faixa_geral.to_dict(orient="records"),
            "grafico_tratamentos_geral": df_tratamentos_geral.to_dict(orient="records"),
        }

    except Exception as e:
        logger.error(f"Erro no processamento dos dados: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro interno ao processar os dados: {e}")