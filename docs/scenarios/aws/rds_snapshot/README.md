# rds_snapshot

Plataforma: AWS. Dificuldade informada no README: **Easy**. Tamanho informado: Small.

**Situação:** Somente preparação estática; ainda não adaptado nem implantado.

Origem: [README original](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/README.md), base `63c65bd`. Esta ficha é uma análise de preparação do código, não um resultado de teste nem uma garantia de compatibilidade.

## Antes de começar

[Leia os requisitos comuns e o procedimento de trabalho](../../PREPARATION.md). Não é necessário ligar a VM para ler esta ficha. Credenciais e serviços da nuvem só serão usados na etapa de testes.

## Infraestrutura declarada

A contagem é de blocos resource no Terraform, não de instâncias finais. count, for_each e scripts podem criar mais recursos. Data sources e ações de scripts não entram nessa contagem. A tabela não demonstra autorização para criar ou excluir os recursos.

| Tipo Terraform | Blocos | Arquivos de origem |
| --- | ---: | --- |
| `aws_db_instance` | 1 | [rds.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/rds.tf) |
| `aws_db_snapshot` | 1 | [rds.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/rds.tf) |
| `aws_db_subnet_group` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/vpc.tf) |
| `aws_iam_access_key` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/iam.tf) |
| `aws_iam_instance_profile` | 1 | [ec2.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/ec2.tf) |
| `aws_iam_role` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/iam.tf) |
| `aws_iam_role_policy` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/iam.tf) |
| `aws_iam_user` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/iam.tf) |
| `aws_iam_user_policy` | 1 | [iam.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/iam.tf) |
| `aws_instance` | 1 | [ec2.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/ec2.tf) |
| `aws_internet_gateway` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/vpc.tf) |
| `aws_key_pair` | 1 | [ec2.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/ec2.tf) |
| `aws_main_route_table_association` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/vpc.tf) |
| `aws_route_table` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/vpc.tf) |
| `aws_s3_bucket` | 1 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/s3.tf) |
| `aws_s3_object` | 1 | [s3.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/s3.tf) |
| `aws_security_group` | 2 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/vpc.tf) |
| `aws_subnet` | 2 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/vpc.tf) |
| `aws_vpc` | 1 | [vpc.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/vpc.tf) |

Consultas/data sources declarados (também exigem acesso de leitura): `aws_ami`, `aws_caller_identity`.

## Acessos a conferir antes do teste

- O original declara IAM (`aws_iam_access_key`, `aws_iam_instance_profile`, `aws_iam_role`, `aws_iam_role_policy`, `aws_iam_user`, `aws_iam_user_policy`). Nossa sessão anterior negou CreateRole, CreateUser e CreatePolicy. Verificar a identidade de provisionamento antes de qualquer apply; a adaptação exige análise própria.
- Para reutilizar perfil institucional: confirmar existência, confiança para EC2, permissões da role e autorização PassRole. Não assumir que o nome LabInstanceProfile basta.
- RDS: verificar classe, engine, versão, armazenamento, região, snapshots e permissões de criação/remoção. A negativa que observamos em db.m5.large não prova bloqueio de todo RDS.
- EC2: verificar AMI/proprietário, arquitetura, tamanho de instância, volume, quotas e regras da instituição. A conta anterior restringia AMIs e tipos de volume.
- S3: verificar criação, leitura, envio de objetos e remoção. O provider pode consultar Object Lock mesmo sem usá-lo; nossa conta negou essa leitura. A correção de um cenário não é automaticamente aplicável a todos.

## Ferramentas e configuração local

- Base declarada pelo README raiz: Linux/macOS, Python 3.9+, Terraform 1.5+, AWS CLI, Azure CLI e jq; Windows não é oficialmente suportado.
- CloudGoat instalado por pipx; Git para obter o projeto. São requisitos gerais do projeto original, não uma lista validada de dependências de cada aplicação.
- Perfil AWS separado e, se temporário, ID + segredo + Session Token da mesma sessão. Whitelist atualizada para a rede de teste.
- Scripts originais usam ssh-keygen: cliente OpenSSH e geração de chaves locais. Não publicar essas chaves.

Restrições encontradas no Terraform:

- Terraform: `>= 1.5`
- Provider `hashicorp/aws`: `>= 5.0.0`
- Provider `hashicorp/archive`: `>= 2.4`

## Variáveis declaradas

Nomes e descrições vêm do Terraform. Valores de senhas, segredos, flags e credenciais não são reproduzidos. Uma variável com default ainda pode precisar de revisão; a ausência de default não significa necessariamente entrada manual, pois o CloudGoat fornece algumas variáveis.

| Variável | Default declarado? | Descrição de infraestrutura |
| --- | --- | --- |
| profile | Não | The AWS profile to use. |
| region | Sim; valor omitido | The AWS region to deploy resources to. |
| ssh-public-key-for-ec2 | Sim; valor omitido | Consultar arquivo original |
| ssh-private-key-for-ec2 | Sim; valor omitido | Consultar arquivo original |
| cgid | Não | CGID variable for unique naming. |
| cg_whitelist | Não | User's public IP address |
| rds-username | Sim; valor omitido | RDS Mysql instance username |
| rds-password | Sim; valor omitido | RDS Mysql instance password |
| stack-name | Sim; valor omitido | Name of the stack. |
| scenario-name | Sim; valor omitido | Name of the scenario. |

## Plano da nossa futura rodada

- [ ] Ler objetivo e verificar se a adaptação preservaria o exercício.
- [ ] Confirmar permissões, serviços, quotas, credenciais e limite de créditos.
- [ ] Registrar diferenças propostas antes de alterar o original.
- [ ] Validar configuração e plano sem anunciar compatibilidade antecipada.
- [ ] Implantar, verificar disponibilidade e realizar teste funcional autorizado.
- [ ] Destruir e conferir ausência de recursos da atividade.
- [ ] Documentar resultados e publicar apenas o estado realmente comprovado.

## Referências específicas

- [README original (pode conter walkthrough)](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/README.md)
- [manifest.yml](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/manifest.yml)
- [start.sh](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/start.sh)
- [terraform/provider.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/aws/rds_snapshot/terraform/provider.tf)

Não são copiados walkthroughs, flags, senhas, conteúdo de User Data ou valores de variáveis. Tipos e nomes de recursos podem revelar serviços envolvidos; consulte esta ficha como preparação, antes da tentativa sem dicas.
