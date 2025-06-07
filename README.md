# COMO RODAR
## backend:
- cd backend
- Remove-Item -Recurse -Force venv
- python -m venv venv 
- .\venv\Scripts\Activate.ps1
- pip install -r requirements.txt OU pip install fastapi "uvicorn[standard]" pandas python-multipart
- uvicorn main:app --host 0.0.0.0 --port 8000 --reload

## frontend:
- cd frontend
- npm install
- npm run dev