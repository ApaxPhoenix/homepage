// All site copy and links live here so the library team can edit one file.

export const SITE = {
  name: "LHS Commons",
  fullName: "Linden High School Library Commons",
  wordmark: "COMMONS",
  school: "Linden High School",
  librarian: "Ms. Colish",
  // Library contact email. Leave empty to show "visit the circulation desk" instead.
  email: "mcolish@lindenps.org",
  location: "2nd floor, Social Studies wing — across from Room 214",
  // Follett Destiny Discover search; the query is appended to this URL.
  catalogSearch: "https://search.follettsoftware.com/metasearch/rest/v2/go/102772/search?col=all&q=",
  catalogHome: "https://search.follettsoftware.com/metasearch/rest/v2/go/102772",
  // Replace with the school's LearnHouse organisation URL once it is set up.
  learnhouse: "https://www.learnhouse.app",
};

export const NAV = [
  { label: "Books", href: "#books" },
  { label: "Find a book", href: "#find" },
  { label: "Resources", href: "#resources" },
  { label: "International Baccalaureate", href: "#ib" },
  { label: "Courses", href: "#courses" },
  { label: "Help", href: "#help" },
  { label: "Visit", href: "#visit" },
];

// Regular hours, in school time (America/New_York). Day 0 = Sunday.
export const HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: "07:35", close: "14:45" },
  2: { open: "07:35", close: "16:00" },
  3: { open: "07:35", close: "16:00" },
  4: { open: "07:35", close: "19:00" },
  5: { open: "07:35", close: "16:00" },
  6: null,
};

export const HOURS_TABLE = [
  { day: "Monday – Friday", time: "7:35am – 2:45pm" },
  { day: "Tuesday, Wednesday, Friday", time: "After school until 4:00pm" },
  { day: "Thursday", time: "After school until 7:00pm" },
];

// Covers come from Open Library by ISBN; publisher and year feed the citation tool.
export const TOP_BOOKS = [
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    genre: "Historical fiction",
    blurb: "Nazi Germany, narrated by Death, and a girl who steals books to survive it.",
    isbn: "9780375842207",
    publisher: "Alfred A. Knopf",
    year: "2006",
    review: "https://www.goodreads.com/review/show/2000790435",
  },
  {
    title: "The Fifth Season",
    author: "N. K. Jemisin",
    genre: "Fantasy",
    blurb: "A world that ends every few centuries and a mother searching for her daughter as it happens again.",
    isbn: "9780316229296",
    publisher: "Orbit",
    year: "2015",
    review: "https://www.goodreads.com/review/show/2688764715",
  },
  {
    title: "The Things They Carried",
    author: "Tim O'Brien",
    genre: "War fiction",
    blurb: "Linked stories about a platoon in Vietnam and the weight — real and remembered — each soldier holds.",
    isbn: "9780618706419",
    publisher: "Houghton Mifflin",
    year: "1990",
    review: "https://www.goodreads.com/review/show/2000811856",
  },
  {
    title: "Miss Peregrine's Home for Peculiar Children",
    author: "Ransom Riggs",
    genre: "Fantasy / mystery",
    blurb: "An island, an abandoned orphanage and a stack of strange vintage photographs.",
    isbn: "9781594746031",
    publisher: "Quirk Books",
    year: "2011",
    review: "https://www.goodreads.com/review/show/2688770664",
  },
  {
    title: "Sold",
    author: "Patricia McCormick",
    genre: "Novel in verse",
    blurb: "A girl from Nepal is trafficked into India; told in short, unforgettable poems.",
    isbn: "9780786851713",
    publisher: "Hyperion",
    year: "2006",
    review: "https://www.goodreads.com/review/show/2000809987",
  },
];

