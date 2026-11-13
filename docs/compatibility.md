# Compatibilidade

| Cenário | Ambiente observado | Dependências institucionais | Diferenças |
| --- | --- | --- | --- |
| AWS/cloud_breach_s3_academy | Uma sessão voclabs, us-east-1; CloudGoat 2.5.0; Terraform 1.17.2; provider AWS 6.73.0 | LabInstanceProfile com acesso necessário ao S3; PassRole para EC2; EC2 t3.micro, rede e S3 permitidos | Amazon Linux; role compartilhada mais ampla; bucket gerenciado por CLI |
| Azure | Nenhum teste ainda | A avaliar por cenário | Não anunciado como compatível |

O sucesso nessa sessão não garante compatibilidade com todos os Learner Labs, AWS Academy, contas pessoais, assinaturas Azure Students ou sandboxes. O professor deve autorizar a atividade e o ambiente deve oferecer as operações necessárias.

O deny de Object Lock permanece em vigor. A adaptação usa apenas APIs autorizadas para criar, identificar, etiquetar e excluir seu bucket. O mecanismo CLI reduz a detecção automática de drift do bucket. As políticas da role institucional não são modificadas.
