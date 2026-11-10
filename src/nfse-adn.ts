export type DocumentoAdn = {
  nsu: string;
  tipo: string;
  xmlGzipBase64: string;
  chave?: string;
};

export type RespostaAdn = {
  status: "DOCUMENTOS_LOCALIZADOS" | "SEM_NOVOS_DOCUMENTOS";
  documentos: DocumentoAdn[];
};

export interface TransporteAdn {
  consultar(cnpj: string, ultNsu: string): Promise<RespostaAdn>;
}

export interface RepositorioNfse {
  salvarXml(input: { cnpj: string; nsu: string; tipo: string; chave?: string; xml: Uint8Array }): Promise<void>;
  atualizarCursor(cnpj: string, nsu: string): Promise<void>;
}

export type Descompactar = (base64Gzip: string) => Uint8Array;

function compararNsu(a: string, b: string): number {
  return BigInt(a) === BigInt(b) ? 0 : BigInt(a) > BigInt(b) ? 1 : -1;
}

export class NfseAdnClient {
  constructor(
    private readonly transporte: TransporteAdn,
    private readonly repositorio: RepositorioNfse,
    private readonly descompactar: Descompactar,
  ) {}

  async sincronizarUmaVez(cnpj: string, ultNsu: string): Promise<{ salvos: number; ultNsu: string }> {
    if (!/^\d{14}$/.test(cnpj) || !/^\d+$/.test(ultNsu)) throw new Error("CNPJ ou NSU inválido.");
    const resposta = await this.transporte.consultar(cnpj, ultNsu);
    if (resposta.status === "SEM_NOVOS_DOCUMENTOS") return { salvos: 0, ultNsu };

    const documentos = [...resposta.documentos].sort((a, b) => compararNsu(a.nsu, b.nsu));
    let cursor = ultNsu;
    for (const documento of documentos) {
      if (!/^\d+$/.test(documento.nsu) || compararNsu(documento.nsu, cursor) <= 0) {
        throw new Error(`NSU inválido ou fora de ordem: ${documento.nsu}`);
      }
      const xml = this.descompactar(documento.xmlGzipBase64);
      if (new TextDecoder().decode(xml).trimStart().startsWith("<") === false) {
        throw new Error(`XML inválido no NSU ${documento.nsu}.`);
      }
      await this.repositorio.salvarXml({ cnpj, nsu: documento.nsu, tipo: documento.tipo, chave: documento.chave, xml });
      await this.repositorio.atualizarCursor(cnpj, documento.nsu);
      cursor = documento.nsu;
    }
    return { salvos: documentos.length, ultNsu: cursor };
  }
}
