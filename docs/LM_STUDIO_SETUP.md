# LM Studio - Instrukce pro spuštění

## ✅ Konfigurace dokončena

Cipher je nyní nakonfigurován pro použití s **LM Studio** a vaším modelem **GPT OSS 20B**.

## 🚀 Jak spustit LM Studio server

### 1. Otevřete LM Studio aplikaci
- Spusťte LM Studio z Applications složky
- Ujistěte se, že máte načtený model **GPT OSS 20B**

### 2. Spusťte Local Server
- V LM Studio klikněte na **"Local Server"** v levém menu
- Klikněte na **"Start Server"**
- Server by měl běžet na portu **1234**

### 3. Ověřte, že server běží
```bash
curl http://localhost:1234/v1/models
```
Měli byste vidět JSON s informacemi o vašem modelu.

### 4. Spusťte Cipher MCP server
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
node dist/src/app/index.cjs --mode mcp
```

## 📋 Aktualizovaná konfigurace

### Cipher konfigurace (`memAgent/cipher.yml`):
```yaml
llm:
  provider: lmstudio
  model: gpt-oss-20b
  maxIterations: 50
  baseURL: $LMSTUDIO_BASE_URL

embedding:
  type: lmstudio
  model: nomic-embed-text-v1.5
  baseUrl: $LMSTUDIO_BASE_URL
```

### Environment variables (`.env`):
```bash
LMSTUDIO_BASE_URL=http://localhost:1234/v1
```

### MCP konfigurace (`~/.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "cipher": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/matty/Documents/ai_projects/cipher/cipher/dist/src/app/index.cjs", "--mode", "mcp"],
      "env": {
        "LMSTUDIO_BASE_URL": "http://localhost:1234/v1"
      }
    }
  }
}
```

## 🔧 Řešení problémů

### Pokud LM Studio server neběží:
1. Zkontrolujte, že máte načtený model GPT OSS 20B
2. Restartujte LM Studio aplikaci
3. Zkontrolujte, že port 1234 není obsazený jinou aplikací

### Pokud Cipher nevidí LM Studio:
1. Ověřte, že LM Studio server běží: `curl http://localhost:1234/v1/models`
2. Zkontrolujte, že model je načtený v LM Studio
3. Restartujte Cipher MCP server

## ✅ Výhody LM Studio

- **Lokální provoz** - žádné API klíče potřeba
- **Váš model** - GPT OSS 20B běží lokálně
- **Rychlost** - žádné síťové latence
- **Soukromí** - data zůstávají na vašem počítači

## 🎯 Další kroky

1. Spusťte LM Studio a načtěte GPT OSS 20B model
2. Spusťte Local Server v LM Studio
3. Otestujte Cipher MCP server
4. Začněte používat Cipher v Cursor Code!

---

**Status: ✅ PŘIPRAVENO PRO LM STUDIO**

