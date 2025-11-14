#!/bin/bash
# Development startup script with correct OLLAMA_BASE_URL

export OLLAMA_BASE_URL=http://localhost:11434
pnpm dev
