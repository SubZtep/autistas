#!/bin/bash
# Script to configure Ollama to listen on all interfaces for Docker access

set -e

echo "🔧 Configuring Ollama to listen on all interfaces..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root: sudo bash fix-ollama.sh"
  exit 1
fi

# Backup the service file
echo "📋 Backing up service file..."
cp /etc/systemd/system/ollama.service /etc/systemd/system/ollama.service.backup

# Check if OLLAMA_HOST is already set
if grep -q "OLLAMA_HOST" /etc/systemd/system/ollama.service; then
  echo "⚠️  OLLAMA_HOST already configured, updating..."
  sed -i 's/Environment="OLLAMA_HOST=.*/Environment="OLLAMA_HOST=0.0.0.0:11434"/' /etc/systemd/system/ollama.service
else
  echo "➕ Adding OLLAMA_HOST environment variable..."
  sed -i '/^Environment="PATH=/a Environment="OLLAMA_HOST=0.0.0.0:11434"' /etc/systemd/system/ollama.service
fi

# Reload systemd and restart Ollama
echo "🔄 Reloading systemd daemon..."
systemctl daemon-reload

echo "🔄 Restarting Ollama service..."
systemctl restart ollama

# Wait for Ollama to start
echo "⏳ Waiting for Ollama to start..."
sleep 3

# Verify Ollama is listening on all interfaces
echo "🔍 Verifying Ollama configuration..."
if ss -tlnp | grep -q "0.0.0.0:11434"; then
  echo "✅ SUCCESS! Ollama is now listening on 0.0.0.0:11434"
  echo ""
  echo "Listening addresses:"
  ss -tlnp | grep 11434
  echo ""
  echo "🎉 Your chat should now work! Try sending a message."
else
  echo "⚠️  Warning: Ollama might not be listening on all interfaces yet."
  echo "Current listening addresses:"
  ss -tlnp | grep 11434 || echo "Port 11434 not found"
  echo ""
  echo "Check Ollama status: systemctl status ollama"
fi
