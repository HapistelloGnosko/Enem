import { db } from './index';
import bcrypt from 'bcryptjs';
import { LIBRARY_CONTENT } from './libraryContent';

export const INITIAL_TOPICS = [
  // MATEMÁTICA
  { area: 'matematica', name: 'Álgebra', slug: 'algebra', keywords: JSON.stringify(['equação', 'equações', 'polinômio', 'fatoração', 'mmc', 'mdc', 'radiciação', 'potenciação', 'logaritmo', 'progressão aritmética', 'progressão geométrica', 'pa', 'pg', 'módulo', 'inequação']) },
  { area: 'matematica', name: 'Geometria Plana', slug: 'geometria-plana', keywords: JSON.stringify(['triângulo', 'quadrado', 'retângulo', 'círculo', 'circunferência', 'área', 'perímetro', 'polígono', 'trapézio', 'losango', 'ângulo', 'semelhança', 'pitágoras', 'teorema']) },
  { area: 'matematica', name: 'Geometria Espacial', slug: 'geometria-espacial', keywords: JSON.stringify(['cubo', 'paralelepípedo', 'esfera', 'cilindro', 'cone', 'pirâmide', 'prisma', 'volume', 'superfície', 'poliedro', 'planificação']) },
  { area: 'matematica', name: 'Geometria Analítica', slug: 'geometria-analitica', keywords: JSON.stringify(['plano cartesiano', 'coordenadas', 'reta', 'distância', 'ponto médio', 'inclinação', 'coeficiente angular', 'circunferência']) },
  { area: 'matematica', name: 'Funções', slug: 'funcoes', keywords: JSON.stringify(['função', 'domínio', 'imagem', 'função quadrática', 'função linear', 'função afim', 'função exponencial', 'função logarítmica', 'gráfico', 'vértice', 'máximo', 'mínimo']) },
  { area: 'matematica', name: 'Trigonometria', slug: 'trigonometria', keywords: JSON.stringify(['seno', 'cosseno', 'tangente', 'triângulo retângulo', 'razões trigonométricas', 'sen', 'cos', 'tg']) },
  { area: 'matematica', name: 'Estatística', slug: 'estatistica', keywords: JSON.stringify(['média', 'mediana', 'moda', 'desvio padrão', 'variância', 'frequência', 'histograma', 'gráfico de barras', 'gráfico de setores']) },
  { area: 'matematica', name: 'Probabilidade', slug: 'probabilidade', keywords: JSON.stringify(['probabilidade', 'chance', 'evento', 'espaço amostral', 'combinação', 'permutação', 'arranjo', 'sorteio', 'dado', 'moeda']) },
  { area: 'matematica', name: 'Grandezas e Medidas', slug: 'grandezas-medidas', keywords: JSON.stringify(['porcentagem', 'regra de três', 'proporção', 'razão', 'escala', 'juros', 'juros simples', 'juros compostos', 'taxa', 'conversão', 'quilômetros', 'litros']) },

  // CIÊNCIAS DA NATUREZA
  { area: 'ciencias-natureza', name: 'Mecânica', slug: 'mecanica', keywords: JSON.stringify(['velocidade', 'aceleração', 'força', 'massa', 'newton', 'movimento', 'energia cinética', 'energia potencial', 'trabalho', 'potência', 'atrito', 'gravidade', 'dinâmica', 'cinemática']) },
  { area: 'ciencias-natureza', name: 'Termodinâmica', slug: 'termodinamica', keywords: JSON.stringify(['temperatura', 'calor', 'dilatação', 'calor específico', 'condução', 'convecção', 'irradiação', 'termodinâmica', 'entropia', 'pressão']) },
  { area: 'ciencias-natureza', name: 'Ondulatória e Óptica', slug: 'ondulatoria-optica', keywords: JSON.stringify(['onda', 'frequência', 'comprimento de onda', 'som', 'luz', 'reflexão', 'refração', 'difração', 'interferência', 'espelho', 'lente', 'óptica']) },
  { area: 'ciencias-natureza', name: 'Eletricidade e Magnetismo', slug: 'eletricidade-magnetismo', keywords: JSON.stringify(['corrente', 'tensão', 'resistência', 'ohm', 'circuito', 'potência elétrica', 'campo elétrico', 'campo magnético', 'carga', 'elétron']) },
  { area: 'ciencias-natureza', name: 'Química Geral e Inorgânica', slug: 'quimica-geral', keywords: JSON.stringify(['átomo', 'elemento', 'tabela periódica', 'ligação química', 'mol', 'molar', 'concentração', 'solução', 'ph', 'ácido', 'base']) },
  { area: 'ciencias-natureza', name: 'Química Orgânica', slug: 'quimica-organica', keywords: JSON.stringify(['carbono', 'hidrocarboneto', 'álcool', 'ácido carboxílico', 'éster', 'amina', 'polímero', 'petróleo', 'funções orgânicas']) },
  { area: 'ciencias-natureza', name: 'Físico-Química', slug: 'fisico-quimica', keywords: JSON.stringify(['entalpia', 'termoquímica', 'cinética', 'equilíbrio químico', 'eletroquímica', 'pilha', 'eletrólise', 'oxidação', 'redução']) },
  { area: 'ciencias-natureza', name: 'Biologia Celular e Genética', slug: 'biologia-celular-genetica', keywords: JSON.stringify(['célula', 'dna', 'rna', 'proteína', 'gene', 'mitose', 'meiose', 'mitocôndria', 'genética', 'mendel', 'mutação', 'herança']) },
  { area: 'ciencias-natureza', name: 'Ecologia e Meio Ambiente', slug: 'ecologia-meio-ambiente', keywords: JSON.stringify(['ecossistema', 'cadeia alimentar', 'bioma', 'biodiversidade', 'evolução', 'seleção natural', 'sustentabilidade', 'poluição', 'efeito estufa']) },
  { area: 'ciencias-natureza', name: 'Fisiologia Humana', slug: 'fisiologia-humana', keywords: JSON.stringify(['sistema nervoso', 'circulatório', 'respiratório', 'digestório', 'imune', 'hormônio', 'enzima', 'vacina', 'anticorpo']) },

  // CIÊNCIAS HUMANAS
  { area: 'ciencias-humanas', name: 'História do Brasil', slug: 'historia-brasil', keywords: JSON.stringify(['brasil', 'colônia', 'império', 'república', 'escravidão', 'abolição', 'independência', 'vargas', 'ditadura', 'democracia', 'constituição']) },
  { area: 'ciencias-humanas', name: 'História Geral', slug: 'historia-geral', keywords: JSON.stringify(['guerra', 'revolução', 'europa', 'iluminismo', 'renascimento', 'feudalismo', 'guerra fria', 'segunda guerra', 'roma', 'grécia', 'capitalismo']) },
  { area: 'ciencias-humanas', name: 'Geografia Física e Ambiental', slug: 'geografia-fisica', keywords: JSON.stringify(['clima', 'relevo', 'hidrografia', 'solo', 'vegetação', 'bioma', 'erosão', 'bacia hidrográfica', 'aquecimento']) },
  { area: 'ciencias-humanas', name: 'Geografia Humana e Econômica', slug: 'geografia-humana', keywords: JSON.stringify(['população', 'urbanização', 'migração', 'industrialização', 'globalização', 'desigualdade', 'pib', 'geopolítica', 'agropecuária']) },
  { area: 'ciencias-humanas', name: 'Filosofia', slug: 'filosofia', keywords: JSON.stringify(['filosofia', 'ética', 'moral', 'política', 'epistemologia', 'platão', 'aristóteles', 'sócrates', 'kant', 'nietzsche', 'razão']) },
  { area: 'ciencias-humanas', name: 'Sociologia', slug: 'sociologia', keywords: JSON.stringify(['sociedade', 'cultura', 'cidadania', 'classe social', 'marx', 'weber', 'durkheim', 'instituição', 'movimentos sociais', 'trabalho']) },

  // LINGUAGENS
  { area: 'linguagens', name: 'Interpretação Textual', slug: 'interpretacao-textual', keywords: JSON.stringify(['texto', 'leitura', 'compreensão', 'inferência', 'tema', 'argumento', 'gênero textual', 'crônica', 'notícia', 'editorial', 'ironia', 'efeito de sentido']) },
  { area: 'linguagens', name: 'Linguística e Variação', slug: 'linguistica-variacao', keywords: JSON.stringify(['gramática', 'norma culta', 'variação linguística', 'coloquial', 'coesão', 'coerência', 'concordância', 'regência', 'figuras de linguagem', 'metáfora']) },
  { area: 'linguagens', name: 'Literatura Brasileira', slug: 'literatura-brasileira', keywords: JSON.stringify(['literatura', 'poema', 'poesia', 'modernismo', 'romantismo', 'realismo', 'machado de assis', 'drummond', 'clarice lispector', 'autor', 'estética']) },
  { area: 'linguagens', name: 'Artes e Manifestações Culturais', slug: 'artes-cultura', keywords: JSON.stringify(['arte', 'pintura', 'música', 'dança', 'teatro', 'cinema', 'patrimônio', 'cultura popular', 'vanguarda', 'modernista']) },
  { area: 'linguagens', name: 'Língua Estrangeira', slug: 'lingua-estrangeira', keywords: JSON.stringify(['english', 'espanhol', 'vocabulary', 'language', 'reading']) },
];

