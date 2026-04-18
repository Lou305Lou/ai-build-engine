FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/app

# Render sets PORT (default 10000). Use it.
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"


