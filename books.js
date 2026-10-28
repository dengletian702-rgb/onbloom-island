/* 花屿 · 书架。每本书一张卡；分商业、AI、艺术三部分，每部分按主题分层。
   开站书单来自 Sage；每部分最后一层是花屿补充的五本。链接都在 2026-10-28 核对过。
   access：free 全文免费 · sample 官方样章 · review 只有书评（需要买书或去图书馆借）。 */
window.HUAYU_BOOKS = {
  checked: '2026-10-28',
  parts: [
    { id: 'business', name: '商业', lead: '怎么带团队、怎么判断、怎么卖、怎么把话写清楚。',
      shelves: ['管理与协作', '分析与决策', '营销', '写作与法律', '财商', '花屿补充'] },
    { id: 'ai', name: 'AI', lead: '从原理到工程，弄懂每天在用的东西。',
      shelves: ['工程与质量', '花屿补充'] },
    { id: 'art', name: '艺术', lead: '看见、设计、创作。',
      shelves: ['产品与设计', '创意', '花屿补充'] }
  ],
  // Shelves still waiting for a list. Shown as an empty slot rather than guessed.
  pending: { '财商': '这一层用 Ledger 的书单，书单到了就上架。' },
  featured: ['sre', 'pomkt', 'pom', 'eos', 'a11y', 'shapeup', 'gettingreal', 'd2l'],
  books: [
    // 商业 · 管理与协作
    { id: 'hom', part: 'business', shelf: '管理与协作', title: 'High Output Management', zh: '格鲁夫给经理人的第一课', author: 'Andrew S. Grove', year: '1983',
      why: '英特尔前 CEO 把管理当成生产来算：经理的产出，就是他带的团队的产出。开会、一对一、授权，都按这个标准判断。',
      access: 'review', href: 'https://www.penguinrandomhouse.com/books/72467/high-output-management-by-andrew-s-grove-former-chairman-and-ceo-of-intel/', linkLabel: '出版社页面' },
    { id: 'tis', part: 'business', shelf: '管理与协作', title: 'Thinking in Systems', zh: '系统之美', author: 'Donella H. Meadows', year: '2008',
      why: '用存量、流量和反馈回路看问题，明白为什么“头痛医头”常常让事情更糟。',
      access: 'review', href: 'https://donellameadows.org/systems-thinking-book-sale/', linkLabel: '作者基金会页面' },
    { id: 'pom', part: 'business', shelf: '管理与协作', title: 'Principles of Management', author: 'OpenStax 编写团队（David S. Bright 等）', year: '2019',
      why: '一本完整的管理学入门教材：计划、组织、领导、控制，每章都配了案例。',
      access: 'free', href: 'https://openstax.org/details/books/principles-management', linkLabel: 'OpenStax 免费在线读' },
    // 商业 · 分析与决策
    { id: 'htma', part: 'business', shelf: '分析与决策', title: 'How to Measure Anything', zh: '数据化决策', author: 'Douglas W. Hubbard', year: '2007',
      why: '再模糊的东西也能测。先问“这个数字会改变哪个决定”，再用最少的数据缩小不确定。',
      access: 'review', href: 'https://www.howtomeasureanything.com/', linkLabel: '作者官网' },
    { id: 'pyramid', part: 'business', shelf: '分析与决策', title: 'The Pyramid Principle', zh: '金字塔原理', author: 'Barbara Minto', year: '1987',
      why: '先说结论，再分层给理由。麦肯锡几十年来教新人写报告，用的就是这一套。',
      access: 'review', href: 'https://www.barbaraminto.com/', linkLabel: '作者官网' },
    { id: 'cia', part: 'business', shelf: '分析与决策', title: 'A Tradecraft Primer: Structured Analytic Techniques', author: '美国中央情报局', year: '2009',
      why: '四十多页的免费手册，教你用“竞争性假设”“唱反调”等方法，防止自己只看见想看的证据。',
      access: 'free', href: 'https://www.cia.gov/resources/csi/static/Tradecraft-Primer-apr09.pdf', linkLabel: 'PDF 全文' },
    // 商业 · 营销
    { id: 'oa', part: 'business', shelf: '营销', title: 'Obviously Awesome', author: 'April Dunford', year: '2019',
      why: '定位不是想口号，而是想清楚“和谁比、凭什么赢、卖给谁”。书里给了一套能照着做的步骤。',
      access: 'review', href: 'https://www.aprildunford.com/books', linkLabel: '作者官网' },
    { id: 'pomkt', part: 'business', shelf: '营销', title: 'Principles of Marketing', author: 'OpenStax 编写团队', year: '2023',
      why: '免费的营销学教材：市场调研、消费者行为、品牌、渠道、数字营销，一本讲全。',
      access: 'free', href: 'https://openstax.org/details/books/principles-marketing', linkLabel: 'OpenStax 免费在线读' },
    // 商业 · 写作与法律
    { id: 'eos', part: 'business', shelf: '写作与法律', title: 'The Elements of Style', zh: '风格的要素', author: 'William Strunk Jr.', year: '1918',
      why: '薄薄一本英文写作守则，最有名的一句是：删掉不必要的词。',
      access: 'free', href: 'https://www.gutenberg.org/ebooks/37134', linkLabel: '古腾堡计划全文' },
    { id: 'lwpe', part: 'business', shelf: '写作与法律', title: 'Legal Writing in Plain English', author: 'Bryan A. Garner', year: '2001',
      why: '教律师把条款写得让普通人也看得懂。写合同、写规则、写说明的人都用得上。',
      access: 'review', href: 'https://openlibrary.org/books/OL39950463M', linkLabel: 'Open Library 书目（第三版）' },
    // 商业 · 花屿补充
    { id: 'gsbs', part: 'business', shelf: '花屿补充', title: 'Good Strategy Bad Strategy', zh: '好战略，坏战略', author: 'Richard P. Rumelt', year: '2011',
      why: '好战略有三部分：诊断、指导方针、连贯的行动。口号和一串目标不是战略。',
      access: 'review', href: 'https://www.penguinrandomhouse.com/books/208668/good-strategy-bad-strategy-by-richard-rumelt/', linkLabel: '出版社页面' },
    { id: 'lean', part: 'business', shelf: '花屿补充', title: 'The Lean Startup', zh: '精益创业', author: 'Eric Ries', year: '2011',
      why: '先做一个最小的可用版本，看用户的真实反应，再决定坚持还是换方向。',
      access: 'review', href: 'https://theleanstartup.com/book', linkLabel: '官方页面' },
    { id: 'chasm', part: 'business', shelf: '花屿补充', title: 'Crossing the Chasm', zh: '跨越鸿沟', author: 'Geoffrey A. Moore', year: '1991',
      why: '新产品从尝鲜的人走向大众，中间有一道鸿沟。办法是先拿下一个小而具体的市场。',
      access: 'review', href: 'https://www.harpercollins.com/products/crossing-the-chasm-3rd-edition-geoffrey-a-moore', linkLabel: '出版社页面' },
    { id: 'influence', part: 'business', shelf: '花屿补充', title: 'Influence', zh: '影响力', author: 'Robert B. Cialdini', year: '1984',
      why: '互惠、承诺、社会认同、喜好、权威、稀缺：人为什么会说“好”。做营销要懂，也要守住分寸。',
      access: 'review', href: 'https://www.influenceatwork.com/books-and-publications/', linkLabel: '作者机构页面' },
    { id: 'gettingreal', part: 'business', shelf: '花屿补充', title: 'Getting Real', author: '37signals', year: '2006',
      why: '小团队做产品的短文集：少做功能，先做界面，别写长长的需求文档。',
      access: 'free', href: 'https://basecamp.com/gettingreal', linkLabel: '官方免费在线读' },
    // AI · 工程与质量
    { id: 'sre', part: 'ai', shelf: '工程与质量', title: 'Site Reliability Engineering', zh: 'SRE：Google 运维解密', author: 'Betsy Beyer、Chris Jones、Jennifer Petoff、Niall Richard Murphy 编', year: '2016',
      why: '谷歌怎样让巨大的系统一直在线：错误预算、事故复盘、减少重复劳动。',
      access: 'free', href: 'https://sre.google/sre-book/table-of-contents/', linkLabel: '谷歌官方免费在线读' },
    { id: 'a11y', part: 'ai', shelf: '工程与质量', title: 'Accessibility for Everyone', author: 'Laura Kalbag', year: '2017',
      why: '让看不见、听不见、用不了鼠标的人也能用你的网站。作者已经把全书免费放到网上。',
      access: 'free', href: 'https://accessibilityforeveryone.site/', linkLabel: '作者官方免费在线读' },
    { id: 'exploreit', part: 'ai', shelf: '工程与质量', title: 'Explore It!', zh: '探索吧！', author: 'Elisabeth Hendrickson', year: '2013',
      why: '探索式测试：不照着脚本点，而是带着问题去试，找出没人想到的毛病。检查 AI 的输出也用得上。',
      access: 'sample', href: 'https://pragprog.com/titles/ehxta/explore-it/', linkLabel: '出版社页面（三章免费节选）' },
    // AI · 花屿补充
    { id: 'd2l', part: 'ai', shelf: '花屿补充', title: 'Dive into Deep Learning', zh: '动手学深度学习', author: 'Aston Zhang、Zachary C. Lipton、Mu Li、Alexander J. Smola', year: '2023',
      why: '边读边跑代码的深度学习教材，有官方中文版，全书免费。',
      access: 'free', href: 'https://zh.d2l.ai/', linkLabel: '官方中文版免费在线读' },
    { id: 'udl', part: 'ai', shelf: '花屿补充', title: 'Understanding Deep Learning', author: 'Simon J. D. Prince', year: '2023',
      why: '图多、推导清楚，从基础一路讲到 Transformer 和扩散模型。作者提供免费 PDF。',
      access: 'free', href: 'https://udlbook.github.io/udlbook/', linkLabel: '作者官方免费 PDF' },
    { id: 'slp', part: 'ai', shelf: '花屿补充', title: 'Speech and Language Processing', zh: '自然语言处理综论', author: 'Daniel Jurafsky、James H. Martin', year: '第 3 版草稿',
      why: '自然语言处理的经典教材。新版草稿加进了大语言模型的章节，作者免费放出。',
      access: 'free', href: 'https://web.stanford.edu/~jurafsky/slp3/', linkLabel: '作者官方免费草稿' },
    { id: 'coi', part: 'ai', shelf: '花屿补充', title: 'Co-Intelligence', author: 'Ethan Mollick', year: '2024',
      why: '沃顿商学院教授写给普通人的 AI 使用指南：把 AI 当成同事，边用边摸清它的边界。',
      access: 'review', href: 'https://www.penguinrandomhouse.com/books/741805/co-intelligence-by-ethan-mollick/', linkLabel: '出版社页面' },
    { id: 'align', part: 'ai', shelf: '花屿补充', title: 'The Alignment Problem', zh: '人机对齐', author: 'Brian Christian', year: '2020',
      why: '“让机器做我们真正想要的事”为什么这么难：从数据偏见讲到奖励设计。',
      access: 'review', href: 'https://brianchristian.org/the-alignment-problem/', linkLabel: '作者官网' },
    // 艺术 · 产品与设计
    { id: 'doet', part: 'art', shelf: '产品与设计', title: 'The Design of Everyday Things', zh: '设计心理学', author: 'Don Norman', year: '1988（2013 修订）',
      why: '门推不开不怪你，是设计没说清楚。可供性、反馈、心智模型，做任何东西都用得上。',
      access: 'review', href: 'https://www.hachettebookgroup.com/titles/don-norman/the-design-of-everyday-things/9780465050659/', linkLabel: '出版社页面' },
    { id: 'cdh', part: 'art', shelf: '产品与设计', title: 'Continuous Discovery Habits', author: 'Teresa Torres', year: '2021',
      why: '每周和用户聊一次，用“机会解决方案树”把听到的问题变成要试的方案。',
      access: 'review', href: 'https://www.producttalk.org/continuous-discovery-habits/', linkLabel: '作者官网' },
    { id: 'momtest', part: 'art', shelf: '产品与设计', title: 'The Mom Test', author: 'Rob Fitzpatrick', year: '2013',
      why: '怎样问用户才不会被客气话骗：问他过去做过什么，别问“你会不会买”。',
      access: 'review', href: 'https://www.momtestbook.com/', linkLabel: '官方页面' },
    { id: 'ptypo', part: 'art', shelf: '产品与设计', title: 'Practical Typography', author: 'Matthew Butterick', year: '2013',
      why: '写给所有写字的人的排版书：字号、行距、每行多长。网页版免费读，作者请读者自愿付费。',
      access: 'free', href: 'https://practicaltypography.com/', linkLabel: '作者官方免费在线读' },
    { id: 'shapeup', part: 'art', shelf: '产品与设计', title: 'Shape Up', author: 'Ryan Singer', year: '2019',
      why: 'Basecamp 的做事方法：先定愿意花多少时间，再把方案塑形，六周一个周期，做完就停。',
      access: 'free', href: 'https://basecamp.com/shapeup', linkLabel: '官方免费在线读' },
    // 艺术 · 创意
    { id: 'tpi', part: 'art', shelf: '创意', title: 'A Technique for Producing Ideas', author: 'James Webb Young', year: '1940',
      why: '一位广告人写的创意五步法：收集材料、消化、放下、灵感出现、打磨落地。一个小时就能读完。',
      access: 'review', href: 'https://openlibrary.org/books/OL7299660M', linkLabel: 'Open Library 书目', note: '没找到合法的免费全文，网上流传的 PDF 来路不明，我们不放。' },
    { id: 'wgicf', part: 'art', shelf: '创意', title: 'Where Good Ideas Come From', zh: '伟大创意的诞生', author: 'Steven Johnson', year: '2010',
      why: '好点子很少是灵光一闪，多半来自慢慢酝酿的直觉，和别人想法的碰撞。',
      access: 'review', href: 'https://openlibrary.org/books/OL24369699M', linkLabel: 'Open Library 书目' },
    // 艺术 · 花屿补充
    { id: 'uc', part: 'art', shelf: '花屿补充', title: 'Understanding Comics', zh: '理解漫画', author: 'Scott McCloud', year: '1993',
      why: '用漫画讲漫画：格子之间的空白，怎样让读者自己补上故事。花屿画漫画前先读的一本。',
      access: 'review', href: 'https://www.scottmccloud.com/2-print/1-uc/', linkLabel: '作者官网' },
    { id: 'wos', part: 'art', shelf: '花屿补充', title: 'Ways of Seeing', zh: '观看之道', author: 'John Berger', year: '1972',
      why: '我们怎么看一幅画，取决于我们知道什么、相信什么。广告也一直在教我们怎么看。',
      access: 'review', href: 'https://www.penguin.co.uk/books/56465/ways-of-seeing-by-berger-john/9780141035796', linkLabel: '出版社页面' },
    { id: 'ioc', part: 'art', shelf: '花屿补充', title: 'Interaction of Color', author: 'Josef Albers', year: '1963',
      why: '同一块颜色，放在不同的颜色旁边，看起来就不一样。包豪斯老师的色彩练习课。',
      access: 'review', href: 'https://yalebooks.yale.edu/book/9780300179354/interaction-of-color/', linkLabel: '出版社页面' },
    { id: 'slaa', part: 'art', shelf: '花屿补充', title: 'Steal Like an Artist', author: 'Austin Kleon', year: '2012',
      why: '十条给创作者的建议：从喜欢的作品里学，把各种影响混合成自己的东西。',
      access: 'review', href: 'https://austinkleon.com/steal/', linkLabel: '作者官网' },
    { id: 'csa', part: 'art', shelf: '花屿补充', title: 'Concerning the Spiritual in Art', zh: '艺术中的精神', author: 'Wassily Kandinsky', year: '1911',
      why: '康定斯基讲颜色和形状怎样直接打动人，是抽象绘画的起点之一。',
      access: 'free', href: 'https://www.gutenberg.org/ebooks/5321', linkLabel: '古腾堡计划全文' }
  ],
  // Each person keeps one slot. Statuses are only ever what they reported; nothing is filled in for them.
  people: [
    { id: 'letian', name: '乐天', role: '岛主 · 选方向、定书单', reading: [], done: [] },
    { id: 'james', name: 'James', role: '调度助手（Grok）· 派书单和任务', reading: [], done: [] },
    { id: 'sage', name: 'Sage', role: '助手 · 开站书单', reading: [], done: [] },
    { id: 'ledger', name: 'Ledger', role: '助手 · 财商书单', reading: [], done: [] },
    { id: 'claude', name: 'Claude Code', role: '助手 · 写导读、做卡片', reading: [], done: ['shapeup'] },
    { id: 'codex', name: 'Codex', role: '助手 · 画插图', reading: [], done: [] }
  ],
  // Our own notes on a book. Only Shape Up has them so far; every other card says “待做”.
  notes: {
    shapeup: {
      by: '花屿导读 · 初稿，Claude Code 整理，待人工校对',
      analysis: [
        'Shape Up 是 Basecamp 公司公开的一套产品开发方法，作者 Ryan Singer 是那里的产品负责人。它回答的问题是：一个小团队，怎样既不陷进没完没了的待办清单，又能按时交出完整的东西。',
        '核心是三步。第一步“塑形”：由有经验的人先把要做的事想到合适的粗细程度，定下“胃口”，也就是愿意为它花多少时间，而不是先估要花多久；再画出粗线条的方案，找出可能掉进去的“兔子洞”，写成一份提案。第二步“下注”：每个周期开始前，决定这次押哪几份提案，没被选中的不进待办池，想做就下次重新提。第三步“动手”：把整块工作交给一个小团队，让他们自己拆任务，六周内做完；做不完默认不延期，这叫“断路器”。每个六周之后留两周冷却期，修修补补、想下一步。',
        '它最值得学的是“胃口”这个想法：先定时间，再在时间里决定做多少，而不是先定功能再拼命赶。对内容团队同样适用。'
      ],
      map: [
        ['塑形', ['定胃口：先定愿意花多少时间', '粗线条方案：面包板图、粗马克笔草图', '找兔子洞：提前排掉会拖垮项目的坑', '写提案：问题、胃口、方案、兔子洞、不做什么']],
        ['下注', ['六周一个周期，之后两周冷却', '下注桌：周期开始前决定押哪几份提案', '不留待办池：没选中的下次重新提', '断路器：做不完默认不延期']],
        ['动手', ['整块工作交给小团队，不拆成任务派', '团队自己发现和拆分任务', '按“范围”组织工作，而不是按人或岗位', '山形图：上坡是想清楚，下坡是做出来']]
      ],
      cards: [
        ['“胃口”和“估时”有什么区别？', '估时是先定做什么，再问要多久；胃口是先定愿意花多久，再决定在这段时间里做到什么程度。'],
        ['为什么不留待办池？', '待办池越积越长，只会制造焦虑和假承诺。没被选中的提案，真重要的话下个周期还会有人再提。'],
        ['什么是“断路器”？', '一个项目六周内没做完，默认就停下，不自动延期。逼着塑形阶段把范围想清楚，也防止一个项目无限拖下去。'],
        ['山形图的上坡和下坡分别是什么？', '上坡是还在想办法、有未知；下坡是办法已经清楚、只剩执行。卡在上坡太久，说明问题没想透。'],
        ['花屿可以怎么用？', '每期内容先定胃口，比如“漫画两页、一个周期”；画师和写手在这个时间里自己拆活，做完就停，冷却期再复盘。']
      ]
    }
  }
};