export function seedDatabase() {
  console.log('Populando dados essenciais...');

  // Inserir taxonomia
  for (const topic of INITIAL_TOPICS) {
    db.insertTopic(topic.area, topic.name, topic.slug, topic.keywords);
  }
  console.log(`Taxonomia de ${INITIAL_TOPICS.length} tópicos cadastrada.`);

  // Inserir Biblioteca de Conteúdos do ENEM (teoria por assunto)
  let contentSeeded = 0;
  for (const entry of LIBRARY_CONTENT) {
    const topic = db.findTopicBySlug(entry.slug);
    if (!topic) continue;
    db.upsertTopicContent({
      topicId: topic.id,
      summary: entry.summary,
      keyPoints: JSON.stringify(entry.keyPoints),
      commonTraps: JSON.stringify(entry.commonTraps),
      studyTip: entry.studyTip,
    });
    contentSeeded++;
  }
  console.log(`Biblioteca de Conteúdos: ${contentSeeded} tópicos com material de estudo cadastrados.`);

  // Inserir Títulos e Conquistas RPG
  const { seedRpgTables, ensureInitialUserRpgState } = require('../services/gamificationService');
  seedRpgTables();
  console.log('Títulos e Conquistas RPG inicializados.');

  // Criar usuário padrão se não existir
  let user = db.findUserByEmail('estudante@enem.com');
  if (!user) {
    const passwordHash = bcrypt.hashSync('enem123', 10);
    user = db.createUser('Estudante', 'estudante@enem.com', passwordHash);
    db.updateUser(user.id, { xp: 520, level: 2, streak: 3, title: 'Novato', avatar: 'avatar-1' });
    console.log('Usuário padrão criado: estudante@enem.com (senha: enem123)');
  }
  if (user) {
    ensureInitialUserRpgState(user.id);
  }

  // Questões iniciais de alta fidelidade ENEM
  const list = db.listQuestions({ limit: 1 });
  if (list.total === 0) {
    console.log('Inserindo questões iniciais de alta fidelidade...');
    const estatistica = db.findTopicBySlug('estatistica');
    const mecanica = db.findTopicBySlug('mecanica');
    const interpretacao = db.findTopicBySlug('interpretacao-textual');

    // Q1: Estatística
    const q1Id = db.createQuestion({
      year: 2023,
      questionNumber: 142,
      discipline: 'matematica',
      topicId: estatistica?.id,
      statement: 'Os valores de faturamento diário (em milhares de reais) de uma microempresa ao longo de cinco dias foram: 12, 15, 12, 18 e 23. O gerente precisa calcular a mediana desses valores para avaliar a tendência central da distribuição semanal.',
      correctAnswer: 'C',
      difficulty: 'medium',
      classificationConfidence: 'high',
      explanation: 'Para encontrar a mediana, organizamos os dados em ordem crescente: 12, 12, 15, 18, 23. Como temos 5 observações (número ímpar), a mediana é exatamente o elemento central na 3ª posição, ou seja, 15.',
    });
    db.createAlternative(q1Id, 'A', '12 mil reais');
    db.createAlternative(q1Id, 'B', '14 mil reais');
    db.createAlternative(q1Id, 'C', '15 mil reais');
    db.createAlternative(q1Id, 'D', '16 mil reais');
    db.createAlternative(q1Id, 'E', '18 mil reais');

    // Q2: Mecânica
    const q2Id = db.createQuestion({
      year: 2023,
      questionNumber: 95,
      discipline: 'ciencias-natureza',
      topicId: mecanica?.id,
      statement: 'Um veículo de massa 1.000 kg trafega em uma pista horizontal a uma velocidade constante de 20 m/s. Ao avistar um obstáculo, o motorista aciona os freios até a parada completa do veículo. Sabendo que a aceleração de frenagem é constante e que o trabalho da força resultante de atrito foi responsável pela frenagem, determine a variação da energia cinética.',
      correctAnswer: 'B',
      difficulty: 'medium',
      classificationConfidence: 'high',
      explanation: 'A energia cinética inicial é Ec = (m * v^2) / 2 = (1000 * 20^2) / 2 = 200.000 J = 200 kJ. Como o carro para, a velocidade final é zero e a variação da energia cinética é -200 kJ.',
    });
    db.createAlternative(q2Id, 'A', '-100 kJ');
    db.createAlternative(q2Id, 'B', '-200 kJ');
    db.createAlternative(q2Id, 'C', '-400 kJ');
    db.createAlternative(q2Id, 'D', '200 kJ');
    db.createAlternative(q2Id, 'E', '400 kJ');

    // Q3: Linguagens
    const q3Id = db.createQuestion({
      year: 2023,
      questionNumber: 15,
      discipline: 'linguagens',
      topicId: interpretacao?.id,
      context: 'A literatura não visa unicamente entreter; ela constitui um espaço de reflexão crítica sobre a condição humana e os dilemas éticos de cada época, transformando a experiência estética em vetor de conscientização social.',
      statement: 'De acordo com o texto, o papel primordial da literatura perante a sociedade manifesta-se através da:',
      correctAnswer: 'D',
      difficulty: 'easy',
      classificationConfidence: 'high',
      explanation: 'O texto explicita que a literatura funciona como "vetor de conscientização social" e espaço de reflexão crítica, superando o mero entretenimento e estimulando a reflexão ética.',
    });
    db.createAlternative(q3Id, 'A', 'padronização das narrativas tradicionais');
    db.createAlternative(q3Id, 'B', 'busca exclusiva pelo deleite recreativo');
    db.createAlternative(q3Id, 'C', 'preservação estrita das formas poéticas do passado');
    db.createAlternative(q3Id, 'D', 'capacidade de suscitar questionamento e consciência crítica');
    db.createAlternative(q3Id, 'E', 'imposição de juízos morais definitivos ao leitor');

    console.log('3 questões inaugurais adicionadas.');
  }

  console.log('Seed finalizado com sucesso!');
}

seedDatabase();
