# bedrock_agent_hijacking

Plataforma: AWS. Dificuldade informada no README: **Moderate**. Tamanho informado: Small.

**Situação:** Somente preparação estática; ainda não adaptado nem implantado.

Origem: [README original](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/README.md), base `63c65bd`. Esta ficha é uma análise de preparação do código, não um resultado de teste nem uma garantia de compatibilidade.

## Antes de começar

[Leia os requisitos comuns e o procedimento de trabalho](../../PREPARATION.md). Não é necessário ligar a VM para ler esta ficha. Credenciais e serviços da nuvem só serão usados na etapa de testes.

## Infraestrutura declarada

A contagem é de blocos resource no Terraform, não de instâncias finais. count, for_each e scripts podem criar mais recursos. Data sources e ações de scripts não entram nessa contagem. A tabela não demonstra autorização para criar ou excluir os recursos.

| Tipo Terraform | Blocos | Arquivos de origem |
| --- | ---: | --- |
| `aws_bedrockagent_agent` | 1 | [bedrock.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/bedrock.tf) |
| `aws_bedrockagent_agent_action_group` | 1 | [bedrock.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/bedrock.tf) |
| `aws_cloudwatch_log_group` | 1 | [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/lambda.tf) |
| `aws_iam_access_key` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/iam.tf) |
| `aws_iam_policy` | 2 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/iam.tf) |
| `aws_iam_role` | 2 | [bedrock.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/bedrock.tf), [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/lambda.tf) |
| `aws_iam_role_policy` | 2 | [bedrock.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/bedrock.tf), [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/lambda.tf) |
| `aws_iam_role_policy_attachment` | 1 | [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/lambda.tf) |
| `aws_iam_user` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/iam.tf) |
| `aws_iam_user_policy_attachment` | 3 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/iam.tf) |
| `aws_lambda_function` | 1 | [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/lambda.tf) |
| `aws_lambda_permission` | 1 | [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/lambda.tf) |
| `aws_s3_bucket` | 1 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/s3.tf) |
| `aws_s3_object` | 1 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/s3.tf) |

Consultas/data sources declarados (também exigem acesso de leitura): `archive_file`, `aws_caller_identity`, `aws_region`.

## Acessos a conferir antes do teste

- O original declara IAM (`aws_iam_access_key`, `aws_iam_policy`, `aws_iam_role`, `aws_iam_role_policy`, `aws_iam_role_policy_attachment`, `aws_iam_user`, `aws_iam_user_policy_attachment`). Nossa sessão anterior negou CreateRole, CreateUser e CreatePolicy. Verificar a identidade de provisionamento antes de qualquer apply; a adaptação exige análise própria.
- S3: verificar criação, leitura, envio de objetos e remoção. O provider pode consultar Object Lock mesmo sem usá-lo; nossa conta negou essa leitura. A correção de um cenário não é automaticamente aplicável a todos.
- IA/OpenSearch: confirmar disponibilidade regional, acesso aos serviços, quotas, roles e consumo antes de qualquer criação. Esses serviços ainda não foram verificados na conta.
- Monitoramento/notificações: distinguir recursos próprios dos controles institucionais. Verificar detector preexistente, logs, regras, inscrições e eventual verificação de e-mail; não modificar proteções da conta para fazer o teste passar.

## Ferramentas e configuração local

- Base declarada pelo README raiz: Linux/macOS, Python 3.9+, Terraform 1.5+, AWS CLI, Azure CLI e jq; Windows não é oficialmente suportado.
- CloudGoat instalado por pipx; Git para obter o projeto. São requisitos gerais do projeto original, não uma lista validada de dependências de cada aplicação.
- Perfil AWS separado e, se temporário, ID + segredo + Session Token da mesma sessão. Whitelist atualizada para a rede de teste.
- Há referências a ZIP/empacotamento: conferir zip/unzip e artefatos exigidos nos scripts.

Restrições encontradas no Terraform:

- Terraform: `>= 1.5`
- Provider `hashicorp/aws`: `>= 5.74.0`
- Provider `hashicorp/archive`: `>= 2.4`

## Variáveis declaradas

Nomes e descrições vêm do Terraform. Valores de senhas, segredos, flags e credenciais não são reproduzidos. Uma variável com default ainda pode precisar de revisão; a ausência de default não significa necessariamente entrada manual, pois o CloudGoat fornece algumas variáveis.

| Variável | Default declarado? | Descrição de infraestrutura |
| --- | --- | --- |
| profile | Não | The AWS profile to use |
| cgid | Não | CGID variable for unique naming |
| cg_whitelist | Não | User's public IP address(es) |
| region | Sim; valor omitido | The AWS region to deploy to |
| stack-name | Sim; valor omitido | Name of the CloudGoat stack |
| scenario-name | Sim; valor omitido | Name of the scenario |
| agent_model_id | Sim; valor omitido | The ID of the foundational model used by the agent. |

## Plano da nossa futura rodada

- [ ] Ler objetivo e verificar se a adaptação preservaria o exercício.
- [ ] Confirmar permissões, serviços, quotas, credenciais e limite de créditos.
- [ ] Registrar diferenças propostas antes de alterar o original.
- [ ] Validar configuração e plano sem anunciar compatibilidade antecipada.
- [ ] Implantar, verificar disponibilidade e realizar teste funcional autorizado.
- [ ] Destruir e conferir ausência de recursos da atividade.
- [ ] Documentar resultados e publicar apenas o estado realmente comprovado.

## Referências específicas

- [README original (pode conter walkthrough)](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/README.md)
- [manifest.yml](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/manifest.yml)
- [terraform/provider.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/provider.tf)
- [terraform/variables.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/bedrock_agent_hijacking/terraform/variables.tf)

Não são copiados walkthroughs, flags, senhas, conteúdo de User Data ou valores de variáveis. Tipos e nomes de recursos podem revelar serviços envolvidos; consulte esta ficha como preparação, antes da tentativa sem dicas.
