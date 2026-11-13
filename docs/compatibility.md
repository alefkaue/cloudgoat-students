# Compatibilidade

| Cenário | Ambiente observado | Dependências institucionais | Diferenças |
| --- | --- | --- | --- |
| AWS/cloud_breach_s3_academy | Uma sessão voclabs, us-east-1; CloudGoat 2.5.0; Terraform 1.17.2; provider AWS 6.73.0 | LabInstanceProfile com acesso necessário ao S3; PassRole para EC2; EC2 t3.micro, rede e S3 permitidos | Amazon Linux; role compartilhada mais ampla; bucket gerenciado por CLI |
| Azure | Nenhum teste ainda | A avaliar por cenário | Não anunciado como compatível |

O sucesso nessa sessão não garante compatibilidade com todos os Learner Labs, AWS Academy, contas pessoais, assinaturas Azure Students ou sandboxes. O professor deve autorizar a atividade e o ambiente deve oferecer as operações necessárias.

## O que as evidências permitem afirmar

Na base `63c65bd`, a inspeção estática dos arquivos Terraform dos 29 cenários AWS encontrou criação de roles em 28 cenários. O outro, `iam_privesc_by_rollback`, cria usuário, política e chave IAM. A sessão voclabs testada retornou AccessDenied para CreateRole, CreateUser e CreatePolicy. Portanto, todos os 29 cenários originais têm ao menos uma dependência de IAM incompatível com as permissões observadas nessa sessão.

Essa conclusão combina análise do código e erros reais de autorização; **não significa que executamos 29 implantações**, nem que toda conta de estudante possua essas restrições. A negativa de RDS ocorreu na configuração solicitada pelo codebuild_secrets e não demonstra bloqueio de todo o serviço RDS. Nenhuma conclusão equivalente foi verificada para Azure.

Formulação pública recomendada: "Adaptei um cenário do CloudGoat às restrições IAM e S3 do ambiente acadêmico voclabs que utilizei. Documentei as diferenças e validei criação, resposta inicial e remoção. O projeto está organizado para receber outras adaptações AWS e Azure, com compatibilidade testada por cenário."

O deny de Object Lock permanece em vigor. A adaptação usa apenas APIs autorizadas para criar, identificar, etiquetar e excluir seu bucket. O mecanismo CLI reduz a detecção automática de drift do bucket. As políticas da role institucional não são modificadas.
