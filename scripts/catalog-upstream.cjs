// Generate preparation notes from a local, read-only upstream checkout.
// No cloud commands, deployments or upstream scripts are executed.
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const repo = path.resolve(__dirname, '..');
const upstream = path.resolve(process.argv[2] || '../cloudgoat');
const revision = cp.execFileSync('git', ['-C', upstream, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const base = path.join(upstream, 'cloudgoat/scenarios');
const docs = path.join(repo, 'docs/scenarios');
const read = p => fs.readFileSync(p, 'utf8');
const walk = p => fs.readdirSync(p, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(p,e.name)) : [path.join(p,e.name)]);
const link = (platform,name,file='README.md') => `https://github.com/RhinoSecurityLabs/cloudgoat/blob/${revision}/cloudgoat/scenarios/${platform}/${name}/${file.replaceAll('\\','/')}`;
const cell = s => s.replaceAll('|','\\|').replace(/\s+/g,' ').trim();
const awsOrder = ['cloud_breach_s3','static','ec2_ssrf','data_secrets','sns_secrets','beanstalk_secrets','vulnerable_lambda','rds_snapshot','s3_version_rollback_via_cfn','codebuild_secrets','rce_web_app','sqs_flag_shop','secrets_in_the_cloud','vpc_peering_overexposed','vulnerable_cognito','ecs_takeover','ecs_efs_attack','ecs_privesc_evade_protection','glue_privesc','detection_evasion','bedrock_agent_hijacking','agentcore_identity_confusion','iam_enum_basics','iam_privesc_by_rollback','iam_privesc_by_key_rotation','lambda_privesc','iam_privesc_by_ec2','iam_privesc_by_attachment','federated_console_takeover'];
let total = 0;
for(const platform of ['aws','azure']) {
  const names = fs.readdirSync(path.join(base,platform),{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name!=='scenario_template').map(e=>e.name);
  names.sort((a,b)=>platform==='aws'?awsOrder.indexOf(a)-awsOrder.indexOf(b):(Number(a==='azure_test')-Number(b==='azure_test')||a.localeCompare(b)));
  const index = [`# Preparação dos cenários ${platform.toUpperCase()}`, '', `Fonte: CloudGoat, commit \`${revision.slice(0,7)}\`. Cada pasta contém uma ficha de preparação, não uma adaptação pronta.`, '',
    platform==='aws'?'A ordem abaixo é uma proposta de trabalho para nossa conta restrita, não a ordem oficial de dificuldade. O primeiro já possui uma adaptação testada. Os próximos precisam de revisão detalhada antes de implantar. Cenários centrados em IAM foram deixados para avaliação posterior porque reutilizar LabRole pode eliminar o objetivo.':'Há um cenário documentado e uma prova de conceito. Não houve teste em assinatura ou tenant Azure nesta entrega.', '',
    '| Ordem de trabalho | Pasta | Dificuldade do README | Situação |','| --- | --- | --- | --- |'];
  for(let i=0;i<names.length;i++) {
    const name=names[i], dir=path.join(base,platform,name), files=walk(dir);
    const readme=read(path.join(dir,'README.md'));
    const poc=/not an actual scenario/i.test(readme);
    const tf=files.filter(f=>f.endsWith('.tf') && !f.includes(`${path.sep}solution${path.sep}`));
    const resources=tf.flatMap(f=>[...read(f).matchAll(/resource\s+"([a-z0-9_]+)"\s+"([^"]+)"/g)].map(m=>({type:m[1],file:path.relative(dir,f)})));
    const byType = new Map();
    for(const r of resources) {const v=byType.get(r.type)||{count:0,files:new Set()};v.count++;v.files.add(r.file);byType.set(r.type,v);}
    const types=[...byType.keys()].sort();
    const difficulty=readme.match(/Dif{1,2}ic?ulty\**\s*:\**\s*([^\r\n]+)/i)?.[1]?.replaceAll('*','').trim()||'Não declarada';
    const size=readme.match(/Size\**\s*:\**\s*([^\r\n]+)/i)?.[1]?.replaceAll('*','').trim()||'Não declarado';
    const status=poc?'Prova de conceito; não é desafio completo':name==='cloud_breach_s3'?'Original requer IAM; adaptação academy criada, resposta inicial e destroy verificados':name==='codebuild_secrets'?'Original: tentativa bloqueada em IAM/RDS; sem adaptação funcional':'Somente preparação estática; ainda não adaptado nem implantado';
    index.push(`| ${poc?'—':i+1} | [${name}](${name}/README.md) | ${cell(difficulty)} | ${status} |`);
    const notes=[`# ${name}`, '', `Plataforma: ${platform.toUpperCase()}. Dificuldade informada no README: **${cell(difficulty)}**. Tamanho informado: ${cell(size)}.`, '', `**Situação:** ${status}.`, '',
      `Origem: [README original](${link(platform,name)}), base \`${revision.slice(0,7)}\`. Esta ficha é uma análise de preparação do código, não um resultado de teste nem uma garantia de compatibilidade.`, '', '## Antes de começar', '',
      '[Leia os requisitos comuns e o procedimento de trabalho](../../PREPARATION.md). Não é necessário ligar a VM para ler esta ficha. Credenciais e serviços da nuvem só serão usados na etapa de testes.', ''];
    if(poc) notes.push('O README original declara que esta pasta é uma POC, não um cenário real. Ela fica catalogada separadamente e não entra na contagem de desafios Azure completos.','');
    notes.push('## Infraestrutura declarada', '', 'A contagem é de blocos resource no Terraform, não de instâncias finais. count, for_each e scripts podem criar mais recursos. Data sources e ações de scripts não entram nessa contagem. A tabela não demonstra autorização para criar ou excluir os recursos.', '', '| Tipo Terraform | Blocos | Arquivos de origem |', '| --- | ---: | --- |');
    for(const type of types) {const v=byType.get(type);notes.push(`| \`${type}\` | ${v.count} | ${[...v.files].map(f=>`[${path.basename(f)}](${link(platform,name,f)})`).join(', ')} |`);}
    if(!types.length)notes.push('| — | 0 | Nenhum bloco resource encontrado |');
    const dataTypes=[...new Set(tf.flatMap(f=>[...read(f).matchAll(/data\s+"([a-z0-9_]+)"\s+"([^"]+)"/g)].map(m=>m[1])))].sort();
    if(dataTypes.length)notes.push('', 'Consultas/data sources declarados (também exigem acesso de leitura): '+dataTypes.map(t=>'`'+t+'`').join(', ')+'.');
    if(name==='cloud_breach_s3')notes.push('', 'Nossa adaptação existente está documentada em [cloud_breach_s3_academy](../cloud_breach_s3_academy/adaptation.md). A tabela acima descreve o original, não a adaptação.');
    notes.push('', '## Acessos a conferir antes do teste', '');
    const iam=types.filter(t=>/^aws_iam_/.test(t));
    if(iam.length)notes.push(`- O original declara IAM (${iam.map(t=>'`'+t+'`').join(', ')}). Nossa sessão anterior negou CreateRole, CreateUser e CreatePolicy. Verificar a identidade de provisionamento antes de qualquer apply; a adaptação exige análise própria.`);
    if(types.includes('aws_iam_instance_profile'))notes.push('- Para reutilizar perfil institucional: confirmar existência, confiança para EC2, permissões da role e autorização PassRole. Não assumir que o nome LabInstanceProfile basta.');
    if(types.some(t=>t.startsWith('aws_db_')))notes.push('- RDS: verificar classe, engine, versão, armazenamento, região, snapshots e permissões de criação/remoção. A negativa que observamos em db.m5.large não prova bloqueio de todo RDS.');
    if(types.includes('aws_instance')||types.includes('aws_launch_template'))notes.push('- EC2: verificar AMI/proprietário, arquitetura, tamanho de instância, volume, quotas e regras da instituição. A conta anterior restringia AMIs e tipos de volume.');
    if(types.includes('aws_s3_bucket'))notes.push('- S3: verificar criação, leitura, envio de objetos e remoção. O provider pode consultar Object Lock mesmo sem usá-lo; nossa conta negou essa leitura. A correção de um cenário não é automaticamente aplicável a todos.');
    if(types.some(t=>/^aws_(ecs|ecr|autoscaling|efs)/.test(t)))notes.push('- Containers/EFS: conferir roles de execução/tarefa, rede, imagens, arquitetura, volumes e capacidade do serviço. A role compartilhada pode mudar o isolamento do exercício.');
    if(types.some(t=>/^aws_(bedrock|opensearch)/.test(t)))notes.push('- IA/OpenSearch: confirmar disponibilidade regional, acesso aos serviços, quotas, roles e consumo antes de qualquer criação. Esses serviços ainda não foram verificados na conta.');
    if(types.some(t=>/^aws_(guardduty|cloudtrail|cloudwatch|ses)/.test(t)))notes.push('- Monitoramento/notificações: distinguir recursos próprios dos controles institucionais. Verificar detector preexistente, logs, regras, inscrições e eventual verificação de e-mail; não modificar proteções da conta para fazer o teste passar.');
    if(types.some(t=>/^aws_(glue|codebuild|cognito|api_gateway|sqs)/.test(t)))notes.push('- Serviços adicionais: conferir operações de criação e remoção, roles exigidas e acesso ao serviço mostrado na tabela; não há teste de compatibilidade desses serviços nesta ficha.');
    if(platform==='azure') {
      notes.push('- Acesso a uma assinatura Azure autorizada, tenant correto e permissões efetivas para os tipos de recurso da tabela. A conta AWS não fornece esse acesso.');
      if(types.some(t=>t.startsWith('azuread_')))notes.push('- Microsoft Entra ID: verificar criação/gestão de usuários, aplicações e atribuições exigidas no código. Permissão sobre uma assinatura não garante permissão sobre o diretório.');
      if(types.some(t=>/role_assignment|access_policy/.test(t)))notes.push('- Conferir atribuições RBAC e políticas de acesso do Key Vault. A criação da infraestrutura e o acesso ao plano de dados são verificações distintas.');
      if(types.some(t=>/key_vault/.test(t)))notes.push('- Key Vault: revisar nome global, região, soft delete, recuperação e permissões de exclusão. Não prometer remoção definitiva se a instituição mantém recuperação obrigatória.');
    }
    notes.push('', '## Ferramentas e configuração local', '', '- Base declarada pelo README raiz: Linux/macOS, Python 3.9+, Terraform 1.5+, AWS CLI, Azure CLI e jq; Windows não é oficialmente suportado.', '- CloudGoat instalado por pipx; Git para obter o projeto. São requisitos gerais do projeto original, não uma lista validada de dependências de cada aplicação.', platform==='aws'?'- Perfil AWS separado e, se temporário, ID + segredo + Session Token da mesma sessão. Whitelist atualizada para a rede de teste.':'- Login pelo Azure CLI e assinatura configurada no CloudGoat. Confirmar tenant, região e permissões antes de criar recursos.');
    const combined=files.filter(f=>/\.(tf|sh|md)$/.test(f)&&!/(cheat|solution)/i.test(f)).map(f=>read(f)).join('\n');
    if(/\bdocker\b/i.test(combined))notes.push('- O código/documentação menciona Docker: verificar sua necessidade local e builds/push de imagens antes de executar scripts.');
    if(/\bssh-keygen\b/.test(combined))notes.push('- Scripts originais usam ssh-keygen: cliente OpenSSH e geração de chaves locais. Não publicar essas chaves.');
    if(/\bzip\b/.test(combined))notes.push('- Há referências a ZIP/empacotamento: conferir zip/unzip e artefatos exigidos nos scripts.');
    const versions=[];
    for(const f of tf) {const s=read(f);for(const m of s.matchAll(/required_version\s*=\s*"([^"]+)"/g))versions.push('Terraform: `'+m[1]+'`');for(const m of s.matchAll(/source\s*=\s*"([^"\n]+)"\s+version\s*=\s*"([^"\n]+)"/g))versions.push('Provider `'+m[1]+'`: `'+m[2]+'`');}
    if(versions.length) notes.push('', 'Restrições encontradas no Terraform:', '', ...[...new Set(versions)].map(s=>'- '+s));
    notes.push('', '## Variáveis declaradas', '', 'Nomes e descrições vêm do Terraform. Valores de senhas, segredos, flags e credenciais não são reproduzidos. Uma variável com default ainda pode precisar de revisão; a ausência de default não significa necessariamente entrada manual, pois o CloudGoat fornece algumas variáveis.', '', '| Variável | Default declarado? | Descrição de infraestrutura |', '| --- | --- | --- |');
    const vars=[];
    for(const f of tf)for(const m of read(f).matchAll(/variable\s+"([^"]+)"\s*\{([\s\S]*?)(?=\n\s*variable\s+"|$)/g)) {const desc=m[2].match(/description\s*=\s*"([^"\r\n]*)"/)?.[1]||'Consultar arquivo original';vars.push([m[1],/\bdefault\s*=/.test(m[2])?'Sim; valor omitido':'Não',desc]);}
    for(const v of vars)notes.push('| '+v.map(cell).join(' | ')+' |');
    if(!vars.length)notes.push('| — | — | Nenhuma variável encontrada |');
    notes.push('', '## Plano da nossa futura rodada', '', '- [ ] Ler objetivo e verificar se a adaptação preservaria o exercício.', '- [ ] Confirmar permissões, serviços, quotas, credenciais e limite de créditos.', '- [ ] Registrar diferenças propostas antes de alterar o original.', '- [ ] Validar configuração e plano sem anunciar compatibilidade antecipada.', '- [ ] Implantar, verificar disponibilidade e realizar teste funcional autorizado.', '- [ ] Destruir e conferir ausência de recursos da atividade.', '- [ ] Documentar resultados e publicar apenas o estado realmente comprovado.', '',
      '## Referências específicas', '', `- [README original (pode conter walkthrough)](${link(platform,name)})`);
    for(const f of files.filter(f=>/(manifest\.yml|variables\.tf|provider\.tf|start\.sh)$/.test(f)&&!f.includes(`${path.sep}solution${path.sep}`)))notes.push(`- [${path.relative(dir,f).replaceAll('\\','/')}](${link(platform,name,path.relative(dir,f))})`);
    notes.push('', 'Não são copiados walkthroughs, flags, senhas, conteúdo de User Data ou valores de variáveis. Tipos e nomes de recursos podem revelar serviços envolvidos; consulte esta ficha como preparação, antes da tentativa sem dicas.', '');
    const target=path.join(docs,platform,name);fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'README.md'),notes.join('\n'));total++;
  }
  fs.mkdirSync(path.join(docs,platform),{recursive:true});fs.writeFileSync(path.join(docs,platform,'README.md'),index.join('\n')+'\n');
}
console.log(`Geradas ${total} fichas de preparação a partir de ${revision.slice(0,7)}.`);
