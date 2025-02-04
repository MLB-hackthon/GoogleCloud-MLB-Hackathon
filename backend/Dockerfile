# Use Python 3.11 slim image
FROM python:3.11-slim

# Install curl
RUN apt-get update && \
    apt-get install -y curl gcc python3-dev libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install gunicorn
RUN pip install gunicorn

# Copy the rest of the application
COPY . .

# Create SSL directory
RUN mkdir -p /app/ssl

# Expose HTTPS port
EXPOSE 443

# Add health check
HEALTHCHECK --interval=10s --timeout=8s --start-period=5s --retries=3 \
  CMD curl --fail --insecure https://localhost:443/health || exit 1

# Use Gunicorn with SSL
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:443", \
     "--keyfile", "/app/ssl/private.key", \
     "--certfile", "/app/ssl/certificate.crt", \
     "--access-logfile", "-", \
     "--error-logfile", "-"] 