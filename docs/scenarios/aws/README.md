# Preparação dos cenários AWS

Fonte: CloudGoat, commit `63c65bd`. Cada pasta contém uma ficha de preparação, não uma adaptação pronta.

A ordem abaixo é uma proposta de trabalho para nossa conta restrita, não a ordem oficial de dificuldade. O primeiro já possui uma adaptação testada. Os próximos precisam de revisão detalhada antes de implantar. Cenários centrados em IAM foram deixados para avaliação posterior porque reutilizar LabRole pode eliminar o objetivo.

| Ordem de trabalho | Pasta | Dificuldade do README | Situação |
| --- | --- | --- | --- |
| 1 | [cloud_breach_s3](cloud_breach_s3/README.md) | Moderate | Original requer IAM; adaptação academy criada, resposta inicial e destroy verificados |
| 2 | [static](static/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 3 | [ec2_ssrf](ec2_ssrf/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 4 | [data_secrets](data_secrets/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 5 | [sns_secrets](sns_secrets/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 6 | [beanstalk_secrets](beanstalk_secrets/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 7 | [vulnerable_lambda](vulnerable_lambda/README.md) | Medium | Somente preparação estática; ainda não adaptado nem implantado |
| 8 | [rds_snapshot](rds_snapshot/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 9 | [s3_version_rollback_via_cfn](s3_version_rollback_via_cfn/README.md) | Hard | Somente preparação estática; ainda não adaptado nem implantado |
| 10 | [codebuild_secrets](codebuild_secrets/README.md) | Hard | Original: tentativa bloqueada em IAM/RDS; sem adaptação funcional |
| 11 | [rce_web_app](rce_web_app/README.md) | Hard | Somente preparação estática; ainda não adaptado nem implantado |
| 12 | [sqs_flag_shop](sqs_flag_shop/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 13 | [secrets_in_the_cloud](secrets_in_the_cloud/README.md) | Hard | Somente preparação estática; ainda não adaptado nem implantado |
| 14 | [vpc_peering_overexposed](vpc_peering_overexposed/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 15 | [vulnerable_cognito](vulnerable_cognito/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 16 | [ecs_takeover](ecs_takeover/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 17 | [ecs_efs_attack](ecs_efs_attack/README.md) | Hard | Somente preparação estática; ainda não adaptado nem implantado |
| 18 | [ecs_privesc_evade_protection](ecs_privesc_evade_protection/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 19 | [glue_privesc](glue_privesc/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 20 | [detection_evasion](detection_evasion/README.md) | Hard | Somente preparação estática; ainda não adaptado nem implantado |
| 21 | [bedrock_agent_hijacking](bedrock_agent_hijacking/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 22 | [agentcore_identity_confusion](agentcore_identity_confusion/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 23 | [iam_enum_basics](iam_enum_basics/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 24 | [iam_privesc_by_rollback](iam_privesc_by_rollback/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 25 | [iam_privesc_by_key_rotation](iam_privesc_by_key_rotation/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 26 | [lambda_privesc](lambda_privesc/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 27 | [iam_privesc_by_ec2](iam_privesc_by_ec2/README.md) | Easy | Somente preparação estática; ainda não adaptado nem implantado |
| 28 | [iam_privesc_by_attachment](iam_privesc_by_attachment/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
| 29 | [federated_console_takeover](federated_console_takeover/README.md) | Moderate | Somente preparação estática; ainda não adaptado nem implantado |
