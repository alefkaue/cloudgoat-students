# ecs_privesc_evade_protection

Plataforma: AWS. Dificuldade informada no README: **Moderate**. Tamanho informado: Medium.

**Situação:** Somente preparação estática; ainda não adaptado nem implantado.

Origem: [README original](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/README.md), base `63c65bd`. Esta ficha é uma análise de preparação do código, não um resultado de teste nem uma garantia de compatibilidade.

## Antes de começar

[Leia os requisitos comuns e o procedimento de trabalho](../../PREPARATION.md). Não é necessário ligar a VM para ler esta ficha. Credenciais e serviços da nuvem só serão usados na etapa de testes.

## Infraestrutura declarada

A contagem é de blocos resource no Terraform, não de instâncias finais. count, for_each e scripts podem criar mais recursos. Data sources e ações de scripts não entram nessa contagem. A tabela não demonstra autorização para criar ou excluir os recursos.

| Tipo Terraform | Blocos | Arquivos de origem |
| --- | ---: | --- |
| `aws_autoscaling_group` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |
| `aws_cloudtrail` | 1 | [cloudtrail.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/cloudtrail.tf) |
| `aws_cloudwatch_event_rule` | 1 | [cloudwatch.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/cloudwatch.tf) |
| `aws_cloudwatch_event_target` | 1 | [cloudwatch.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/cloudwatch.tf) |
| `aws_cloudwatch_log_group` | 1 | [cloudwatch.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/cloudwatch.tf) |
| `aws_ecr_repository` | 1 | [ecr.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecr.tf) |
| `aws_ecs_capacity_provider` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |
| `aws_ecs_cluster` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |
| `aws_ecs_cluster_capacity_providers` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |
| `aws_ecs_service` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |
| `aws_ecs_task_definition` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |
| `aws_guardduty_detector` | 1 | [cloudwatch.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/cloudwatch.tf) |
| `aws_iam_instance_profile` | 3 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf), [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/iam.tf) |
| `aws_iam_policy` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/iam.tf) |
| `aws_iam_role` | 4 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/iam.tf) |
| `aws_internet_gateway` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/vpc.tf) |
| `aws_lambda_function` | 1 | [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/lambda.tf) |
| `aws_lambda_permission` | 1 | [lambda.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/lambda.tf) |
| `aws_launch_template` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |
| `aws_route_table` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/vpc.tf) |
| `aws_route_table_association` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/vpc.tf) |
| `aws_s3_bucket` | 2 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/s3.tf) |
| `aws_s3_bucket_policy` | 1 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/s3.tf) |
| `aws_s3_bucket_public_access_block` | 1 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/s3.tf) |
| `aws_s3_object` | 2 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/s3.tf) |
| `aws_security_group` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/vpc.tf) |
| `aws_ses_email_identity` | 1 | [ses.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ses.tf) |
| `aws_subnet` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/vpc.tf) |
| `aws_vpc` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/vpc.tf) |
| `null_resource` | 1 | [ecr.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecr.tf) |
| `time_sleep` | 1 | [ecs.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/ecs.tf) |

Consultas/data sources declarados (também exigem acesso de leitura): `archive_file`, `aws_ami`, `aws_availability_zones`, `aws_caller_identity`, `aws_instances`.

## Acessos a conferir antes do teste

- O original declara IAM (`aws_iam_instance_profile`, `aws_iam_policy`, `aws_iam_role`). Nossa sessão anterior negou CreateRole, CreateUser e CreatePolicy. Verificar a identidade de provisionamento antes de qualquer apply; a adaptação exige análise própria.
- Para reutilizar perfil institucional: confirmar existência, confiança para EC2, permissões da role e autorização PassRole. Não assumir que o nome LabInstanceProfile basta.
- EC2: verificar AMI/proprietário, arquitetura, tamanho de instância, volume, quotas e regras da instituição. A conta anterior restringia AMIs e tipos de volume.
- S3: verificar criação, leitura, envio de objetos e remoção. O provider pode consultar Object Lock mesmo sem usá-lo; nossa conta negou essa leitura. A correção de um cenário não é automaticamente aplicável a todos.
- Containers/EFS: conferir roles de execução/tarefa, rede, imagens, arquitetura, volumes e capacidade do serviço. A role compartilhada pode mudar o isolamento do exercício.
- Monitoramento/notificações: distinguir recursos próprios dos controles institucionais. Verificar detector preexistente, logs, regras, inscrições e eventual verificação de e-mail; não modificar proteções da conta para fazer o teste passar.

## Ferramentas e configuração local

- Base declarada pelo README raiz: Linux/macOS, Python 3.9+, Terraform 1.5+, AWS CLI, Azure CLI e jq; Windows não é oficialmente suportado.
- CloudGoat instalado por pipx; Git para obter o projeto. São requisitos gerais do projeto original, não uma lista validada de dependências de cada aplicação.
- Perfil AWS separado e, se temporário, ID + segredo + Session Token da mesma sessão. Whitelist atualizada para a rede de teste.
- O código/documentação menciona Docker: verificar sua necessidade local e builds/push de imagens antes de executar scripts.
- Há referências a ZIP/empacotamento: conferir zip/unzip e artefatos exigidos nos scripts.

Restrições encontradas no Terraform:

- Terraform: `>= 1.6`
- Provider `hashicorp/aws`: `>= 5.0.0`
- Provider `hashicorp/archive`: `>= 2.4`
- Provider `hashicorp/time`: `>= 0.9`

## Variáveis declaradas

Nomes e descrições vêm do Terraform. Valores de senhas, segredos, flags e credenciais não são reproduzidos. Uma variável com default ainda pode precisar de revisão; a ausência de default não significa necessariamente entrada manual, pois o CloudGoat fornece algumas variáveis.

| Variável | Default declarado? | Descrição de infraestrutura |
| --- | --- | --- |
| profile | Não | The AWS profile to use. |
| region | Sim; valor omitido | The AWS region to deploy resources to. |
| cgid | Não | CGID variable for unique naming. |
| cg_whitelist | Sim; valor omitido | User's public IP address(es). |
| stack-name | Sim; valor omitido | Name of the stack. |
| scenario-name | Sim; valor omitido | Name of the scenario. |
| user_email | Não | Once guardduty detects attack, a mail will be sent to you |

## Plano da nossa futura rodada

- [ ] Ler objetivo e verificar se a adaptação preservaria o exercício.
- [ ] Confirmar permissões, serviços, quotas, credenciais e limite de créditos.
- [ ] Registrar diferenças propostas antes de alterar o original.
- [ ] Validar configuração e plano sem anunciar compatibilidade antecipada.
- [ ] Implantar, verificar disponibilidade e realizar teste funcional autorizado.
- [ ] Destruir e conferir ausência de recursos da atividade.
- [ ] Documentar resultados e publicar apenas o estado realmente comprovado.

## Referências específicas

- [README original (pode conter walkthrough)](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/README.md)
- [manifest.yml](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/manifest.yml)
- [terraform/provider.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/provider.tf)
- [terraform/variables.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/ecs_privesc_evade_protection/terraform/variables.tf)

Não são copiados walkthroughs, flags, senhas, conteúdo de User Data ou valores de variáveis. Tipos e nomes de recursos podem revelar serviços envolvidos; consulte esta ficha como preparação, antes da tentativa sem dicas.
