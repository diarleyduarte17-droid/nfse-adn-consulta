# Consulta NFS-e ADN

Exemplo educacional de uma consulta incremental à distribuição nacional de NFS-e. O núcleo separa transporte mTLS, armazenamento e cursor NSU para tornar o fluxo testável.

## Fluxo

1. Leia o último NSU persistido.
2. Faça uma única consulta autenticada com certificado do contribuinte autorizado.
3. Valide, descompacte e persista cada XML do lote.
4. Só então avance o cursor, dentro de uma transação.

Nunca avance o NSU antes de guardar o XML; não faça polling agressivo ou retentativa cega. O projeto não contém certificado, CNPJ real, credenciais ou banco de dados.

```bash
npm install
npm run check
```

Leia [AGENTS.md](./AGENTS.md) para pedir a uma IA a API, persistência ou interface desejada.

---

## 🇬🇧 English

**NFS-e national environment (ADN) lookup.** Educational example of incremental NFS-e distribution queries. The core separates mTLS transport, storage and the NSU cursor, making the flow testable. Rule of thumb: persist each XML before advancing the cursor, inside a transaction; no aggressive polling or blind retries. No certificates, real CNPJ or credentials are included.

```bash
npm install
npm run check
```

See [AGENTS.md](./AGENTS.md) for guidance on extending this project with your own AI assistant.
