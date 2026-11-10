# Briefing para IA

Você está evoluindo um exemplo de consulta de NFS-e ADN. Preserve a regra principal: uma execução consulta uma vez, persiste todos os XMLs válidos e só atualiza o NSU após cada persistência confirmada.

## Objetivo inicial

Implemente um adaptador de transporte mTLS e um repositório transacional para sua stack. Mantenha `NfseAdnClient` sem dependência de framework.

## Regras obrigatórias

- Nunca registre certificados, chaves privadas, tokens, XMLs fiscais ou CNPJs reais.
- Não avance cursor em resposta parcial, XML inválido ou falha de armazenamento.
- Não automatize emissão/cancelamento de documento.
- Valide a documentação oficial e a autorização do contribuinte antes de consulta real.

## Definition of done

Testes devem cobrir lote fora de ordem, XML inválido, falha ao salvar e retomada idempotente.
