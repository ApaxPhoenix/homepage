// All site copy and links live here so the library team can edit one file.

export const SITE = {
  name: "LHS Commons",
  wordmark: "COMMONS",
  school: "Linden High School",
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
  { label: "Resources", href: "#resources" },
  { label: "IB CAS", href: "#cas" },
  { label: "LearnHouse", href: "#learnhouse" },
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

export const TOP_BOOKS = [
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    genre: "Historical fiction",
    blurb: "Nazi Germany, narrated by Death, and a girl who steals books to survive it.",
    href: "https://www.goodreads.com/review/show/2000790435",
  },
  {
    title: "The Fifth Season",
    author: "N. K. Jemisin",
    genre: "Fantasy",
    blurb: "A world that ends every few centuries and a mother searching for her daughter as it happens again.",
    href: "https://www.goodreads.com/review/show/2688764715",
  },
  {
    title: "The Things They Carried",
    author: "Tim O'Brien",
    genre: "War fiction",
    blurb: "Linked stories about a platoon in Vietnam and the weight — real and remembered — each soldier holds.",
    href: "https://www.goodreads.com/review/show/2000811856",
  },
  {
    title: "Miss Peregrine's Home for Peculiar Children",
    author: "Ransom Riggs",
    genre: "Fantasy / mystery",
    blurb: "An island, an abandoned orphanage and a stack of strange vintage photographs.",
    href: "https://www.goodreads.com/review/show/2688770664",
  },
  {
    title: "Sold",
    author: "Patricia McCormick",
    genre: "Novel in verse",
    blurb: "A girl from Nepal is trafficked into India; told in short, unforgettable poems.",
    href: "https://www.goodreads.com/review/show/2000809987",
  },
];

