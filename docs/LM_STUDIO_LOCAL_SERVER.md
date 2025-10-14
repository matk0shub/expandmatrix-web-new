# LM Studio - Local Server není spuštěný

## 🔍 Problém
LM Studio aplikace běží, ale **Local Server není spuštěný**. Proto curl na port 1234 selhává.

## ✅ Řešení

### 1. Otevřete LM Studio aplikaci
- Ujistěte se, že máte načtený model **openai/gpt-oss-20b**

### 2. Spusťte Local Server
- V LM Studio klikněte na **"Local Server"** v levém menu
- Klikněte na **"Start Server"** 
- Server by měl běžet na portu **1234** (nebo jiném, který uvidíte v UI)

### 3. Ověřte, že server běží
```bash
curl http://localhost:1234/v1/models
```
Měli byste vidět JSON s informacemi o vašem modelu.

### 4. Pokud port není 1234
- V LM Studio Local Server UI uvidíte skutečný port
- Aktualizujte konfiguraci:

```bash
# Aktualizujte .env soubor
sed -i '' 's|LMSTUDIO_BASE_URL=.*|LMSTUDIO_BASE_URL=http://localhost:SKUTECNY_PORT/v1|' /Users/matty/Documents/ai_projects/cipher/cipher/.env

# Aktualizujte MCP konfiguraci
jq '.mcpServers.cipher.env.LMSTUDIO_BASE_URL="http://localhost:SKUTECNY_PORT/v1"' ~/.cursor/mcp.json | tee ~/.cursor/mcp.json
```

### 5. Test Cipher
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
node dist/src/app/index.cjs --mode mcp
```

## 🚨 Důležité poznámky

- **Model musí být načtený** v LM Studio před spuštěním Local Serveru
- **Local Server musí být spuštěný** - samotná aplikace nestačí
- **Port se může lišit** od 1234 - vždy zkontrolujte v LM Studio UI

## 🔧 Rychlé ověření

Po spuštění Local Serveru zkuste:
```bash
# Najděte LM Studio port
for p in 1234 1235 5000 8000 9000; do 
  echo "Testing port $p:"
  curl -s --max-time 2 "http://127.0.0.1:$p/v1/models" && echo "FOUND on port $p" && break
done
```

---

**Status: ⚠️ ČEKÁ NA SPUŠTĚNÍ LOCAL SERVERU V LM STUDIO**

