# datafactory_secret_theft

Plataforma: AZURE. Dificuldade informada no README: **Easy**. Tamanho informado: Small.

**Situação:** Somente preparação estática; ainda não adaptado nem implantado.

Origem: [README original](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/README.md), base `63c65bd`. Esta ficha é uma análise de preparação do código, não um resultado de teste nem uma garantia de compatibilidade.

## Antes de começar

[Leia os requisitos comuns e o procedimento de trabalho](../../PREPARATION.md). Não é necessário ligar a VM para ler esta ficha. Credenciais e serviços da nuvem só serão usados na etapa de testes.

## Infraestrutura declarada

A contagem é de blocos resource no Terraform, não de instâncias finais. count, for_each e scripts podem criar mais recursos. Data sources e ações de scripts não entram nessa contagem. A tabela não demonstra autorização para criar ou excluir os recursos.

| Tipo Terraform | Blocos | Arquivos de origem |
| --- | ---: | --- |
| `azuread_user` | 1 | [users.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/users.tf) |
| `azurerm_data_factory` | 1 | [main.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/main.tf) |
| `azurerm_data_factory_linked_service_key_vault` | 1 | [main.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/main.tf) |
| `azurerm_key_vault` | 1 | [keyvault.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/keyvault.tf) |
| `azurerm_key_vault_access_policy` | 2 | [keyvault.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/keyvault.tf) |
| `azurerm_key_vault_secret` | 1 | [keyvault.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/keyvault.tf) |
| `azurerm_resource_group` | 1 | [main.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/main.tf) |
| `azurerm_role_assignment` | 1 | [roles.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/roles.tf) |
| `random_password` | 1 | [users.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/users.tf) |

Consultas/data sources declarados (também exigem acesso de leitura): `azuread_client_config`, `azuread_domains`, `azurerm_data_factory`.

## Acessos a conferir antes do teste

- Acesso a uma assinatura Azure autorizada, tenant correto e permissões efetivas para os tipos de recurso da tabela. A conta AWS não fornece esse acesso.
- Microsoft Entra ID: verificar criação/gestão de usuários, aplicações e atribuições exigidas no código. Permissão sobre uma assinatura não garante permissão sobre o diretório.
- Conferir atribuições RBAC e políticas de acesso do Key Vault. A criação da infraestrutura e o acesso ao plano de dados são verificações distintas.
- Key Vault: revisar nome global, região, soft delete, recuperação e permissões de exclusão. Não prometer remoção definitiva se a instituição mantém recuperação obrigatória.

## Ferramentas e configuração local

- Base declarada pelo README raiz: Linux/macOS, Python 3.9+, Terraform 1.5+, AWS CLI, Azure CLI e jq; Windows não é oficialmente suportado.
- CloudGoat instalado por pipx; Git para obter o projeto. São requisitos gerais do projeto original, não uma lista validada de dependências de cada aplicação.
- Login pelo Azure CLI e assinatura configurada no CloudGoat. Confirmar tenant, região e permissões antes de criar recursos.

Restrições encontradas no Terraform:

- Terraform: `>= 1.5`
- Provider `hashicorp/azurerm`: `>= 3.0.0, < 5.0`
- Provider `hashicorp/azuread`: `>= 2.0.0`

## Variáveis declaradas

Nomes e descrições vêm do Terraform. Valores de senhas, segredos, flags e credenciais não são reproduzidos. Uma variável com default ainda pode precisar de revisão; a ausência de default não significa necessariamente entrada manual, pois o CloudGoat fornece algumas variáveis.

| Variável | Default declarado? | Descrição de infraestrutura |
| --- | --- | --- |
| cgid | Sim; valor omitido | CGID variable for unique naming between scenarios |
| location | Sim; valor omitido | Azure region to deploy resources in |
| subscription_id | Sim; valor omitido | The Azure subscription ID |

## Plano da nossa futura rodada

- [ ] Ler objetivo e verificar se a adaptação preservaria o exercício.
- [ ] Confirmar permissões, serviços, quotas, credenciais e limite de créditos.
- [ ] Registrar diferenças propostas antes de alterar o original.
- [ ] Validar configuração e plano sem anunciar compatibilidade antecipada.
- [ ] Implantar, verificar disponibilidade e realizar teste funcional autorizado.
- [ ] Destruir e conferir ausência de recursos da atividade.
- [ ] Documentar resultados e publicar apenas o estado realmente comprovado.

## Referências específicas

- [README original (pode conter walkthrough)](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/README.md)
- [manifest.yml](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/manifest.yml)
- [terraform/provider.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/provider.tf)
- [terraform/variables.tf](https://github.com/RhinoSecurityLabs/cloudgoat/blob/63c65bd26edc6919499adfa20b176c450e35c33c/cloudgoat/scenarios/azure/datafactory_secret_theft/terraform/variables.tf)

Não são copiados walkthroughs, flags, senhas, conteúdo de User Data ou valores de variáveis. Tipos e nomes de recursos podem revelar serviços envolvidos; consulte esta ficha como preparação, antes da tentativa sem dicas.