// Genre shelves for the book finder: Open Library searches limited to teen fiction.
export const GENRES = [
  { label: "Fantasy", q: 'subject:"young adult fiction" subject:fantasy' },
  { label: "Mystery", q: 'subject:"young adult fiction" subject:mystery' },
  { label: "Science fiction", q: 'subject:"young adult fiction" subject:"science fiction"' },
  { label: "Historical", q: 'subject:"young adult fiction" subject:"historical fiction"' },
  { label: "Romance", q: 'subject:"young adult fiction" subject:romance' },
  { label: "Novels in verse", q: 'subject:"novels in verse"' },
  { label: "Graphic novels", q: 'subject:"young adult fiction" subject:"graphic novels"' },
];

export const READING_LINKS = [
  { label: "The library's book list", note: "LHS Media Center on Goodreads", href: "https://www.goodreads.com/review/list/65339918-lindenhs-mediacenter?shelf=read" },
  { label: "eBooks & audiobooks", note: "Sora / OverDrive", href: "https://soraapp.com/" },
  {
    label: "Cameron's Collection eBooks",
    note: "Gale — use the Gale password",
    href: "https://go.gale.com/ps/i.do?p=GVRL&sw=w&u=lin7273&v=2.1&subject=Cameron%27s+Collection&pg=BooksForSubject&it=static&sid=GVRL",
  },
  { label: "Book clubs", note: "Goodreads groups", href: "https://www.goodreads.com/group" },
];

export const FREE_BOOKS = [
  { label: "Project Gutenberg", note: "Tens of thousands of free classics", href: "https://www.gutenberg.org/" },
  { label: "HathiTrust", note: "Millions of digitised library titles", href: "https://www.hathitrust.org/" },
  { label: "Complete Works of Shakespeare", note: "MIT's plays and poems", href: "http://shakespeare.mit.edu/works.html" },
  { label: "Bartleby", note: "Classic literature and reference", href: "https://www.bartleby.com/" },
  { label: "The Online Books Page", note: "Index of free books online", href: "https://onlinebooks.library.upenn.edu/" },
  { label: "Internet Archive — Texts", note: "Fiction, history and academic books", href: "https://archive.org/details/texts" },
];

export type ResourceLink = { label: string; note?: string; href: string };
export type ResourceGroup = { title: string; intro: string; links: ResourceLink[] };

