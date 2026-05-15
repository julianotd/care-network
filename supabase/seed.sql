-- =============================================================
-- Care Network — Seed Data
-- Dados de demonstração para o MVP
-- =============================================================

-- Clínica
INSERT INTO clinicas (id, nome, cnpj, perfil_sensorial) VALUES
('a0000000-0000-0000-0000-000000000001', 'Clínica Rede Cuidar', '12.345.678/0001-90', '{"tipo": "multi_sensorial"}');

-- Perfis (usuários)
INSERT INTO perfis (id, nome, tipo, clinica_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'Dra. Marina Silva', 'coordenador', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000002', 'Dr. Rafael Costa', 'profissional', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000003', 'Ana Beatriz Souza', 'profissional', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000004', 'Psic. Lucas Mendes', 'profissional', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000005', 'Mãe do Miguel', 'familia', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000006', 'Pai da Sophia', 'familia', 'a0000000-0000-0000-0000-000000000001');

-- Profissionais
INSERT INTO profissionais (id, perfil_id, clinica_id, registro_conselho, especialidades, metodos) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CRP 12345', '{"ABA","Comportamento"}', '{"DTT","NET"}'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'CREFITO 67890', '{"TO","Sensorial"}', '{"TEACCH","Integração Sensorial"}'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'CRFa 11111', '{"Fonoaudiologia"}', '{"PECS","PROMPT"}'),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'CRP 22222', '{"Psicologia","ABA"}', '{"ABA","ABA Verbal"}');

-- Locais
INSERT INTO locais (id, clinica_id, nome, tipo, perfil_sensorial, capacidade, area_escape) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Sala Sensorial A', 'clinica', '{"iluminacao":"dim","ruido":"silencioso","textura_piso":"macio"}', 1, true),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Sala Multiuso B', 'clinica', '{"iluminacao":"branca","ruido":"medio","textura_piso":"ceramica"}', 2, false),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Área Externa', 'ar_livre', '{"iluminacao":"branca","ruido":"medio","textura_piso":"grama"}', 3, true),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Domicílio - Família Oliveira', 'domicilio', '{"iluminacao":"amarela","ruido":"silencioso","textura_piso":"madeira"}', 1, true);

-- Pacientes
INSERT INTO pacientes (id, clinica_id, nome, data_nascimento, diagnostico, nivel_suporte, perfil_sensorial, sistema_comunicacao, horarios_crise_historico) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Miguel Oliveira', '2019-03-15', 'TEA Nível 2 de suporte', 2, '{"hipersensitivo":["auditivo","visual"],"hipossensitivo":["proprioceptivo"]}', 'PECS', '{"14:00","16:30"}'),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Sophia Santos', '2020-07-22', 'TEA Nível 1 + TDAH', 1, '{"hipersensitivo":["tátil"],"hipossensitivo":["vestibular","auditivo"]}', 'verbal funcional', '{"11:00"}'),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Arthur Lima', '2018-11-08', 'TEA Nível 3 de suporte', 3, '{"hipersensitivo":["auditivo","tátil","visual"],"hipossensitivo":["proprioceptivo"]}', 'prancha de comunicação', '{"09:00","14:00","17:00"}');

