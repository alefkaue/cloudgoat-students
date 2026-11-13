# cloud_breach_s3_academy

Adaptacao educacional de cloud_breach_s3, base 63c65bd.
Objetivo: investigar o endpoint web inicial e recuperar os arquivos ficticios do cenario.
O ponto de partida e apenas o IP publico fornecido pelo CloudGoat.

## Alteracoes de infraestrutura

Atualizacao S3: o ciclo de vida do bucket usa terraform_data e assets/manage-bucket.sh, evitando a leitura GetBucketObjectLockConfiguration explicitamente negada pela conta. Os objetos continuam em aws_s3_object. O destroy remove os dados ficticios e o bucket apos validar nome e conta; nao altera a role institucional. A deteccao de drift do bucket e limitada nesta adaptacao.
- Reutiliza LabInstanceProfile como data source, sem criar ou alterar IAM.
- Usa Amazon Linux 2023 em t3.micro com volume gp2 de 8 GiB.
- Configura nginx via cloud-init e mantem o arquivo proxy.com original.
- Explicita metadados com tokens opcionais para preservar o exercicio original.
- Mantem restricao de SSH/HTTP ao IP da whitelist e bucket privado.
- LabRole pode ter permissoes mais amplas que a role original: limite as atividades aos recursos desta instancia.

## Operacao
cloudgoat create cloud_breach_s3_academy --profile cloudgoat-lab
cloudgoat destroy cloud_breach_s3_academy --profile cloudgoat-lab

Nao use o perfil administrativo de provisionamento para resolver o desafio.
O servidor web pode precisar de alguns minutos apos a EC2 iniciar.
Atualize a whitelist antes de implantar em outra rede.
O destroy deve remover apenas recursos novos; o instance profile preexistente nao e gerenciado.
