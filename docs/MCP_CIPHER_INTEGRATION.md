# MCP Cipher Server - Integrace a používání

## Přehled

MCP Cipher server je úspěšně nainstalován a integrován do projektu. Server poskytuje pokročilé funkce pro práci s pamětí AI agentů, včetně:

- 🧠 Automatické generování AI coding memories
- 🔄 Přepínání mezi IDE bez ztráty kontextu
- 🤝 Sdílení coding memories v týmu v reálném čase
- 🧬 Dual Memory Layer (System 1 a System 2)
- ⚙️ Zero-configurační instalace

## Stav projektu

✅ **Status**: Funkční  
✅ **Verze**: 0.3.0 (nejnovější)  
✅ **Závislosti**: Nainstalovány  
✅ **Sestavení**: Úspěšné  
✅ **MCP integrace**: Aktivní  

## Instalace a konfigurace

### 1. Umístění serveru
```
/Users/matty/Documents/ai_projects/cipher/cipher/
```

### 2. Závislosti
Server používá npm pro správu závislostí. Všechny závislosti jsou nainstalovány a aktuální.

### 3. Sestavení
Projekt je sestaven pomocí:
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
npm run build:no-ui
```

### 4. MCP konfigurace v Cursoru
Server je nakonfigurován v `/Users/matty/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "cipher": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/matty/Documents/ai_projects/cipher/cipher/dist/src/app/index.cjs", "--mode", "mcp"],
      "env": {
        "OPENAI_API_KEY": "your_openai_api_key_here"
      }
    }
  }
}
```

## Používání

### Spuštění serveru

#### MCP mód (pro Cursor)
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
OPENAI_API_KEY=your_api_key node dist/src/app/index.cjs --mode mcp
```

#### CLI mód
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
OPENAI_API_KEY=your_api_key node dist/src/app/index.cjs
```

#### API server mód
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
OPENAI_API_KEY=your_api_key node dist/src/app/index.cjs --mode api --port 3001
```

#### Web UI mód
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
OPENAI_API_KEY=your_api_key node dist/src/app/index.cjs --mode ui --port 3000
```

### Dostupné nástroje

Server poskytuje následující MCP nástroje:

#### Memory (Paměť)
- `cipher_extract_and_operate_memory`: Extrakce znalostí a aplikace ADD/UPDATE/DELETE operací
- `cipher_memory_search`: Sémantické vyhledávání v uložených znalostech
- `cipher_store_reasoning_memory`: Ukládání vysoce kvalitních reasoning traces

#### Reasoning (Reflexe)
- `cipher_extract_reasoning_steps`: Extrakce strukturovaných reasoning kroků
- `cipher_evaluate_reasoning`: Hodnocení kvality reasoning a návrhy vylepšení
- `cipher_search_reasoning_patterns`: Vyhledávání vzorů v reflection paměti

#### Workspace Memory (týmová práce)
- `cipher_workspace_search`: Vyhledávání v týmové/projektové workspace paměti
- `cipher_workspace_store`: Pozadí capture týmových/projektových signálů

#### Knowledge Graph
- `cipher_add_node`, `cipher_update_node`, `cipher_delete_node`, `cipher_add_edge`
- `cipher_search_graph`, `cipher_enhanced_search`, `cipher_get_neighbors`
- `cipher_extract_entities`, `cipher_query_graph`, `cipher_relationship_manager`

#### System
- `cipher_bash`: Spouštění bash příkazů (jednorázově nebo persistentně)

## Konfigurace

### Základní konfigurace
Konfigurační soubor: `memAgent/cipher.yml`

```yaml
# LLM Configuration
llm:
  provider: openai
  model: gpt-4-turbo
  apiKey: $OPENAI_API_KEY

# System Prompt
systemPrompt: 'You are a helpful AI assistant with memory capabilities.'

# MCP Servers (optional)
mcpServers: {}
```

### Environment Variables

Vytvořte `.env` soubor v root složce projektu:

```bash
# API Keys (At least one required)
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GEMINI_API_KEY=your-gemini-api-key

# Vector Store (Optional - defaults to in-memory)
VECTOR_STORE_TYPE=qdrant  # qdrant, milvus, or in-memory
VECTOR_STORE_URL=https://your-cluster.qdrant.io
VECTOR_STORE_API_KEY=your-qdrant-api-key

# Chat History (Optional - defaults to SQLite)
CIPHER_PG_URL=postgresql://user:pass@localhost:5432/cipher_db

# Workspace Memory (Optional)
USE_WORKSPACE_MEMORY=true
WORKSPACE_VECTOR_STORE_COLLECTION=workspace_memory
```

## Aktualizace

### Kontrola aktualizací
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
npm outdated
```

### Aktualizace závislostí
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
npm update
```

### Aktualizace projektu
```bash
cd /Users/matty/Documents/ai_projects/cipher/cipher
git pull origin main
npm install
npm run build:no-ui
```

## Řešení problémů

### Časté problémy

1. **Chybějící závislosti**
   ```bash
   cd /Users/matty/Documents/ai_projects/cipher/cipher
   npm install
   ```

2. **Chybějící sestavení**
   ```bash
   cd /Users/matty/Documents/ai_projects/cipher/cipher
   npm run build:no-ui
   ```

3. **Chybějící API klíč**
   - Nastavte `OPENAI_API_KEY` environment variable
   - Nebo upravte konfiguraci v `memAgent/cipher.yml`

4. **Problémy s externími službami**
   - Server automaticky používá fallback konfigurace (in-memory)
   - Pro produkční použití nakonfigurujte Qdrant, Neo4j, PostgreSQL

### Logy
MCP logy jsou dostupné v: `/var/folders/.../cipher-mcp.log`

## Pokročilé funkce

### MCP Transport Types
- `stdio`: Standardní stdio transport (výchozí)
- `sse`: Server-Sent Events
- `streamable-http`: Streamable HTTP

### Příklady použití

#### Spuštění s SSE transportem
```bash
node dist/src/app/index.cjs --mode mcp --mcp-transport-type sse --mcp-port 3000
```

#### Spuštění s streamable-http transportem
```bash
node dist/src/app/index.cjs --mode mcp --mcp-transport-type streamable-http --mcp-port 3000
```

## Bezpečnost

- Server používá in-memory fallback pro externí služby
- API klíče jsou chráněny environment variables
- Logy neobsahují citlivé informace

## Podpora

- Dokumentace: [docs/](./docs/)
- GitHub: https://github.com/campfirein/cipher
- Discord: https://discord.com/invite/UMRrpNjh5W

---

**Poznámka**: Tento server je úspěšně integrován a funkční. Pro produkční použití doporučujeme nakonfigurovat externí služby (Qdrant, Neo4j, PostgreSQL) pro lepší výkon a spolehlivost.