-- Círculo de cuidado
INSERT INTO circulo_cuidado (paciente_id, profissional_id, papel) VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'terapeuta'),
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'terapeuta'),
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'terapeuta'),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'terapeuta'),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'terapeuta'),
('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 'terapeuta');

-- Responsáveis
INSERT INTO responsaveis (id, perfil_id, paciente_id, parentesco, autorizacoes) VALUES
('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 'mãe', '{"foto":true,"video":true,"notas":true}'),
('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000002', 'pai', '{"foto":true,"video":false,"notas":true}');

-- Plano terapêutico
INSERT INTO planos_terapeuticos (id, paciente_id, versao, status) VALUES
('10000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 3, 'ativo');

-- Objetivos
INSERT INTO objetivos (id, plano_id, descricao, profissional_lider_id, meta, baseline, atual, unidade, status) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Comunicação funcional com PECS', 'c0000000-0000-0000-0000-000000000003', 'Usar PECS espontaneamente 10x/dia', 1, 5, 'vezes/dia', 'em_andamento'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Redução de autolesão', 'c0000000-0000-0000-0000-000000000001', 'De 8x/dia para 2x/dia', 8, 5, 'frequencia/dia', 'em_andamento'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Tolerância a texturas', 'c0000000-0000-0000-0000-000000000002', 'Tolerar massinha por 15min', 0, 8, 'minutos', 'em_andamento');

-- Estratégias
INSERT INTO estrategias (id, objetivo_id, profissional_id, descricao) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'DTT com PECS nível 3-4: expansão de vocabulário'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'NET: oportunidades naturais de comunicação durante brincadeira'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'DRA: reforçar comportamentos alternativos'),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Pausas sensoriais a cada 20min'),
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Apresentação gradual: textura seca → úmida → massinha');

-- Sessões de hoje
INSERT INTO sessoes (id, paciente_id, profissional_id, local_id, objetivo_id, data_hora, duracao_min, status, registro) VALUES
('40000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-05-15T09:00:00+08', 45, 'concluida', '{"humor":"😊","notas":"Usou PECS espontaneamente 3x"}'),
('40000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '2026-05-15T10:30:00+08', 50, 'concluida', '{"humor":"😐","notas":"Tolerou massinha por 8min (recorde!)"}'),
('40000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', NULL, '2026-05-15T11:00:00+08', 40, 'em_andamento', NULL),
('40000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', NULL, '2026-05-15T14:00:00+08', 60, 'agendada', NULL),
('40000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '2026-05-15T15:30:00+08', 30, 'agendada', NULL),
('40000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', NULL, '2026-05-15T16:00:00+08', 45, 'agendada', NULL);

-- Diário de bordo
INSERT INTO diario_bordo (id, paciente_id, data, humor, sono, alimentacao, ocorrencias, registrado_por, registrado_por_tipo) VALUES
('50000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '2026-05-15', '😊', '{"horas":9,"qualidade":"bom"}', 'normal', '[{"tipo":"positivo","descricao":"Pediu água com PECS sem prompt!"}]', 'b0000000-0000-0000-0000-000000000005', 'familia'),
('50000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', '2026-05-14', '😐', '{"horas":7,"qualidade":"ruim"}', 'pouco', '[{"tipo":"crise","descricao":"Crise às 16h após mudança de rotina"}]', 'b0000000-0000-0000-0000-000000000005', 'familia'),
('50000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', '2026-05-13', '😊', '{"horas":8,"qualidade":"bom"}', 'normal', '[]', 'b0000000-0000-0000-0000-000000000001', 'profissional'),
('50000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000002', '2026-05-15', '⚡', '{"horas":6,"qualidade":"ruim"}', 'seletiva', '[{"tipo":"observacao","descricao":"Recusou frutas, aceitou apenas massa"}]', 'b0000000-0000-0000-0000-000000000006', 'familia');

-- Canais de chat
INSERT INTO canais (id, paciente_id, tipo, nome) VALUES
('60000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'comunicacao', 'Comunicação — Miguel'),
('60000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'sensorial', 'Sensorial — Miguel'),
('60000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'rotina', 'Rotina — Miguel');

-- Mensagens
INSERT INTO mensagens (id, canal_id, autor_id, autor_tipo, conteudo, tipo_mensagem) VALUES
('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'profissional', 'Miguel ampliou vocabulário PECS: adicionamos "abrir" e "ajuda". Família, podem treinar em casa!', 'texto'),
('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'familia', 'Ótimo! Ele já tentou usar "abrir" quando queria abrir a porta. Vamos praticar mais!', 'texto'),
('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'profissional', '⚠️ Alerta: Miguel teve aumento de estereotipias motoras hoje. Sugiro reavaliar o protocolo sensorial na próxima supervisão.', 'insight'),
('70000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'profissional', 'Concordo. Vamos incluir mais pausas proprioceptivas. Posso ajustar o DRA para incluir atividades de carga?', 'texto');

-- Feed
INSERT INTO posts_feed (id, paciente_id, autor_id, autor_tipo, conteudo, tipo) VALUES
('80000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'profissional', '🎉 Miguel usou PECS espontaneamente para pedir água durante a sessão! Primeira vez sem prompt. Momento histórico!', 'conquista'),
('80000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'profissional', 'Miguel tolerou massinha por 8 minutos contínuos — recorde pessoal! Antes era 2 minutos. A estratégia de textura seca primeiro está funcionando.', 'registro'),
('80000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'familia', 'Hoje ele dormiu 9h e acordou bem! Pediu o suco com o cartão do PECS no café da manhã. Estou emocionada 🥹', 'registro');