export const NOODLETOOLS = {
  features: ["Create citations", "Take notes", "Organise & outline", "Collaborate with peers", "Share with teachers"],
  student: "https://my.noodletools.com/logon/signin?domain=students.lindenps.org",
  teacher: "https://my.noodletools.com/logon/signin?domain=lindenps.org",
};

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: "Research databases",
    intro: "Every database here exports citations to NoodleTools. Ask Ms. Colish for passwords.",
    links: [
      { label: "EBSCOhost", note: "Articles, journals and magazines", href: "https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s9780133&groupid=main&site=mhlibed&return=y" },
      { label: "EBSCO Image Collection", note: "Inside EBSCOhost", href: "https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s9780133&groupid=main&site=mhlibed&return=y" },
      { label: "GreenFILE", note: "Environment research — inside EBSCOhost", href: "https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s9780133&groupid=main&site=mhlibed&return=y" },
      { label: "Gale eBooks", note: "Gale Cengage reference", href: "https://infotrac.galegroup.com/itweb/lin7273?db=GVRL" },
      { label: "Learn360", note: "Infobase streaming video", href: "http://learn360.infobase.com/PortalPlayLists.aspx?wid=18096" },
      { label: "JerseyClicks", note: "NJ State Library — works from New Jersey locations", href: "https://www.njstatelib.org/services_for_libraries/statewide_services/jerseyclicks/jerseyclicks-urls-libraries/" },
    ],
  },
  {
    title: "Infobase Facts on File",
    intro: "Subject databases for history, literature, science, health and careers.",
    links: [
      { label: "American History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE52" },
      { label: "African-American History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE01" },
      { label: "American Indian History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE43" },
      { label: "Ancient & Medieval History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE49" },
      { label: "Modern World History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE53" },
      { label: "World Geography & Culture", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE39" },
      { label: "Bloom's Literature", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE54" },
      { label: "Science Online", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE40" },
      { label: "Health Reference Center", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE48" },
      { label: "Ferguson's Career Guidance", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE34" },
      { label: "Curriculum Resource Center", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE51" },
    ],
  },
  {
    title: "Primary sources & facts",
    intro: "Original documents, historic newspapers, data and both sides of the argument.",
    links: [
      { label: "Library of Congress", note: "Digital collections & primary sources", href: "https://www.loc.gov/collections/" },
      { label: "NJ Digital Newspaper Project", note: "Historic New Jersey papers — Rutgers", href: "https://blogs.libraries.rutgers.edu/njdnp/available-newspaper-titles/" },
      { label: "US Census data", note: "Statistics", href: "https://data.census.gov/" },
      { label: "ProCon", note: "Pros and cons of controversial issues", href: "https://www.procon.org/" },
      { label: "Dictionary", href: "https://www.dictionary.com/" },
      { label: "Thesaurus", href: "https://www.thesaurus.com/" },
    ],
  },
  {
    title: "Search smarter",
    intro: "Search engines built for school work, plus tips for getting better results.",
    links: [
      { label: "SweetSearch", note: "Search engine for students", href: "https://www.sweetsearch.com/" },
      { label: "Google Scholar", note: "Scholarly articles and papers", href: "https://scholar.google.com/" },
      { label: "Search tips & tricks", note: "Google for Education PDF", href: "https://static.googleusercontent.com/media/www.google.com/en//educators/downloads/Tips_Tricks_17x22.pdf" },
    ],
  },
  {
    title: "Writing help",
    intro: "Get the format right and keep your work your own.",
    links: [
      { label: "Purdue OWL", note: "MLA, APA, in-text citations and general writing help", href: "https://owl.purdue.edu/owl/purdue_owl.html" },
      { label: "In-text citations guide", href: "https://monroecollege.libguides.com/c.php?g=589208&p=4073045" },
      { label: "Avoiding plagiarism", href: "https://monroecollege.libguides.com/c.php?g=589208&p=4072931" },
    ],
  },
  {
    title: "Evaluating sources",
    intro: "Before you cite it, check who made it, when and why.",
    links: [
      { label: "The CRAAP test", href: "https://libguides.cmich.edu/web_research/craap" },
      { label: "5 W's evaluation checklist", href: "https://www.schrockguide.net/uploads/3/9/2/2/392267/schrock_5ws.pdf" },
      { label: "Finding scholarly sources", note: "University of Illinois Library", href: "https://www.library.illinois.edu/ugl/howdoi/scholarly/" },
      { label: "Academic vs. peer-reviewed journals", note: "EBSCO", href: "https://connect.ebsco.com/s/article/What-is-the-difference-between-Academic-Journals-and-Scholarly-Peer-Reviewed-Journals?language=en_US" },
    ],
  },
  {
    title: "College & career",
    intro: "Applications, financial aid, test prep and career research.",
    links: [
      { label: "College & career collection", note: "Wakelet", href: "https://wakelet.com/wake/hfPp77ukmR8-v0yTPucPb" },
      { label: "Common App", href: "https://www.commonapp.org/" },
      { label: "FAFSA — Federal Student Aid", href: "https://studentaid.gov/" },
      { label: "NJ HESAA", note: "New Jersey state aid", href: "https://www.hesaa.org/" },
      { label: "BigFuture", note: "College search & scholarships", href: "https://bigfuture.collegeboard.org/" },
      { label: "Digital SAT prep", note: "Khan Academy", href: "https://www.khanacademy.org/test-prep/digital-sat" },
    ],
  },
  {
    title: "Wellness corner",
    intro: "Support for your head and your health. Wellness books are also on the shelf in the Commons.",
    links: [
      { label: "988 Suicide & Crisis Lifeline", note: "Call or text 988", href: "https://988lifeline.org/" },
      { label: "Wellness collection", note: "Wakelet — mental health sites and apps", href: "https://wakelet.com/wake/Xnc3RhioDjiBT-4oRVD44" },
      { label: "Wellness eBooks", note: "Browse and borrow anonymously", href: "https://collections.follettsoftware.com/collection/5e2affecc4050e0012d5216c?h=9bcfef44e29749b57609f258d16b074af3a343f6095ce100c5e5fcc854214b4e" },
      { label: "TeensHealth", note: "Body, mind and relationships", href: "https://kidshealth.org/en/teens/" },
      { label: "MyPlate", note: "Nutrition basics", href: "https://www.myplate.gov/" },
    ],
  },
];

export const CAS_STRANDS = [
  {
    letter: "C",
    title: "Creativity",
    body: "Exploring and extending ideas that lead to an original or interpretive product or performance.",
    ideas: ["Start a podcast", "Learn an instrument", "Design for the makerspace"],
  },
  {
    letter: "A",
    title: "Activity",
    body: "Physical exertion that contributes to a healthy lifestyle — from team sports to a new personal challenge.",
    ideas: ["Join a school team", "Train for a 5K", "Try yoga or dance"],
  },
  {
    letter: "S",
    title: "Service",
    body: "Collaborative, reciprocal engagement with the community in response to an authentic need.",
    ideas: ["Tutor younger students", "Run a book drive", "Volunteer locally"],
  },
];

export const CAS_OUTCOMES = [
  "Identify your own strengths and the areas where you want to grow",
  "Show that you took on challenges and built new skills along the way",
  "Show how you started and planned a CAS experience",
  "Show commitment and perseverance in your CAS experiences",
  "Show the skills and benefits of working with others",
  "Engage with issues of global significance",
  "Recognise and consider the ethics of your choices and actions",
];

export const CAS_STAGES = ["Investigation", "Preparation", "Action", "Reflection", "Demonstration"];

export const CAS_LINKS = [
  { label: "CAS presentation", note: "Google Slides", href: "https://docs.google.com/presentation/d/e/2PACX-1vSy5KM1rURUFKzTqxpIxTQrzLpv5BVxG30GkkXpMPCWvCvGSGPQ-qCvE7ytX10AJaWZe9RWAvfznPtA/pub?start=false&loop=false&delayms=10000" },
  { label: "CAS collection", note: "Wakelet", href: "https://wakelet.com/wake/rzd0rJxntmjppbp-_eS2f" },
  { label: "CAS on the IB website", note: "Official guide — ibo.org", href: "https://www.ibo.org/programmes/diploma-programme/curriculum/creativity-activity-and-service/" },
];

export const IB_HELP = [
  { title: "Extended Essay", body: "Book a research consult with Ms. Colish and start your source list in NoodleTools." },
  { title: "Theory of Knowledge", body: "Find real-world examples in ProCon, newspapers and primary sources." },
  { title: "Internal Assessments", body: "Use the subject databases for data, articles and background reading." },
];

// IB Diploma courses offered at Linden High. Edit this list as offerings change.
export const IB_COURSES = [
  { name: "English A", level: "HL", group: "Language & literature", use: "Bloom's Literature, Purdue OWL" },
  { name: "History", level: "HL", group: "Individuals & societies", use: "Library of Congress, Modern World History" },
  { name: "Chemistry", level: "HL", group: "Sciences", use: "Science Online, EBSCOhost" },
  { name: "Biology", level: "SL", group: "Sciences", use: "Science Online, Health Reference Center" },
  { name: "Physics", level: "SL", group: "Sciences", use: "Science Online, Google Scholar" },
  { name: "Design Technology", level: "SL", group: "Sciences", use: "Science Online, EBSCOhost" },
  { name: "Mathematics: Analysis & Approaches", level: "SL", group: "Mathematics", use: "US Census data, Google Scholar" },
]

// Internal Assessment by course. Formats follow the current IB subject guides;
// check deadlines and details with each teacher.
export const IA_STEPS = [
  { title: "Pick a focused question", body: "Narrow enough to answer well in the space you have. Run it past your teacher early." },
  { title: "Research & plan", body: "Gather sources and data. Keep every source and note in NoodleTools from day one." },
  { title: "Draft", body: "Write or record a full draft. Your teacher can give feedback on one draft." },
  { title: "Revise & submit", body: "Act on the feedback, check your citations and hand in the final version." },
];

export const IA_BY_COURSE = [
  { course: "English A HL", task: "Individual oral", format: "About 15 minutes: a prepared talk connecting a literary and a non-literary text to a global issue, then questions from your teacher." },
  { course: "History HL", task: "Historical investigation", format: "A written investigation of up to 2,200 words, including source evaluation and a reflection." },
  { course: "Chemistry HL", task: "Scientific investigation", format: "An experiment or data investigation you design yourself, written up in up to 3,000 words." },
  { course: "Biology SL", task: "Scientific investigation", format: "An experiment or data investigation you design yourself, written up in up to 3,000 words." },
  { course: "Physics SL", task: "Scientific investigation", format: "An experiment or data investigation you design yourself, written up in up to 3,000 words." },
  { course: "Design Technology SL", task: "Design project", format: "Identify a real problem, then research, develop, prototype and evaluate a solution, documented in a portfolio." },
  { course: "Math: Analysis & Approaches SL", task: "Mathematical exploration", format: "A 12–20 page report exploring a piece of maths that interests you, in your own voice." },
];

export const IB_CORE = [
  { title: "Theory of Knowledge", short: "TOK", body: "A course on how we know what we claim to know, ending in an exhibition and an essay." },
  { title: "Extended Essay", short: "EE", body: "An independent 4,000-word research paper on a topic you choose." },
  { title: "Creativity, Activity, Service", short: "CAS", body: "Experiences outside the classroom, planned and reflected on across the programme." },
]

// What's actually in the space: games, reading and hands-on creative supplies.
export const MAKERSPACE = [
  { group: "Board games", items: ["Chess", "Scrabble", "Uno", "Battleship", "Mancala", "Connect Four", "Jenga"] },
  { group: "Read", items: ["Books", "Graphic novels", "Magazines", "Newspapers & articles"] },
  {
    group: "Create",
    items: ["Community coloring", "Community puzzle", "Origami", "Drawing & sketching", "Knitting & crochet", "Looms", "Sewing"],
  },
]

export const LIBRARIAN_HELPS = [
  "Research consults for essays, the EE and IAs",
  "Database passwords and logins",
  "Lunch passes",
  "Book requests and recommendations",
  "Citations and NoodleTools",
  "Booking the conference room",
];

export const FAQ = [
  {
    q: "How do I get into the library during class?",
    a: "Come with your teacher or bring a pass from class, and wear your student ID. Scan in at the front door, hand in your pass, and scan out when you leave.",
  },
  {
    q: "Can I come to the library at lunch?",
    a: "Yes — pick up a lunch pass from Ms. Colish in the library in the morning. The cafeteria does not give out library passes.",
  },
  {
    q: "Where do I get database passwords?",
    a: "Ask Ms. Colish. Cameron's Collection eBooks use the Gale password.",
  },
  {
    q: "Can I print or make copies?",
    a: "Yes. Colour printing and copying are self-service for single copies. Bulk and class-set jobs go through the main office.",
  },
  {
    q: "How do I borrow eBooks and audiobooks?",
    a: "Use Sora (OverDrive) for eBooks and audiobooks, or Cameron's Collection on Gale for more eBooks. Ms. Colish can help you sign in.",
  },
  {
    q: "How do I cite a book?",
    a: "Find it in the book finder and press Cite for MLA or APA, then keep your sources organised in NoodleTools.",
  },
  {
    q: "Can I book a room for group work?",
    a: "Students can see Ms. Colish to book the conference room. Teachers can request the library classroom or conference room with the online form.",
  },
  {
    q: "Is the library open after school?",
    a: "Yes — until 4:00pm on Tuesday, Wednesday and Friday, and until 7:00pm on Thursday.",
  },
];

export const SCHEDULE_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScrLQwoIJGkqy5KFdZ_KPgy37p5XMV89fxz7X2Z3zG2zquewA/viewform";
