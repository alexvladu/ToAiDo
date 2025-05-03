# Folosim o imagine de Python 3.10 ca bază
FROM python:3.10-slim

# Setăm directorul de lucru în container
WORKDIR /app

# Actualizăm pip la ultima versiune
RUN pip install --upgrade pip

# Copiem fișierul requirements.txt în container
COPY requirements.txt .

# Instalăm dependențele din requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copiem restul aplicației în container
COPY . .

# Expunem portul pe care va rula serverul Django
EXPOSE 8000

# Comanda de a rula serverul Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
