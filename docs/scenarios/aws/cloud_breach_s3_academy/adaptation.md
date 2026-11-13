# CloudGoat Students
## Adaptação acadêmica de cloud_breach_s3

Relatório técnico - 13/11/2026

Autor do projeto de adaptações: Alef Kaue, com assistência de IA. Origem: Rhino Security Labs, CloudGoat, commit 63c65bd. Este documento explica preparação, problemas encontrados, decisões de implementação, validação e reprodução. Não é um roteiro de resolução do desafio.

## 1. O propósito do projeto

CloudGoat cria laboratórios intencionalmente vulneráveis com Python e Terraform. Os alunos investigam um ambiente e buscam um objetivo. A ferramenta é pública, mas executar seus cenários exige permissões para provisionar recursos reais de nuvem.

CloudGoat Students é um projeto independente para adaptar esses laboratórios quando um ambiente acadêmico impõe restrições. O repositório possui pastas distintas para AWS e Azure, permitindo acrescentar cenários gradualmente. Apenas cloud_breach_s3_academy foi implementado nesta entrega. A pasta Azure é uma estrutura para trabalhos futuros; não representa cenários já testados.

Não existe uma permissão universal de conta de estudante. Um teste bem-sucedido em uma sessão voclabs não demonstra compatibilidade com todas as instituições, regiões ou assinaturas. A matriz docs/compatibility.md registra o ambiente observado e os requisitos de cada adaptação.

Uma inspeção estática da base 63c65bd encontrou criação de roles em 28 dos 29 cenários AWS. O único sem criação de role, iam_privesc_by_rollback, cria usuário, política e chave IAM. Todos encontram alguma dependência incompatível com as negativas IAM observadas nesta sessão voclabs. Não executamos os 29 cenários e essa evidência não autoriza generalizar o bloqueio para toda conta de estudante ou para Azure. A negativa de RDS também foi específica à configuração solicitada; não demonstra indisponibilidade de todo o serviço.

## 2. Por que foi necessário mudar o laboratório

A tentativa inicial usou codebuild_secrets. A autenticação e o planejamento funcionaram, mas a conta negou criação de usuários, roles e políticas IAM. A instância RDS solicitada também foi negada. A falha não foi causada pela VM local nem pelo token após sua configuração correta.

Foi escolhido outro cenário, cloud_breach_s3, cuja infraestrutura exige menos serviços e pode reutilizar uma identidade institucional. Portanto, o resultado não é uma versão de codebuild_secrets: é uma adaptação separada de cloud_breach_s3. Essa distinção deve ser explicada ao professor.

## 3. Como funciona o cenário original

O original cria uma VPC com duas sub-redes públicas, rotas de internet, grupos de segurança, uma EC2 Ubuntu, uma chave SSH e um bucket S3 com arquivos fictícios. Também cria uma role IAM com AmazonS3FullAccess e um instance profile que liga essa role à EC2.

A aplicação é um nginx configurado como proxy. A configuração vulnerável e a identidade da instância compõem o exercício. O aluno começa como um visitante externo, com o IP do servidor, e precisa compreender o comportamento do endpoint e as relações entre aplicação, identidade e armazenamento. O objetivo é recuperar os dados fictícios do cenário.

No código original, um provisionador Terraform envia proxy.com por SSH. Um script de inicialização instala o nginx e utiliza o arquivo recebido. Esses dois mecanismos podem executar em momentos diferentes; a adaptação concentra essa configuração na inicialização para reduzir essa dependência temporal.

## 4. O que a conta acadêmica ofereceu

A consulta ao IAM confirmou um instance profile preexistente chamado LabInstanceProfile, associado à LabRole, com confiança para EC2. As políticas consultadas oferecem operações EC2 e S3 e impõem restrições de região, imagem de sistema, tipo de instância e volume.

Essas políticas pertencem à role da instância. Elas não são, por si só, prova de todas as permissões efetivas da sessão que provisiona o ambiente. Foi executado também um pedido EC2 em modo dry-run, que retornou Request would have succeeded com os parâmetros escolhidos. Esse teste não criou uma instância e foi seguido por validação na implantação real.

As credenciais do aluno são temporárias: Access Key ID, Secret Access Key e Session Token devem vir juntos da seção AWS CLI do laboratório. O perfil local usado nos exemplos é cloudgoat-lab. Nenhuma credencial, número de conta específico ou token foi incluído neste repositório público.

