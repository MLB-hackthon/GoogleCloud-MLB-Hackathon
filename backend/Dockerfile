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

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8000

# Add this healthcheck configuration
HEALTHCHECK --start-period=30s --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 