export const READING_LINKS = [
  { label: "Mrs. H's full book list", note: "Goodreads", href: "https://www.goodreads.com/review/list/65339918-lindenhs-mediacenter?shelf=read" },
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

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: "Research databases",
    intro: "Every database here exports citations to NoodleTools. Ask Mrs. H. or Mrs. Casey for passwords.",
    links: [
      { label: "NoodleTools — students", note: "Citations, notes, outlines", href: "https://my.noodletools.com/logon/signin?domain=students.lindenps.org" },
      { label: "NoodleTools — teachers", href: "https://my.noodletools.com/logon/signin?domain=lindenps.org" },
      { label: "EBSCOhost", note: "Articles and journals", href: "https://search.ebscohost.com/" },
      { label: "Gale eBooks", href: "https://infotrac.galegroup.com/itweb/lin7273?db=GVRL" },
      { label: "Learn360", note: "Infobase streaming video", href: "http://learn360.infobase.com/PortalPlayLists.aspx?wid=18096" },
      { label: "JerseyClicks", note: "Free via NJ State Library", href: "https://www.njstatelib.org/services_for_libraries/statewide_services/jerseyclicks/jerseyclicks-urls-libraries/" },
    ],
  },
  {
    title: "Infobase subject databases",
    intro: "Facts on File collections for history, science and careers.",
    links: [
      { label: "American History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE52" },
      { label: "African-American History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE01" },
      { label: "American Indian History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE43" },
      { label: "Ancient & Medieval History", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE49" },
      { label: "World Geography & Culture", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE39" },
      { label: "Science Online", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE40" },
      { label: "Health", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE48" },
      { label: "Curriculum Resource Center", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE51" },
    ],
  },
  {
    title: "Primary sources & facts",
    intro: "Original documents, newspapers, data and both sides of the argument.",
    links: [
      { label: "Library of Congress", note: "Digital collections", href: "https://www.loc.gov/collections/" },
      { label: "NJ Digital Newspaper Project", note: "Rutgers", href: "https://blogs.libraries.rutgers.edu/njdnp/available-newspaper-titles/" },
      { label: "US Census data", href: "https://data.census.gov/" },
      { label: "ProCon", note: "Pros and cons of big issues", href: "https://www.procon.org/" },
      { label: "SweetSearch", note: "Search engine for students", href: "https://www.sweetsearch.com/" },
      { label: "Dictionary", href: "https://www.dictionary.com/" },
      { label: "Thesaurus", href: "https://www.thesaurus.com/" },
    ],
  },
  {
    title: "Writing & citations",
    intro: "Get the format right and keep your work your own.",
    links: [
      { label: "Purdue OWL", note: "MLA, APA and general writing help", href: "https://owl.purdue.edu/owl/purdue_owl.html" },
      { label: "In-text citations guide", href: "https://monroecollege.libguides.com/c.php?g=589208&p=4073045" },
      { label: "Avoiding plagiarism", href: "https://monroecollege.libguides.com/c.php?g=589208&p=4072931" },
      { label: "Search tips & tricks", note: "Google for Education PDF", href: "https://static.googleusercontent.com/media/www.google.com/en//educators/downloads/Tips_Tricks_17x22.pdf" },
    ],
  },
  {
    title: "Evaluating sources",
    intro: "Before you cite it, check who made it and why.",
    links: [
      { label: "The CRAAP test", href: "https://libguides.cmich.edu/web_research/craap" },
      { label: "5 W's evaluation checklist", href: "https://www.schrockguide.net/uploads/3/9/2/2/392267/schrock_5ws.pdf" },
      { label: "Academic vs. peer-reviewed journals", note: "EBSCO", href: "https://connect.ebsco.com/s/article/What-is-the-difference-between-Academic-Journals-and-Scholarly-Peer-Reviewed-Journals?language=en_US" },
    ],
  },
  {
    title: "College & career",
    intro: "Applications, financial aid, test prep and career research.",
    links: [
      { label: "Common App", href: "https://www.commonapp.org/" },
      { label: "FAFSA — Federal Student Aid", href: "https://studentaid.gov/" },
      { label: "NJ HESAA", note: "New Jersey state aid", href: "https://www.hesaa.org/" },
      { label: "BigFuture", note: "College search & scholarships", href: "https://bigfuture.collegeboard.org/" },
      { label: "Digital SAT prep", note: "Khan Academy", href: "https://www.khanacademy.org/test-prep/digital-sat" },
      { label: "Ferguson's Career Guidance", note: "Infobase", href: "https://online.infobaselearning.com/Direct.aspx?aid=18096&pid=WE34" },
    ],
  },
  {
    title: "Wellness corner",
    intro: "Support for your head and your health. Wellness books are also on the shelf in the Commons.",
    links: [
      { label: "988 Suicide & Crisis Lifeline", note: "Call or text 988", href: "https://988lifeline.org/" },
      { label: "TeensHealth", note: "Body, mind and relationships", href: "https://kidshealth.org/en/teens/" },
      { label: "MyPlate", note: "Nutrition basics", href: "https://www.myplate.gov/" },
      { label: "Wellness eBooks", note: "Follett collection", href: "https://collections.follettsoftware.com/collection/5e2affecc4050e0012d5216c?h=9bcfef44e29749b57609f258d16b074af3a343f6095ce100c5e5fcc854214b4e" },
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
  { label: "CAS at home ideas", note: "LPS OneNote", href: "https://lindenps-my.sharepoint.com/:o:/g/personal/khanusosky_lindenps_org/EnIYt4DjvstEkuejKp-K7pYBlbiCxkjvgy2vCCGnUqC31A" },
  { label: "CAS on the IB website", note: "ibo.org", href: "https://www.ibo.org/programmes/diploma-programme/curriculum/creativity-activity-and-service/" },
];

export const IB_HELP = [
  { title: "Extended Essay", body: "Book a research consult and start your source list in NoodleTools." },
  { title: "Theory of Knowledge", body: "Find real-world examples in ProCon, newspapers and primary sources." },
  { title: "Internal Assessments", body: "Use the subject databases for data, articles and background reading." },
];

export const MAKERSPACE = [
  "Virtual reality (BYOD)",
  "KEVA planks",
  "Makey Makey",
  "K'NEX",
  "Snap Circuits",
  "Knitting & crochet",
  "Looms",
  "Sewing",
  "Community coloring",
  "Community puzzle",
  "Origami",
  "Chess",
  "Uno",
  "Battleship",
  "Mancala",
  "Connect Four",
  "Scrabble",
];

export const VISIT_RULES = [
  {
    title: "Getting in",
    body: "Come with your teacher or a pass from class, and wear your student ID. Scan in at the door, hand in your pass and scan out when you leave.",
  },
  {
    title: "Lunch passes",
    body: "Pick one up from Mrs. H. in the library in the morning. The cafeteria does not give out library passes.",
  },
  {
    title: "Printing & copying",
    body: "Self-service colour printing and copying for single copies. Bulk and class-set jobs go through the main office.",
  },
  {
    title: "Booking space",
    body: "Teachers can request the library classroom or conference room online. Students, see Mrs. H. or Mrs. Casey to book the conference room for group work.",
  },
];

export const SCHEDULE_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScrLQwoIJGkqy5KFdZ_KPgy37p5XMV89fxz7X2Z3zG2zquewA/viewform";