## 5. Mudanças e justificativas

1. Identidade da EC2: removemos a criação da role e do instance profile originais e usamos um data source para LabInstanceProfile. Não alteramos a LabRole, não anexamos políticas e não tentamos liberar ações negadas. O Terraform não exclui esse recurso institucional no encerramento.

2. Sistema operacional remoto: substituímos a AMI Ubuntu por Amazon Linux 2023 x86_64, obtida de um parâmetro público AWS. A mudança atende à restrição observada sobre o proprietário da AMI. A VM local continua Ubuntu Server; ela apenas controla o laboratório remoto.

3. Capacidade: mantivemos t3.micro e volume gp2 de 8 GiB. A adaptação não precisa de RDS nem CodeBuild. Essa escolha é diferente dos recursos do cenário que falhou inicialmente.

4. Inicialização web: instalamos nginx por dnf e incorporamos proxy.com ao user_data usando base64. O arquivo original do proxy é preservado. Uma configuração principal mínima do nginx evita concorrência entre servidores padrão. O provisionador de envio de arquivo por SSH foi removido.

5. Serviço de metadados: declaramos tokens opcionais explicitamente para preservar a condição didática do exercício original. É uma vulnerabilidade deliberada do laboratório, e não uma configuração recomendada para sistemas comuns.

6. Repetição: start.sh gera a chave SSH apenas se ela não existir. Assim, uma nova tentativa de criação não troca as chaves da instância anterior. O teste executou o script duas vezes e comparou o hash da chave, que permaneceu igual.

7. Identificação do CloudGoat: não distribuímos o lock de providers dentro do template. Na combinação de versões testada, o comando terraform providers falhava antes do primeiro init quando o lock existia sem plugins instalados. O CloudGoat usava essa saída para detectar AWS e deixava de passar profile. A instância gera seu próprio lock durante init. A correção foi verificada pelos métodos de detecção e planejamento do próprio CloudGoat.

## 6. A restrição de S3 encontrada na implantação

A conta permitiu criar o bucket, mas negou GetBucketObjectLockConfiguration. O provider AWS consultava essa configuração no ciclo de leitura de aws_s3_bucket e o apply falhava. O erro não significava que criar o bucket ou seus objetos fosse proibido.

O ciclo de vida do bucket passou a usar terraform_data com um script AWS CLI. As operações são STS para confirmar a conta, ListBuckets para identificar existência, HeadBucket com expected-bucket-owner para verificar o proprietário, CreateBucket quando necessário e PutBucketTagging para registrar o cenário. O script não consulta nem modifica Object Lock; o deny institucional continua em vigor.

Os quatro objetos fictícios permanecem gerenciados por aws_s3_object. A dependência Terraform garante que o gerenciamento do bucket termine antes do envio dos objetos. No destroy, o script confere o nome exclusivo do cenário e a conta antes de remover o bucket e seu conteúdo.

A migração da tentativa parcialmente criada preservou o bucket e a EC2. O estado foi copiado como backup antes de retirar apenas o endereço aws_s3_bucket do controle antigo. O novo gerenciamento adotou o bucket existente. O plano de retomada apresentou cinco adições, nenhuma alteração e nenhuma exclusão de recursos existentes.

## 7. Como funciona a versão adaptada

O aluno executa o CloudGoat a partir da VM local. Terraform usa suas credenciais temporárias para criar rede, EC2 e armazenamento na conta do laboratório. A EC2 recebe o instance profile institucional já existente. O nginx sobe por cloud-init e o CloudGoat informa o IP inicial.

O início do exercício continua sendo o endpoint web e os dados do cenário continuam fictícios. Uma requisição comum recebeu HTTP 400, resposta prevista pela configuração original para pedidos que não atendem às condições da aplicação. Isso foi usado apenas como teste de disponibilidade. Não executamos a recuperação de credenciais nem a extração de dados para resolver o desafio.

A diferença pedagógica principal é a LabRole compartilhada, que pode ser mais ampla que a role original. A versão não reproduz fielmente o isolamento IAM original. As atividades devem ficar limitadas aos recursos criados para o exercício. O perfil administrativo usado para provisionar não deve ser usado para obter diretamente a resposta.

Outra limitação é a detecção de mudanças externas no bucket: terraform_data não oferece todas as leituras de drift do recurso aws_s3_bucket. As credenciais do perfil também precisam continuar válidas para os provisionadores de criação e remoção.

