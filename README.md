# CloudGoat Students

Adaptações comunitárias de cenários do [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) para ambientes acadêmicos com permissões restritas. Projeto independente de Alef Kaue; não é uma edição oficial nem possui endosso da Rhino Security Labs, AWS ou Microsoft.

O objetivo é manter o aprendizado dos cenários e documentar os compromissos necessários para executá-los. As permissões variam por instituição: **não há garantia de que todo cenário rode em qualquer conta de estudante**.

## Cenários

| Plataforma | Cenário | Situação |
| --- | --- | --- |
| AWS | [cloud_breach_s3_academy](scenarios/aws/cloud_breach_s3_academy/) | Implantação e página inicial verificadas em uma sessão voclabs; remoção documentada no relatório |
| Azure | — | Estrutura preparada, sem adaptações publicadas ainda |

## Estrutura

```text
scenarios/aws/       adaptações AWS independentes
scenarios/azure/     futuras adaptações Azure
docs/compatibility.md
docs/scenarios/      comparação técnica e PDF de cada cenário
scripts/            instalação das adaptações no CloudGoat
```

## Instalação

Requisitos de referência: Linux, Python 3.9+, Terraform 1.5+, AWS CLI, jq e CloudGoat 2.5.0 instalado por pipx. Para AWS, use as credenciais temporárias que a instituição fornecer, incluindo Session Token. Não publique credenciais nem estados Terraform.

```bash
git clone https://github.com/alefkaue/cloudgoat-students.git
cd cloudgoat-students
python3 scripts/install-scenario.py aws cloud_breach_s3_academy
cloudgoat config aws
cloudgoat config whitelist --auto
cloudgoat list aws
```

Configure o perfil AWS antes de implantar, usando a autenticação fornecida pela instituição. No exemplo, o perfil se chama `cloudgoat-lab`.

```bash
aws sts get-caller-identity --profile cloudgoat-lab
cloudgoat create cloud_breach_s3_academy --profile cloudgoat-lab
```

O CloudGoat fornece o IP inicial. Aguarde o bootstrap da EC2. O aluno investiga a partir desse ponto; este repositório não inclui walkthrough adicional. O plano Terraform e os assets de infraestrutura podem revelar aspectos do cenário: evite lê-los durante uma tentativa sem dicas.

## Encerramento e transporte da VM

```bash
cloudgoat destroy cloud_breach_s3_academy --profile cloudgoat-lab
cloudgoat list deployed
```

Confira a remoção no console. Expirar credenciais ou desligar a VM local não apaga os recursos da nuvem. Antes de levar a VM para outra rede, destrua o cenário. As correções e ferramentas permanecem instaladas. Na faculdade, renove o trio de credenciais, confira o Account ID, atualize a whitelist e crie nova instância do cenário. Um estado Terraform de outra conta não deve ser reutilizado.

## Contribuições

Adicione cada cenário em uma pasta própria, com origem/commit, requisitos, restrições observadas, alterações, diferenças pedagógicas e evidências de `validate`, implantação e remoção. Atualize a [matriz de compatibilidade](docs/compatibility.md). Nenhuma adaptação deve alterar permissões institucionais ou afirmar ter sido testada sem evidências. Azure terá testes e documentação próprios.

## Licença e origem

Código derivado do CloudGoat, base `63c65bd`, sob [BSD 3-Clause](LICENSE). Preserve a licença e a atribuição. Consulte [NOTICE](NOTICE). Os CSVs do cenário são dados fictícios fornecidos pelo projeto original.
