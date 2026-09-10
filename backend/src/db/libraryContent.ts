// Conteúdo teórico da Biblioteca do ENEM Quest.
// Cada entrada é vinculada a um tópico da taxonomia (por slug, ver INITIAL_TOPICS em seed.ts).

export interface LibraryContentSeed {
  slug: string;
  summary: string;
  keyPoints: string[];
  commonTraps: string[];
  studyTip: string;
}

export const LIBRARY_CONTENT: LibraryContentSeed[] = [
  // MATEMÁTICA
  {
    slug: 'algebra',
    summary:
      'Álgebra reúne equações, inequações, polinômios e sequências numéricas. No ENEM, aparece disfarçada em problemas contextualizados que pedem para modelar uma situação real com uma equação ou identificar o comportamento de uma sequência.',
    keyPoints: [
      'Equações do 1º e 2º grau: isolar a incógnita e usar a fórmula de Bhaskara quando necessário.',
      'PA (progressão aritmética): termo geral aₙ = a₁ + (n-1)r; soma Sₙ = (a₁+aₙ)·n/2.',
      'PG (progressão geométrica): termo geral aₙ = a₁·qⁿ⁻¹; soma finita Sₙ = a₁(qⁿ-1)/(q-1).',
      'Fatoração e MMC/MDC ajudam a simplificar expressões antes de resolver.',
      'Inequações mudam o sentido da desigualdade ao multiplicar/dividir por número negativo.',
    ],
    commonTraps: [
      "Confundir PA com PG quando o enunciado descreve crescimento 'constante' (pode ser em valor absoluto = PA, ou em porcentagem = PG).",
      'Esquecer de verificar se a raiz encontrada é válida no contexto do problema (ex: tempo negativo).',
    ],
    studyTip:
      'Resolva o problema primeiro "traduzindo" o texto para uma equação antes de pensar em contas — a maior dificuldade do ENEM está na interpretação, não na álgebra em si.',
  },
  {
    slug: 'geometria-plana',
    summary:
      'Trata de figuras bidimensionais: triângulos, quadriláteros, círculos e polígonos. É uma das áreas mais recorrentes do ENEM, frequentemente unida a situações de terrenos, embalagens e plantas de construção.',
    keyPoints: [
      'Teorema de Pitágoras (a²=b²+c²) é a ferramenta mais cobrada em triângulos retângulos.',
      'Áreas: triângulo = (base×altura)/2; círculo = πr²; trapézio = (B+b)·h/2.',
      'Semelhança de triângulos: lados proporcionais e ângulos correspondentes iguais.',
      'Perímetro é a soma dos lados; não confundir com área.',
    ],
    commonTraps: [
      'Trocar unidades de medida (cm² vs m²) sem converter corretamente.',
      'Usar a fórmula errada de área por confundir o tipo de figura descrito no enunciado.',
    ],
    studyTip:
      'Desenhe a figura sempre que possível — muitas questões do ENEM ficam óbvias assim que você visualiza o problema no papel.',
  },
  {
    slug: 'geometria-espacial',
    summary:
      'Estuda sólidos geométricos (cubos, cilindros, esferas, cones, pirâmides) e suas medidas de volume e área de superfície. Costuma aparecer em contextos de embalagens, reservatórios e construção civil.',
    keyPoints: [
      'Volume do cilindro = πr²h; do cone = (πr²h)/3; da esfera = (4/3)πr³.',
      'Volume do prisma = área da base × altura; da pirâmide = (área da base × altura)/3.',
      "Planificação: entender como um sólido 'se abre' em 2D ajuda a calcular área de superfície.",
      'Atenção às unidades: volume é sempre uma medida ao cubo (cm³, m³).',
    ],
    commonTraps: [
      'Confundir raio com diâmetro nas fórmulas de círculo/esfera/cilindro.',
      'Esquecer de multiplicar pela altura ao calcular volume, usando só a área da base.',
    ],
    studyTip:
      'Memorize as fórmulas de volume associando-as a objetos do dia a dia (lata = cilindro, sorvete de casquinha = cone) para não esquecer na prova.',
  },
  {
    slug: 'geometria-analitica',
    summary:
      'Une álgebra e geometria através do plano cartesiano: pontos, retas, distâncias e circunferências representadas por coordenadas e equações.',
    keyPoints: [
      'Distância entre dois pontos: d = √[(x₂-x₁)² + (y₂-y₁)²].',
      'Ponto médio de um segmento: M = ((x₁+x₂)/2, (y₁+y₂)/2).',
      'Coeficiente angular (inclinação) de uma reta: m = (y₂-y₁)/(x₂-x₁).',
      'Equação da circunferência: (x-a)² + (y-b)² = r², com centro (a,b) e raio r.',
    ],
    commonTraps: [
      'Trocar a ordem dos pontos nas fórmulas e obter sinal errado no coeficiente angular.',
      'Não perceber que o raio na equação da circunferência é o valor ao quadrado, então é preciso tirar a raiz.',
    ],
    studyTip:
      'Sempre que possível, esboce o plano cartesiano com os pontos dados — isso revela rapidamente se a resposta faz sentido geometricamente.',
  },
  {
    slug: 'funcoes',
    summary:
      'Funções descrevem relações entre variáveis (domínio e imagem). O ENEM cobra principalmente função afim (1º grau), quadrática (2º grau) e, com menor frequência, exponencial e logarítmica, sempre aplicadas a contextos como custo, lucro e crescimento populacional.',
    keyPoints: [
      "Função afim: f(x) = ax + b; o gráfico é uma reta, 'a' é a inclinação.",
      'Função quadrática: f(x) = ax² + bx + c; gráfico é uma parábola, vértice em x = -b/(2a).',
      'Função exponencial modela crescimento/decrescimento rápido (juros compostos, decaimento radioativo).',
      'O valor máximo ou mínimo de uma parábola está sempre no vértice.',
    ],
    commonTraps: [
      "Confundir o sinal de 'a' com a concavidade da parábola (a>0 abre para cima, a<0 abre para baixo).",
      'Interpretar mal o eixo x e y de um gráfico dado na questão, invertendo variável dependente e independente.',
    ],
    studyTip:
      'Pratique "ler" gráficos: o ENEM adora dar um gráfico pronto e pedir para você extrair uma informação dele, sem exigir cálculo algébrico algum.',
  },
  {
    slug: 'trigonometria',
    summary:
      'Relaciona ângulos e lados de triângulos, principalmente retângulos, através de seno, cosseno e tangente. Aparece em problemas de altura, distância e sombra.',
    keyPoints: [
      'Em um triângulo retângulo: seno = cateto oposto/hipotenusa; cosseno = cateto adjacente/hipotenusa; tangente = oposto/adjacente.',
      'Ângulos notáveis: 30°, 45° e 60° têm valores de seno/cosseno/tangente que vale a pena memorizar.',
      'Lei dos senos e lei dos cossenos resolvem triângulos quaisquer (não apenas retângulos).',
    ],
    commonTraps: [
      'Trocar cateto oposto com adjacente ao montar a razão trigonométrica.',
      'Esquecer que a soma dos ângulos internos de qualquer triângulo é 180°.',
    ],
    studyTip:
      'Desenhe o triângulo do problema e marque claramente qual ângulo está sendo usado antes de escolher seno, cosseno ou tangente.',
  },
  {
    slug: 'estatistica',
    summary:
      'Envolve organizar e interpretar dados: média, mediana, moda, desvio padrão e leitura de gráficos e tabelas. É uma das áreas mais "garantidas" do ENEM, pois cobra mais interpretação do que cálculo complexo.',
    keyPoints: [
      'Média = soma dos valores / quantidade de valores.',
      'Mediana = valor central de uma lista ordenada (ou média dos dois centrais, se par).',
      'Moda = valor que mais se repete.',
      'Desvio padrão mede o quanto os dados variam em relação à média.',
    ],
    commonTraps: [
      'Calcular a mediana sem antes ordenar os dados.',
      'Confundir gráfico de barras com histograma, ou não observar a escala do eixo y.',
    ],
    studyTip:
      'Quando a questão só pede para "ler" um gráfico ou tabela, resista à tentação de calcular algo complexo — normalmente a resposta está diretamente nos dados apresentados.',
  },
  {
    slug: 'probabilidade',
    summary:
      'Calcula a chance de eventos ocorrerem, muitas vezes combinada com análise combinatória (arranjos, combinações e permutações).',
    keyPoints: [
      'Probabilidade = número de casos favoráveis / número de casos possíveis.',
      'Combinação é usada quando a ordem não importa; arranjo/permutação quando a ordem importa.',
      'Em eventos independentes, multiplica-se as probabilidades individuais.',
      'A soma das probabilidades de todos os resultados possíveis é sempre 1 (ou 100%).',
    ],
    commonTraps: [
      'Usar combinação quando o problema pede arranjo (ordem importa), ou vice-versa.',
      'Esquecer de considerar todos os casos possíveis no denominador.',
    ],
    studyTip:
      'Antes de calcular, pergunte-se: "a ordem dos elementos importa nesse problema?" Essa pergunta já elimina metade dos erros comuns.',
  },
  {
    slug: 'grandezas-medidas',
    summary:
      'Cobre porcentagem, regra de três, proporção e conversão de unidades — ferramentas usadas o tempo todo em questões de outras áreas (física, química, geografia).',
    keyPoints: [
      'Regra de três simples: quando duas grandezas são direta ou inversamente proporcionais.',
      'Porcentagem: x% de um valor V é (x/100)×V.',
      'Juros simples: J = C×i×t; juros compostos: M = C×(1+i)ᵗ.',
      'Sempre confira se a proporção é direta (aumenta-aumenta) ou inversa (aumenta-diminui).',
    ],
    commonTraps: [
      'Montar a regra de três invertida ao lidar com grandezas inversamente proporcionais.',
      'Esquecer de converter unidades diferentes (ex: minutos e horas) antes de montar a proporção.',
    ],
    studyTip:
      'É a base matemática mais "transversal" do ENEM — domine bem, porque ela aparece disfarçada em quase todas as outras disciplinas.',
  },

  // CIÊNCIAS DA NATUREZA
  {
    slug: 'mecanica',
    summary:
      'Estuda o movimento dos corpos e as forças que atuam sobre eles: velocidade, aceleração, leis de Newton e energia. É a base da Física no ENEM.',
    keyPoints: [
      'Velocidade média = distância / tempo; aceleração = variação de velocidade / tempo.',
      'As 3 Leis de Newton: inércia, F=m×a, ação e reação.',
      'Energia cinética = (m×v²)/2; energia potencial gravitacional = m×g×h.',
      'Trabalho de uma força = F×d×cos(θ); potência = trabalho/tempo.',
    ],
    commonTraps: [
      'Confundir velocidade com aceleração ao interpretar um gráfico de movimento.',
      'Esquecer de considerar o atrito ou a resistência do ar quando o enunciado menciona explicitamente.',
    ],
    studyTip:
      'Questões de mecânica no ENEM raramente pedem fórmulas decoradas puras — geralmente envolvem interpretar uma situação real (carro freando, elevador, esporte) e aplicar o conceito certo.',
  },
  {
    slug: 'termodinamica',
    summary:
      'Trata de calor, temperatura e as transformações de energia térmica, incluindo dilatação dos materiais e as leis da termodinâmica.',
    keyPoints: [
      'Calor específico determina quanta energia é necessária para aquecer uma substância.',
      'Dilatação térmica: sólidos, líquidos e gases se expandem com o aumento de temperatura.',
      'Condução, convecção e irradiação são as três formas de propagação de calor.',
      'A 1ª Lei da Termodinâmica diz que energia não se cria nem se destrói, apenas se transforma.',
    ],
    commonTraps: [
      'Confundir calor (energia em trânsito) com temperatura (medida de agitação das partículas).',
      'Trocar condução (sólidos) com convecção (fluidos) na hora de identificar o processo.',
    ],
    studyTip:
      'Relacione sempre a teoria a situações do cotidiano citadas no ENEM: geladeira, garrafa térmica, dilatação de trilhos de trem — isso facilita memorizar os conceitos.',
  },
  {
    slug: 'ondulatoria-optica',
    summary:
      'Estuda ondas (som, luz), suas propriedades (frequência, comprimento de onda) e fenômenos como reflexão, refração e interferência.',
    keyPoints: [
      'Velocidade da onda = frequência × comprimento de onda (v = f×λ).',
      'Reflexão: a onda volta ao meio de origem; refração: muda de meio e de velocidade.',
      'Espelhos planos formam imagem virtual, do mesmo tamanho do objeto.',
      'Lentes convergentes podem formar imagens reais ou virtuais dependendo da posição do objeto.',
    ],
    commonTraps: [
      'Confundir reflexão com refração ao descrever um fenômeno óptico.',
      'Não relacionar corretamente o comprimento de onda com a cor da luz visível.',
    ],
    studyTip:
      'Questões de óptica do ENEM costumam usar situações do dia a dia, como óculos, espelhos retrovisores e arco-íris — associe a teoria a esses exemplos.',
  },
  {
    slug: 'eletricidade-magnetismo',
    summary:
      'Aborda corrente elétrica, tensão, resistência, circuitos elétricos e campos elétricos e magnéticos — muito ligado a consumo de energia no cotidiano.',
    keyPoints: [
      'Lei de Ohm: U = R×i (tensão = resistência × corrente).',
      'Potência elétrica: P = U×i; energia consumida = P×tempo.',
      'Em circuitos em série, a corrente é a mesma; em paralelo, a tensão é a mesma.',
      'Campo magnético é gerado por cargas em movimento (corrente elétrica).',
    ],
    commonTraps: [
      'Confundir a fórmula de circuito em série com a de paralelo ao somar resistências.',
      'Não converter corretamente unidades de potência (W) e energia (kWh) em questões de conta de luz.',
    ],
    studyTip:
      'O ENEM adora questões sobre consumo de energia elétrica doméstica (conta de luz) — pratique esse tipo de conta com potência em watts e tempo em horas.',
  },
  {
    slug: 'quimica-geral',
    summary:
      'Base da Química: estrutura atômica, tabela periódica, ligações químicas, mol e soluções — fundamento para entender as demais áreas da disciplina.',
    keyPoints: [
      'A tabela periódica organiza elementos por número atômico e propriedades semelhantes em colunas (famílias).',
      'Ligação iônica ocorre entre metal e não metal; covalente, entre não metais.',
      '1 mol de qualquer substância contém 6,02×10²³ partículas (número de Avogadro).',
      'pH mede acidez/basicidade: pH<7 ácido, pH=7 neutro, pH>7 básico.',
    ],
    commonTraps: [
      'Confundir ligação iônica com covalente ao analisar os elementos envolvidos.',
      'Errar cálculos de concentração de solução por não converter unidades (g/L, mol/L) corretamente.',
    ],
    studyTip:
      'Entenda a lógica da tabela periódica (não precisa decorar tudo) — muitas questões do ENEM podem ser resolvidas só sabendo a posição do elemento nela.',
  },
  {
    slug: 'quimica-organica',
    summary:
      'Estuda compostos de carbono: hidrocarbonetos, álcoois, ácidos e suas aplicações em combustíveis, plásticos e materiais do cotidiano.',
    keyPoints: [
      'O carbono pode formar até 4 ligações, permitindo cadeias longas e ramificadas.',
      'Funções orgânicas mais cobradas: álcoois, ácidos carboxílicos, ésteres e aminas.',
      'Petróleo é fonte de diversos hidrocarbonetos usados como combustíveis e matéria-prima de plásticos.',
      'Polímeros são moléculas grandes formadas pela repetição de unidades menores (monômeros).',
    ],
    commonTraps: [
      'Confundir as terminações dos nomes das funções orgânicas (ex: -ol de álcool com -al de aldeído).',
      'Não reconhecer o grupo funcional em uma fórmula estrutural desenhada.',
    ],
    studyTip:
      'Foque em reconhecer visualmente os grupos funcionais mais comuns nas fórmulas — o ENEM raramente pede nomenclatura complexa, mas sempre pede reconhecimento de função e aplicação prática.',
  },
  {
    slug: 'fisico-quimica',
    summary:
      'Une conceitos de física e química: velocidade das reações (cinética), equilíbrio químico, eletroquímica (pilhas e baterias) e energia envolvida nas reações.',
    keyPoints: [
      'Reações exotérmicas liberam calor; endotérmicas absorvem calor.',
      'Catalisadores aumentam a velocidade de uma reação sem serem consumidos.',
      'Pilhas convertem energia química em elétrica através de reações de oxirredução.',
      'No equilíbrio químico, as velocidades das reações direta e inversa se igualam.',
    ],
    commonTraps: [
      'Confundir oxidação (perda de elétrons) com redução (ganho de elétrons).',
      'Achar que catalisador desloca o equilíbrio químico — ele só acelera o processo, não muda o resultado final.',
    ],
    studyTip:
      'Associe pilhas e baterias a exemplos reais (celular, carro elétrico) — o ENEM gosta de contextualizar eletroquímica com tecnologia do dia a dia.',
  },
  {
    slug: 'biologia-celular-genetica',
    summary:
      'Trata da estrutura da célula, DNA, RNA, divisão celular (mitose e meiose) e as leis da hereditariedade de Mendel.',
    keyPoints: [
      'DNA carrega a informação genética; RNA participa da síntese de proteínas.',
      'Mitose gera duas células idênticas (crescimento/reparo); meiose gera células reprodutivas com metade dos cromossomos.',
      'As leis de Mendel explicam como características são herdadas dos pais através de genes dominantes e recessivos.',
      'Mutações são alterações no material genético que podem ser neutras, prejudiciais ou vantajosas.',
    ],
    commonTraps: [
      'Confundir mitose com meiose quanto ao número de células e cromossomos gerados.',
      'Errar cruzamentos genéticos (quadro de Punnett) por trocar alelo dominante com recessivo.',
    ],
    studyTip:
      'Pratique montar quadros de Punnett simples — é a ferramenta mais usada nas questões de genética do ENEM.',
  },
  {
    slug: 'ecologia-meio-ambiente',
    summary:
      'Estuda as relações entre seres vivos e o ambiente: cadeias alimentares, biomas, biodiversidade e problemas ambientais como aquecimento global.',
    keyPoints: [
      'Cadeia alimentar mostra o fluxo de energia entre produtores, consumidores e decompositores.',
      'Bioma é um conjunto de ecossistemas com clima, solo e vegetação semelhantes (ex: Cerrado, Amazônia).',
      'O efeito estufa é natural, mas sua intensificação pela ação humana causa o aquecimento global.',
      'A seleção natural favorece indivíduos mais adaptados ao ambiente, e é a base da evolução das espécies.',
    ],
    commonTraps: [
      'Confundir bioma com ecossistema (bioma é mais amplo, engloba vários ecossistemas).',
      'Achar que o efeito estufa é sempre algo ruim — o problema é sua intensificação, não sua existência.',
    ],
    studyTip:
      'O ENEM adora ligar ecologia a temas atuais (mudanças climáticas, desmatamento) — acompanhe notícias ambientais recentes para contextualizar melhor as questões.',
  },
  {
    slug: 'fisiologia-humana',
    summary:
      'Aborda o funcionamento dos sistemas do corpo humano: nervoso, circulatório, respiratório, digestório e imunológico.',
    keyPoints: [
      'O sistema circulatório transporta oxigênio e nutrientes através do sangue, bombeado pelo coração.',
      'O sistema imunológico produz anticorpos para combater agentes invasores (vírus, bactérias).',
      'Vacinas estimulam o corpo a criar defesa (anticorpos) sem causar a doença.',
      'Enzimas aceleram reações químicas do corpo, como as da digestão.',
    ],
    commonTraps: [
      'Confundir artérias (levam sangue do coração) com veias (trazem sangue de volta ao coração).',
      'Não diferenciar imunidade ativa (vacina) de passiva (soro/anticorpos prontos).',
    ],
    studyTip:
      'Questões de fisiologia costumam vir com textos sobre saúde pública e doenças — treine interpretação de texto em conjunto com o conteúdo biológico.',
  },

  // CIÊNCIAS HUMANAS
  {
    slug: 'historia-brasil',
    summary:
      'Cobre desde o período colonial até a redemocratização: colonização, escravidão, independência, república, Era Vargas e ditadura militar.',
    keyPoints: [
      'Período colonial: economia baseada em monoculturas de exportação e trabalho escravo.',
      'A independência (1822) não rompeu totalmente as estruturas sociais e econômicas herdadas da colônia.',
      'Era Vargas (1930-1945/1951-1954) trouxe leis trabalhistas e forte intervenção do Estado na economia.',
      "Ditadura Militar (1964-1985): repressão política, censura e, ao mesmo tempo, crescimento econômico ('milagre econômico').",
    ],
    commonTraps: [
      'Achar que a abolição da escravidão (1888) resolveu as desigualdades sociais criadas por séculos de escravidão.',
      'Confundir os diferentes períodos da Era Vargas (Governo Provisório, Constitucional, Estado Novo).',
    ],
    studyTip:
      'O ENEM cobra menos datas decoradas e mais a compreensão de causas e consequências dos processos históricos — foque em entender "por quê" os eventos aconteceram.',
  },
  {
    slug: 'historia-geral',
    summary:
      'Aborda processos históricos mundiais: Iluminismo, Revolução Industrial, guerras mundiais, Guerra Fria e formação do capitalismo.',
    keyPoints: [
      'O Iluminismo defendia razão, liberdade e direitos individuais, influenciando revoluções como a Francesa.',
      'A Revolução Industrial mudou os modos de produção, criando a classe operária e o capitalismo industrial.',
      'A Guerra Fria (1945-1991) foi uma disputa ideológica entre EUA (capitalismo) e URSS (socialismo).',
      'As duas Guerras Mundiais redesenharam fronteiras e equilíbrios de poder global.',
    ],
    commonTraps: [
      'Confundir as causas da Primeira Guerra Mundial com as da Segunda.',
      'Achar que a Guerra Fria envolveu confronto militar direto entre EUA e URSS (foi majoritariamente indireto, por meio de conflitos regionais).',
    ],
    studyTip:
      'Relacione sempre os eventos históricos mundiais com seus impactos até os dias de hoje — o ENEM gosta de conectar passado e presente em textos de apoio.',
  },
  {
    slug: 'geografia-fisica',
    summary:
      'Estuda os elementos naturais do planeta: clima, relevo, hidrografia, solos e vegetação, incluindo temas ambientais atuais.',
    keyPoints: [
      'O Brasil tem predominância de clima tropical, com variações regionais (semiárido, equatorial, subtropical).',
      'Bacias hidrográficas são áreas de drenagem de um rio principal e seus afluentes.',
      'A erosão do solo é intensificada por desmatamento e uso inadequado da terra.',
      'O aquecimento global altera padrões climáticos e eleva o nível do mar.',
    ],
    commonTraps: [
      'Confundir clima (padrão de longo prazo) com tempo (condição momentânea).',
      'Não relacionar corretamente relevo e clima de uma região com sua vegetação predominante.',
    ],
    studyTip:
      'Estude mapas do Brasil e do mundo com atenção — o ENEM frequentemente apresenta um mapa e pede para relacionar clima, relevo ou vegetação da área destacada.',
  },
  {
    slug: 'geografia-humana',
    summary:
      'Analisa a relação da sociedade com o espaço: urbanização, migrações, industrialização, desigualdade social e globalização.',
    keyPoints: [
      'A urbanização acelerada no Brasil gerou problemas como favelização e déficit de infraestrutura.',
      'A globalização intensifica fluxos de mercadorias, informação e pessoas entre países.',
      'Êxodo rural é a migração do campo para a cidade em busca de melhores condições de vida.',
      'A desigualdade social pode ser medida por indicadores como o índice de Gini e o IDH.',
    ],
    commonTraps: [
      'Achar que a globalização beneficia igualmente todos os países e classes sociais.',
      'Confundir migração (movimento entre países ou regiões) com mobilidade urbana (movimento dentro da cidade).',
    ],
    studyTip:
      'Fique atento a dados socioeconômicos (gráficos de IDH, PIB, população) — o ENEM usa muito esse tipo de gráfico para testar interpretação em Geografia Humana.',
  },
  {
    slug: 'filosofia',
    summary:
      'Trabalha correntes de pensamento sobre ética, política e conhecimento, desde os filósofos gregos até pensadores modernos.',
    keyPoints: [
      'Sócrates, Platão e Aristóteles são a base da filosofia ocidental clássica.',
      'Ética estuda o que é certo ou errado nas ações humanas; moral são as normas de uma sociedade específica.',
      'Kant defendia que a razão deveria guiar as ações morais, independentemente das consequências.',
      'Filósofos contemporâneos (como Nietzsche) questionaram valores tradicionais e verdades absolutas.',
    ],
    commonTraps: [
      'Confundir ética com moral, tratando-as como sinônimos absolutos.',
      'Atribuir uma ideia filosófica ao autor errado por não reconhecer o estilo de argumentação no texto.',
    ],
    studyTip:
      'Leia o texto de apoio da questão com atenção total — geralmente ele já traz pistas claras sobre qual conceito filosófico está sendo cobrado, sem precisar decorar biografias inteiras.',
  },
  {
    slug: 'sociologia',
    summary:
      'Analisa a organização da sociedade: classes sociais, cultura, cidadania, trabalho e movimentos sociais, com base em autores como Marx, Weber e Durkheim.',
    keyPoints: [
      'Marx analisa a sociedade a partir da luta de classes entre burguesia e proletariado.',
      'Weber destaca a importância da ação social e do sentido que os indivíduos dão às suas ações.',
      'Durkheim estuda os fatos sociais como forças externas que moldam o comportamento coletivo.',
      'Movimentos sociais surgem para reivindicar direitos e mudanças na estrutura social.',
    ],
    commonTraps: [
      'Misturar os conceitos centrais dos três autores clássicos (Marx, Weber, Durkheim).',
      'Achar que cidadania se resume ao direito de votar, ignorando direitos civis e sociais.',
    ],
    studyTip:
      'Associe cada autor clássico a uma palavra-chave (Marx = classes/capital; Weber = ação social; Durkheim = fato social) para não confundi-los na hora da prova.',
  },

  // LINGUAGENS
  {
    slug: 'interpretacao-textual',
    summary:
      'É a habilidade mais cobrada do ENEM: compreender o sentido de um texto, identificar argumentos, inferências e a intenção do autor.',
    keyPoints: [
      'Identifique o gênero textual (notícia, crônica, editorial, charge) — isso já indica a intenção do texto.',
      'Inferência é concluir algo que não está escrito explicitamente, mas pode ser deduzido do texto.',
      'Ironia e humor muitas vezes invertem o sentido literal das palavras.',
      'O tema central geralmente aparece no título ou nas primeiras/últimas linhas do texto.',
    ],
    commonTraps: [
      "Escolher uma alternativa que parece 'verdadeira no mundo real', mas que não é sustentada pelo texto.",
      'Confundir a opinião do autor com a opinião de um personagem ou fonte citada no texto.',
    ],
    studyTip:
      'Releia sempre o trecho do texto relacionado à pergunta antes de responder — a resposta certa deve estar sustentada pelo texto, nunca pelo seu conhecimento prévio isolado.',
  },
  {
    slug: 'linguistica-variacao',
    summary:
      'Estuda a gramática, a variação linguística (formal x informal, regional) e os mecanismos de coesão e coerência textual.',
    keyPoints: [
      'A norma culta é a variedade formal da língua, mas o ENEM valoriza reconhecer as demais variações como legítimas.',
      'Coesão são os elementos que conectam as partes do texto (conectivos, pronomes); coerência é a lógica geral do texto.',
      'Concordância verbal e nominal seguem a relação entre sujeito/substantivo e verbo/adjetivo.',
      'Figuras de linguagem (metáfora, metonímia, hipérbole) alteram o sentido literal das palavras.',
    ],
    commonTraps: [
      "Achar que variação linguística informal está 'errada' — o ENEM trata isso como diversidade, não erro.",
      'Confundir coesão (ligação entre frases) com coerência (sentido lógico do texto como um todo).',
    ],
    studyTip:
      'Preste atenção ao contexto de uso da linguagem (quem fala, para quem, em que situação) — isso é mais cobrado do que regras gramaticais isoladas.',
  },
  {
    slug: 'literatura-brasileira',
    summary:
      'Percorre os movimentos literários brasileiros (Romantismo, Realismo, Modernismo) e seus principais autores e obras.',
    keyPoints: [
      'Romantismo valoriza a emoção, o nacionalismo e o idealismo (ex: José de Alencar).',
      'Realismo critica a sociedade de forma objetiva, sem idealizações (ex: Machado de Assis).',
      'Modernismo (a partir de 1922) rompe com padrões tradicionais e valoriza a identidade brasileira (ex: Drummond, Mário de Andrade).',
      'Cada movimento literário reflete o contexto histórico e social de sua época.',
    ],
    commonTraps: [
      'Atribuir uma obra ou característica ao movimento literário errado.',
      'Analisar um poema apenas pela forma, sem relacionar ao contexto histórico do movimento.',
    ],
    studyTip:
      'Relacione cada movimento literário a um contexto histórico (Romantismo = formação da identidade nacional pós-independência; Modernismo = Semana de 22 e industrialização) — isso ajuda a não confundir os períodos.',
  },
  {
    slug: 'artes-cultura',
    summary:
      'Aborda manifestações artísticas e culturais: pintura, música, dança, teatro, cinema e patrimônio cultural, incluindo cultura popular brasileira.',
    keyPoints: [
      'Movimentos artísticos (como o modernismo nas artes plásticas) refletem contextos sociais e políticos.',
      'Patrimônio cultural pode ser material (edifícios, objetos) ou imaterial (festas, saberes, línguas).',
      'A cultura popular brasileira tem forte influência indígena, africana e europeia.',
      'A Semana de Arte Moderna de 1922 é um marco na renovação artística e cultural do Brasil.',
    ],
    commonTraps: [
      "Reduzir cultura popular a 'folclore', desconsiderando sua relevância histórica e social.",
      'Confundir patrimônio material com imaterial.',
    ],
    studyTip:
      'Fique atento a imagens de obras de arte nas questões — o ENEM costuma pedir para relacionar a imagem a um contexto histórico ou social, não uma análise técnica de arte.',
  },
  {
    slug: 'lingua-estrangeira',
    summary:
      'Testa a compreensão de textos em inglês ou espanhol (à escolha do candidato), focando em interpretação, vocabulário e contexto, sem exigir tradução literal.',
    keyPoints: [
      'Não é necessário traduzir palavra por palavra — busque entender a ideia geral do texto (skimming).',
      'Cognatos (palavras parecidas com o português) ajudam bastante na compreensão rápida do texto.',
      'Preste atenção a títulos, imagens e fontes do texto — eles dão contexto essencial antes mesmo da leitura.',
      "Falsos cognatos (palavras parecidas mas com significado diferente) podem confundir: ex. 'pretend' em inglês significa 'fingir', não 'pretender'.",
    ],
    commonTraps: [
      'Tentar traduzir cada palavra, perdendo tempo e o sentido geral do texto.',
      'Cair em falsos cognatos e assumir um significado errado.',
    ],
    studyTip:
      'Treine leitura rápida (skimming) de textos curtos em inglês/espanhol — o objetivo do ENEM é avaliar compreensão geral, não conhecimento gramatical profundo.',
  },
];