## 8. Resultados verificados

- Terraform init e validate concluídos sem erro.
- Plano inicial com 16 recursos novos e nenhuma criação IAM.
- Dry-run EC2 autorizado com LabInstanceProfile.
- Implantação real concluída após o ajuste S3.
- Nova execução pelo CloudGoat concluiu init, plan, apply e output sem erro.
- Endpoint HTTP inicial respondeu conforme o comportamento do proxy.
- CloudGoat reconheceu uma instância implantada de cloud_breach_s3_academy.

O encerramento final foi concluído: 16 recursos destruídos sem erro, EC2 terminada, bucket ausente e CloudGoat sem instâncias implantadas. A conferência direta também confirmou a ausência dos recursos de teste anteriores e a preservação de LabInstanceProfile. A consulta por tags ainda continha entradas antigas; consultas diretas aos IDs retornaram NotFound. Os detalhes estão em docs/cleanup.md. Não confunda validação estática, teste de permissão e teste real: cada um comprova uma etapa diferente.

## 9. Preparar a VM para a faculdade

Destruir o ambiente AWS não remove as ferramentas nem o cenário instalado na VM. Depois de confirmar a limpeza, desligue e exporte a VM. O arquivo exportado preserva o Ubuntu, ferramentas e alterações locais; os recursos da AWS não são transportados.

Na faculdade, inicie o laboratório e obtenha novas credenciais temporárias. Configure o perfil e o token em uma sessão SSH sua, sem publicá-los:

    aws configure --profile cloudgoat-lab
    read -rs -p "Session Token: " AWS_LAB_TOKEN
    aws configure set aws_session_token "$AWS_LAB_TOKEN" --profile cloudgoat-lab
    unset AWS_LAB_TOKEN
    aws sts get-caller-identity --profile cloudgoat-lab

Se o Account ID mudar, não reutilize o estado da conta anterior. Confirme também a existência e as permissões de LabInstanceProfile na nova conta. Atualize a whitelist para a rede atual:

    cloudgoat config whitelist --auto
    cloudgoat create cloud_breach_s3_academy --profile cloudgoat-lab

O IP exibido será o novo ponto de partida. Aguarde o bootstrap. Depois da atividade:

    cloudgoat destroy cloud_breach_s3_academy --profile cloudgoat-lab
    cloudgoat list deployed

Desligar a VM local ou expirar a sessão não garante remoção dos recursos AWS. Em caso de erro no destroy, preserve o estado e corrija o problema antes de apagar arquivos locais.

## 10. Organização e publicação no GitHub

O repositório cloudgoat-students inclui README, licença original, atribuição, matriz de compatibilidade, instalador e uma pasta por cenário. As futuras adaptações AWS e Azure devem documentar pré-requisitos, diferenças e testes antes de serem anunciadas como compatíveis.

O pacote público contém somente código, scripts, assets fictícios e documentação. Credenciais, chaves SSH geradas, estados Terraform, planos, logs de sessões, whitelist e start.txt não pertencem ao repositório. O instalador recusa sobrescrever um cenário existente e não cria recursos na nuvem.

A licença BSD 3-Clause do CloudGoat permite redistribuição com modificações, exigindo preservação do aviso de copyright, condições e disclaimer. O projeto é independente e não implica endosso dos autores originais ou dos provedores de nuvem.

## 11. Explicação para apresentação

O cenário original dependia de IAM que o ambiente acadêmico não permitia criar. Reutilizamos uma identidade institucional autorizada, ajustamos a imagem da EC2 às políticas e mantivemos o objetivo de aprendizagem. Corrigimos também a detecção de plataforma do CloudGoat e a incompatibilidade de leitura S3 do provider com o deny de Object Lock. As diferenças e limitações foram documentadas; o desafio foi disponibilizado para o aluno resolver sozinho.

## Fontes e evidências

CloudGoat original: https://github.com/RhinoSecurityLabs/cloudgoat

Cenário de referência: cloudgoat/scenarios/aws/cloud_breach_s3, commit 63c65bd. Consultamos seus arquivos Terraform, scripts, assets, manifest e README. A licença é reproduzida em LICENSE.

As restrições acadêmicas foram confirmadas por respostas da AWS e políticas consultadas na sessão autorizada. O comportamento do provider foi comparado ao código público do terraform-provider-aws. As alterações e o relatório são contribuições da adaptação, não documentação oficial dos serviços.
