# Procedimento comum de preparação

As pastas [aws](aws/README.md) e [azure](azure/README.md) contêm fichas individuais do código original. Elas não instalam novos cenários, não provam que uma conta os suporta e não incluem soluções. As adaptações executáveis continuam em `/scenarios/` na raiz do repositório.

## Ordem de trabalho

A numeração é uma proposta nossa para a adaptação em ambiente restrito, não uma classificação oficial. Primeiro usamos o cenário AWS já adaptado como referência, depois avaliamos candidatos com menos dependências. Desafios centrados em IAM ficam em uma etapa de reformulação porque identidades e permissões são parte do próprio exercício. Não há obrigação de implementar algo que perca seu objetivo.

## Requisitos locais declarados pelo projeto original

- Linux ou macOS; Windows não é oficialmente suportado.
- Python 3.9+, Terraform 1.5+, AWS CLI, Azure CLI e jq.
- CloudGoat instalado por pipx e Git para obter os arquivos.
- Ferramentas extras conforme README e scripts de cada cenário; conferir versões no dia da execução.

A VM já preparada possui as ferramentas usadas no primeiro cenário AWS. Isso não comprova que contenha todas as dependências dos próximos cenários ou do Azure. Não é necessário ligar a VM para organizar ou ler as fichas.

## Antes de usar a nuvem

1. Iniciar sessão autorizada pela instituição e conferir conta/assinatura/tenant.
2. Atualizar credenciais temporárias sem publicá-las. Em AWS, usar os três valores da mesma sessão; em Azure, verificar login e assinatura ativa.
3. Atualizar whitelist para a rede atual quando o cenário a utiliza.
4. Rever permissões, quotas, configurações e objetivo pedagógico da ficha.
5. Definir teto de créditos antes de implantar. Testar um cenário por vez.

## Registro de cada teste

Anotar data, versão do upstream/adaptação, ambiente, autenticação, restrições, versões de ferramentas, resultado de validate/plan, resultado da implantação, funcionamento do exercício e remoção. Separar a identidade de provisionamento da identidade do aluno quando o cenário exigir isso. Um servidor respondendo não demonstra que todas as etapas do exercício estão corretas.

## Encerramento

Destruir recursos com credenciais válidas na conta correta e conferir diretamente os serviços. Preservar estado enquanto houver pendências. Desligar a VM local e expirar token não equivalem a limpar a nuvem. Não editar permissões institucionais para forçar um teste.

## Fonte e manutenção

As fichas são geradas por `scripts/catalog-upstream.cjs`, a partir de uma cópia local do repositório original, sem executar seus scripts ou acessar a nuvem:

```bash
node scripts/catalog-upstream.cjs /caminho/para/cloudgoat
```

Node.js só é necessário para regenerar esse catálogo de documentação; não é um requisito do CloudGoat. As fichas citam o commit exato e os arquivos usados. Leituras de resources/variáveis são análise estática, não um parser HCL completo; blocos com count/for_each e operações em scripts precisam de revisão manual antes do teste. O gerador não lê a pasta de solução como fonte de recursos da implantação.
