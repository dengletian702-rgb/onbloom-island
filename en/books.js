/* 花屿 · 书架。每本书一张卡；分商业、AI、艺术三部分，每部分按主题分层。
   开站书单来自 Sage；每部分最后一层是花屿补充的五本。链接都在 2026-10-28 核对过。
   access：free 全文免费 · sample 官方样章 · review 只有书评（需要买书或去图书馆借）。 */
window.HUAYU_BOOKS = {
  checked: '2026-10-28',
  parts: [
    { id: 'business', name: 'Business', lead: 'How to lead a team, make judgements, sell, and write clearly.',
      shelves: ['Management and teamwork', 'Analysis and decisions', 'Marketing', 'Writing and law', 'Money sense', 'Onbloom Island picks'] },
    { id: 'ai', name: 'AI', lead: 'From principles to engineering: understand the things you use every day.',
      shelves: ['Engineering and quality', 'Onbloom Island picks'] },
    { id: 'art', name: 'Art', lead: 'Seeing, designing, making.',
      shelves: ['Product and design', 'Creativity', 'Onbloom Island picks'] }
  ],
  // Shelves still waiting for a list. Shown as an empty slot rather than guessed.
  pending: { 'Money sense': 'This shelf will use Ledger\'s reading list; books go up as soon as the list arrives.' },
  featured: ['sre', 'pomkt', 'pom', 'eos', 'a11y', 'shapeup', 'gettingreal', 'd2l'],
  books: [
    // 商业 · 管理与协作
    { id: 'hom', part: 'business', shelf: 'Management and teamwork', title: 'High Output Management', zh: '', author: 'Andrew S. Grove', year: '1983',
      why: 'Intel\'s former CEO treats management as production: a manager\'s output is the output of the team they lead. Meetings, one-on-ones and delegation are all judged by that standard.',
      access: 'review', href: 'https://www.penguinrandomhouse.com/books/72467/high-output-management-by-andrew-s-grove-former-chairman-and-ceo-of-intel/', linkLabel: 'Publisher\'s page' },
    { id: 'tis', part: 'business', shelf: 'Management and teamwork', title: 'Thinking in Systems', zh: '', author: 'Donella H. Meadows', year: '2008',
      why: 'Look at problems through stocks, flows and feedback loops, and see why treating only the symptom often makes things worse.',
      access: 'review', href: 'https://donellameadows.org/systems-thinking-book-sale/', linkLabel: 'Author\'s foundation page' },
    { id: 'pom', part: 'business', shelf: 'Management and teamwork', title: 'Principles of Management', author: 'OpenStax authors (David S. Bright et al.)', year: '2019',
      why: 'A complete introductory management textbook: planning, organising, leading and controlling, with cases in every chapter.',
      access: 'free', href: 'https://openstax.org/details/books/principles-management', linkLabel: 'Free online at OpenStax' },
    // 商业 · 分析与决策
    { id: 'htma', part: 'business', shelf: 'Analysis and decisions', title: 'How to Measure Anything', zh: '', author: 'Douglas W. Hubbard', year: '2007',
      why: 'Even fuzzy things can be measured. First ask which decision the number would change, then use the least data needed to narrow the uncertainty.',
      access: 'review', href: 'https://www.howtomeasureanything.com/', linkLabel: 'Author\'s website' },
    { id: 'pyramid', part: 'business', shelf: 'Analysis and decisions', title: 'The Pyramid Principle', zh: '', author: 'Barbara Minto', year: '1987',
      why: 'Lead with the conclusion, then give the reasons in layers. McKinsey has taught new hires to write reports this way for decades.',
      access: 'review', href: 'https://www.barbaraminto.com/', linkLabel: 'Author\'s website' },
    { id: 'cia', part: 'business', shelf: 'Analysis and decisions', title: 'A Tradecraft Primer: Structured Analytic Techniques', author: 'US Central Intelligence Agency', year: '2009',
      why: 'A free handbook of just over forty pages, teaching methods like “competing hypotheses” and “devil\'s advocacy” so you don\'t only see the evidence you want to see.',
      access: 'free', href: 'https://www.cia.gov/resources/csi/static/Tradecraft-Primer-apr09.pdf', linkLabel: 'Full PDF' },
    // 商业 · 营销
    { id: 'oa', part: 'business', shelf: 'Marketing', title: 'Obviously Awesome', author: 'April Dunford', year: '2019',
      why: 'Positioning isn\'t about slogans; it\'s about getting clear on who you compete with, why you win, and who you sell to. The book gives steps you can actually follow.',
      access: 'review', href: 'https://www.aprildunford.com/books', linkLabel: 'Author\'s website' },
    { id: 'pomkt', part: 'business', shelf: 'Marketing', title: 'Principles of Marketing', author: 'OpenStax authors', year: '2023',
      why: 'A free marketing textbook covering market research, consumer behaviour, branding, channels and digital marketing in one book.',
      access: 'free', href: 'https://openstax.org/details/books/principles-marketing', linkLabel: 'Free online at OpenStax' },
    // 商业 · 写作与法律
    { id: 'eos', part: 'business', shelf: 'Writing and law', title: 'The Elements of Style', zh: '', author: 'William Strunk Jr.', year: '1918',
      why: 'A slim rulebook for writing in English. Its most famous line: omit needless words.',
      access: 'free', href: 'https://www.gutenberg.org/ebooks/37134', linkLabel: 'Full text on Project Gutenberg' },
    { id: 'lwpe', part: 'business', shelf: 'Writing and law', title: 'Legal Writing in Plain English', author: 'Bryan A. Garner', year: '2001',
      why: 'Teaches lawyers to write clauses ordinary people can understand. Useful for anyone writing contracts, rules or instructions.',
      access: 'review', href: 'https://openlibrary.org/books/OL39950463M', linkLabel: 'Open Library listing (3rd edition)' },
    // 商业 · 花屿补充
    { id: 'gsbs', part: 'business', shelf: 'Onbloom Island picks', title: 'Good Strategy Bad Strategy', zh: '', author: 'Richard P. Rumelt', year: '2011',
      why: 'Good strategy has three parts: a diagnosis, a guiding policy and coherent action. Slogans and a list of goals are not strategy.',
      access: 'review', href: 'https://www.penguinrandomhouse.com/books/208668/good-strategy-bad-strategy-by-richard-rumelt/', linkLabel: 'Publisher\'s page' },
    { id: 'lean', part: 'business', shelf: 'Onbloom Island picks', title: 'The Lean Startup', zh: '', author: 'Eric Ries', year: '2011',
      why: 'Build the smallest usable version first, watch how real users respond, then decide whether to persevere or pivot.',
      access: 'review', href: 'https://theleanstartup.com/book', linkLabel: 'Official page' },
    { id: 'chasm', part: 'business', shelf: 'Onbloom Island picks', title: 'Crossing the Chasm', zh: '', author: 'Geoffrey A. Moore', year: '1991',
      why: 'Between the early adopters and the mainstream there is a chasm. The way across is to win one small, specific market first.',
      access: 'review', href: 'https://www.harpercollins.com/products/crossing-the-chasm-3rd-edition-geoffrey-a-moore', linkLabel: 'Publisher\'s page' },
    { id: 'influence', part: 'business', shelf: 'Onbloom Island picks', title: 'Influence', zh: '', author: 'Robert B. Cialdini', year: '1984',
      why: 'Reciprocity, commitment, social proof, liking, authority, scarcity: why people say yes. Marketers need to understand it, and to know where the line is.',
      access: 'review', href: 'https://www.influenceatwork.com/books-and-publications/', linkLabel: 'Author\'s institution page' },
    { id: 'gettingreal', part: 'business', shelf: 'Onbloom Island picks', title: 'Getting Real', author: '37signals', year: '2006',
      why: 'Short essays on building products as a small team: build fewer features, design the interface first, skip the long spec documents.',
      access: 'free', href: 'https://basecamp.com/gettingreal', linkLabel: 'Free online, official' },
    // AI · 工程与质量
    { id: 'sre', part: 'ai', shelf: 'Engineering and quality', title: 'Site Reliability Engineering', zh: '', author: 'Edited by Betsy Beyer, Chris Jones, Jennifer Petoff and Niall Richard Murphy', year: '2016',
      why: 'How Google keeps huge systems running: error budgets, postmortems, cutting repetitive toil.',
      access: 'free', href: 'https://sre.google/sre-book/table-of-contents/', linkLabel: 'Free online from Google' },
    { id: 'a11y', part: 'ai', shelf: 'Engineering and quality', title: 'Accessibility for Everyone', author: 'Laura Kalbag', year: '2017',
      why: 'Make your website usable for people who can\'t see, can\'t hear or can\'t use a mouse. The author has put the whole book online for free.',
      access: 'free', href: 'https://accessibilityforeveryone.site/', linkLabel: 'Free online from the author' },
    { id: 'exploreit', part: 'ai', shelf: 'Engineering and quality', title: 'Explore It!', zh: '', author: 'Elisabeth Hendrickson', year: '2013',
      why: 'Exploratory testing: instead of clicking through a script, go in with questions and find the problems nobody thought of. Useful for checking AI output too.',
      access: 'sample', href: 'https://pragprog.com/titles/ehxta/explore-it/', linkLabel: 'Publisher\'s page (three free sample chapters)' },
    // AI · 花屿补充
    { id: 'd2l', part: 'ai', shelf: 'Onbloom Island picks', title: 'Dive into Deep Learning', zh: '', author: 'Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola', year: '2023',
      why: 'A deep learning textbook where you run the code as you read. There is an official Chinese edition, and the whole book is free.',
      access: 'free', href: 'https://zh.d2l.ai/', linkLabel: 'Official Chinese edition, free online' },
    { id: 'udl', part: 'ai', shelf: 'Onbloom Island picks', title: 'Understanding Deep Learning', author: 'Simon J. D. Prince', year: '2023',
      why: 'Lots of figures and clear derivations, from the basics all the way to Transformers and diffusion models. The author offers a free PDF.',
      access: 'free', href: 'https://udlbook.github.io/udlbook/', linkLabel: 'Free PDF from the author' },
    { id: 'slp', part: 'ai', shelf: 'Onbloom Island picks', title: 'Speech and Language Processing', zh: '', author: 'Daniel Jurafsky, James H. Martin', year: '3rd edition draft',
      why: 'The classic natural language processing textbook. The new draft adds chapters on large language models, released free by the authors.',
      access: 'free', href: 'https://web.stanford.edu/~jurafsky/slp3/', linkLabel: 'Free draft from the authors' },
    { id: 'coi', part: 'ai', shelf: 'Onbloom Island picks', title: 'Co-Intelligence', author: 'Ethan Mollick', year: '2024',
      why: 'A Wharton professor\'s guide to AI for everyone: treat AI as a co-worker and learn its limits as you go.',
      access: 'review', href: 'https://www.penguinrandomhouse.com/books/741805/co-intelligence-by-ethan-mollick/', linkLabel: 'Publisher\'s page' },
    { id: 'align', part: 'ai', shelf: 'Onbloom Island picks', title: 'The Alignment Problem', zh: '', author: 'Brian Christian', year: '2020',
      why: 'Why “getting machines to do what we really want” is so hard: from biased data to reward design.',
      access: 'review', href: 'https://brianchristian.org/the-alignment-problem/', linkLabel: 'Author\'s website' },
    // 艺术 · 产品与设计
    { id: 'doet', part: 'art', shelf: 'Product and design', title: 'The Design of Everyday Things', zh: '', author: 'Don Norman', year: '1988 (revised 2013)',
      why: 'If you can\'t open a door, it\'s not your fault; the design didn\'t make it clear. Affordances, feedback and mental models apply to anything you make.',
      access: 'review', href: 'https://www.hachettebookgroup.com/titles/don-norman/the-design-of-everyday-things/9780465050659/', linkLabel: 'Publisher\'s page' },
    { id: 'cdh', part: 'art', shelf: 'Product and design', title: 'Continuous Discovery Habits', author: 'Teresa Torres', year: '2021',
      why: 'Talk to a customer every week, and use an “opportunity solution tree” to turn what you hear into solutions to test.',
      access: 'review', href: 'https://www.producttalk.org/continuous-discovery-habits/', linkLabel: 'Author\'s website' },
    { id: 'momtest', part: 'art', shelf: 'Product and design', title: 'The Mom Test', author: 'Rob Fitzpatrick', year: '2013',
      why: 'How to ask customers questions without being fooled by politeness: ask what they\'ve done in the past, not “would you buy this?”',
      access: 'review', href: 'https://www.momtestbook.com/', linkLabel: 'Official page' },
    { id: 'ptypo', part: 'art', shelf: 'Product and design', title: 'Practical Typography', author: 'Matthew Butterick', year: '2013',
      why: 'A typography book for everyone who writes: font size, line spacing, line length. Free to read online; the author asks readers to pay what they choose.',
      access: 'free', href: 'https://practicaltypography.com/', linkLabel: 'Free online from the author' },
    { id: 'shapeup', part: 'art', shelf: 'Product and design', title: 'Shape Up', author: 'Ryan Singer', year: '2019',
      why: 'Basecamp\'s way of working: decide how much time you\'re willing to spend, shape the solution, work in six-week cycles, and stop when it\'s done.',
      access: 'free', href: 'https://basecamp.com/shapeup', linkLabel: 'Free online, official' },
    // 艺术 · 创意
    { id: 'tpi', part: 'art', shelf: 'Creativity', title: 'A Technique for Producing Ideas', author: 'James Webb Young', year: '1940',
      why: 'An advertising man\'s five-step method for ideas: gather material, digest it, let it go, the idea arrives, then shape it for use. You can read it in an hour.',
      access: 'review', href: 'https://openlibrary.org/books/OL7299660M', linkLabel: 'Open Library listing', note: 'We found no legal free full text. The PDFs circulating online are of unknown origin, so we don\'t link them.' },
    { id: 'wgicf', part: 'art', shelf: 'Creativity', title: 'Where Good Ideas Come From', zh: '', author: 'Steven Johnson', year: '2010',
      why: 'Good ideas rarely arrive in a flash; mostly they come from slow hunches and collisions with other people\'s ideas.',
      access: 'review', href: 'https://openlibrary.org/books/OL24369699M', linkLabel: 'Open Library listing' },
    // 艺术 · 花屿补充
    { id: 'uc', part: 'art', shelf: 'Onbloom Island picks', title: 'Understanding Comics', zh: '', author: 'Scott McCloud', year: '1993',
      why: 'Comics about comics: how the gaps between panels let readers fill in the story themselves. The book we read before drawing Onbloom Island\'s comic.',
      access: 'review', href: 'https://www.scottmccloud.com/2-print/1-uc/', linkLabel: 'Author\'s website' },
    { id: 'wos', part: 'art', shelf: 'Onbloom Island picks', title: 'Ways of Seeing', zh: '', author: 'John Berger', year: '1972',
      why: 'How we see a painting depends on what we know and believe. Advertising has always been teaching us how to look, too.',
      access: 'review', href: 'https://www.penguin.co.uk/books/56465/ways-of-seeing-by-berger-john/9780141035796', linkLabel: 'Publisher\'s page' },
    { id: 'ioc', part: 'art', shelf: 'Onbloom Island picks', title: 'Interaction of Color', author: 'Josef Albers', year: '1963',
      why: 'The same colour looks different next to different colours. A Bauhaus teacher\'s course of colour exercises.',
      access: 'review', href: 'https://yalebooks.yale.edu/book/9780300179354/interaction-of-color/', linkLabel: 'Publisher\'s page' },
    { id: 'slaa', part: 'art', shelf: 'Onbloom Island picks', title: 'Steal Like an Artist', author: 'Austin Kleon', year: '2012',
      why: 'Ten pieces of advice for creative people: learn from the work you love, and remix your influences into something of your own.',
      access: 'review', href: 'https://austinkleon.com/steal/', linkLabel: 'Author\'s website' },
    { id: 'csa', part: 'art', shelf: 'Onbloom Island picks', title: 'Concerning the Spiritual in Art', zh: '', author: 'Wassily Kandinsky', year: '1911',
      why: 'Kandinsky on how colour and form move us directly; one of the starting points of abstract painting.',
      access: 'free', href: 'https://www.gutenberg.org/ebooks/5321', linkLabel: 'Full text on Project Gutenberg' }
  ],
  // Each person keeps one slot. Statuses are only ever what they reported; nothing is filled in for them.
  people: [
    { id: 'letian', name: 'Letian', role: 'Island keeper · sets the direction and the reading list', reading: [], done: [] },
    { id: 'james', name: 'James', role: 'Dispatch assistant (Grok) · hands out reading lists and tasks', reading: [], done: [] },
    { id: 'sage', name: 'Sage', role: 'Assistant · launch reading list', reading: [], done: [] },
    { id: 'ledger', name: 'Ledger', role: 'Assistant · money-sense reading list', reading: [], done: [] },
    { id: 'claude', name: 'Claude Code', role: 'Assistant · writes introductions, makes cards', reading: [], done: ['shapeup'] },
    { id: 'codex', name: 'Codex', role: 'Assistant · draws illustrations', reading: [], done: [] }
  ],
  // Our own notes on a book. Only Shape Up has them so far; every other card says “待做”.
  notes: {
    shapeup: {
      by: 'Onbloom Island introduction · draft, compiled by Claude Code, awaiting human proofreading',
      analysis: [
        'Shape Up is the product development method Basecamp has published openly; its author, Ryan Singer, was head of product there. The question it answers: how can a small team avoid sinking into an endless backlog and still ship complete work on time?',
        'The core is three steps. First, “shaping”: experienced people think the work through to the right level of detail and set the “appetite”, meaning how much time they\'re willing to spend on it, rather than first estimating how long it will take; then they sketch a rough solution, find the “rabbit holes” it could fall into, and write it up as a pitch. Second, “betting”: before each cycle starts, decide which pitches to bet on. Pitches not chosen don\'t go into a backlog; if someone still wants them, they pitch again next time. Third, “building”: hand the whole piece of work to a small team, let them break it into tasks themselves, and finish within six weeks. If it isn\'t done, by default it doesn\'t get extended; this is the “circuit breaker”. Each six-week cycle is followed by a two-week cool-down for fixes and planning what\'s next.',
        'The idea most worth learning is “appetite”: fix the time first, then decide how much to do within it, instead of fixing the features first and then racing to finish. It works for content teams too.'
      ],
      map: [
        ['Shaping', ['Set the appetite: decide how much time you\'re willing to spend', 'Rough solutions: breadboards and fat-marker sketches', 'Find the rabbit holes: remove the traps that could sink the project in advance', 'Write the pitch: problem, appetite, solution, rabbit holes, no-gos']],
        ['Betting', ['Six-week cycles, then a two-week cool-down', 'The betting table: decide which pitches to bet on before the cycle starts', 'No backlog: pitches not chosen are pitched again next time', 'Circuit breaker: unfinished work isn\'t extended by default']],
        ['Building', ['Hand whole projects to a small team instead of assigning split-up tasks', 'The team discovers and breaks down the tasks itself', 'Organise work by “scopes”, not by people or roles', 'Hill charts: uphill is figuring it out, downhill is making it happen']]
      ],
      cards: [
        ['What\'s the difference between “appetite” and an estimate?', 'An estimate fixes what to build, then asks how long it will take. Appetite fixes how long you\'re willing to spend, then decides how far to take it in that time.'],
        ['Why no backlog?', 'A backlog only grows, creating anxiety and false promises. If a pitch that wasn\'t chosen really matters, someone will pitch it again next cycle.'],
        ['What is the “circuit breaker”?', 'If a project isn\'t finished in six weeks, it stops by default instead of being extended automatically. That forces the scope to be thought through during shaping, and stops a project dragging on forever.'],
        ['What are the uphill and downhill sides of a hill chart?', 'Uphill means you\'re still working out the approach and there are unknowns; downhill means the approach is clear and only execution is left. Stuck uphill too long means the problem hasn\'t been thought through.'],
        ['How could Onbloom Island use it?', 'Set an appetite for each round of content, such as “two comic pages, one cycle”; the illustrator and writer split the work themselves within that time, stop when it\'s done, and review during the cool-down.']
      ]
    }
  }
};
