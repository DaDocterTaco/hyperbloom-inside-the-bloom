export const links = {
  october: "https://hyperbloom-october.devpost.com/",
  rules: "https://hyperbloom-october.devpost.com/rules",
  discord: "https://discord.gg/4k62hfK7x5",
  email: "mailto:hyperbloomhacks@gmail.com",
  instagram: "https://www.instagram.com/hyperbloom_hacks/",
  linkedin: "https://www.linkedin.com/company/hyperbloom-hacks/",
  official: "https://www.hyperbloomhacks.com/",
  blog: "https://www.hyperbloomhacks.com/blog",
  gallery: "https://www.hyperbloomhacks.com/gallery",
  recap: "https://www.hyperbloomhacks.com/v1-gallery",
  closed: "https://www.hyperbloomhacks.com/reg-closed",
};
export const events = [
  {
    title: "Hyperbloom October",
    theme: "UI/UX & Web Design",
    date: "October 1–20, 2026",
    status: "Open now",
    current: true,
    href: links.october,
  },
  {
    title: "Beginner Friendly",
    theme: "",
    date: "September 14–30, 2026",
    status: "Registrations closed",
    href: "https://hyperbloom-september2.devpost.com/",
  },
  {
    title: "Hyperbloom September",
    theme: "AI & Machine Learning",
    date: "September 1–14, 2026",
    status: "Registrations closed",
    href: "https://hyperbloom-september.devpost.com/",
  },
  {
    title: "Hyperbloom Summer Hack",
    theme: "",
    date: "June 7–30, 2026",
    status: "Registrations closed",
    href: "https://hyperbloom-summer-hackathon.devpost.com/",
  },
  {
    title: "Hyperbloom V2",
    theme: "",
    date: "April 15, 2026",
    status: "Registrations closed",
    href: "https://hyperbloom-v2.devpost.com/",
    brochure:
      "https://www.hyperbloomhacks.com/_files/ugd/0d796b_519058bb824b478990d6988ad5faf804.pdf",
  },
  {
    title: "Hyperbloom V1",
    theme: "",
    date: "October 10–12, 2025",
    status: "Registrations closed",
    href: links.closed,
    gallery: links.recap,
  },
];
export const articles = [
  {
    title: "What is the n8n hype?",
    category: "AUTOMATION",
    time: "3 min read",
    href: "https://www.hyperbloomhacks.com/post/what-is-the-n8n-hype",
    intro: "A closer look at n8n, connected apps, and the rise of workflow automation.",
  },
  {
    title: "Neural Networks: The Technology Behind Modern AI",
    category: "ARTIFICIAL INTELLIGENCE",
    time: "2 min read",
    href: "https://www.hyperbloomhacks.com/post/neural-networks-the-technology-behind-modern-ai",
    intro: "How learning patterns from data powers the AI tools we use every day.",
  },
  {
    title: "What Is an API? The Invisible Messenger Behind Modern Apps",
    category: "DEVELOPMENT",
    time: "4 min read",
    href: "https://www.hyperbloomhacks.com/post/what-is-an-api-the-invisible-messenger-behind-modern-apps",
    intro: "Understand how software connects and exchanges information.",
  },
  {
    title: "What are AI Agents and how are they impacting the world?",
    category: "ARTIFICIAL INTELLIGENCE",
    time: "2 min read",
    href: "https://www.hyperbloomhacks.com/post/what-are-ai-agents-and-how-are-they-impacting-the-world",
    intro: "Explore AI systems that take actions as well as answer questions.",
  },
];
export const offerings = [
  { title: "Skill Development", description: "Build technical and teamwork skills with workshops and mentoring." },
  { title: "Supportive Community", description: "Meet student builders, share ideas, and create together." },
  { title: "Dedicated Mentors", description: "Get guidance from a team of mentors and volunteers." },
  { title: "Impactful Projects", description: "Solve real problems with projects that help your community." },
];
export const founders = [
  { name: "Kashvi Ruparelia", bio: "High school junior working across robotics, AI/ML, and hardware–software projects, creating opportunities for young builders." },
  { name: "Kavish Jhaveri", bio: "Aspiring computer science engineer learning C, C++, HTML, Python, and Java, with interests in mathematics, guitar, and visual art." },
  { name: "Ramya Patel", bio: "Ahmedabad high school senior with experience at 4+ hackathon organizations; joined Hyperbloom in March 2026." },
];
// Complete factual profiles, paraphrased from the three original biographies.
export const teamProfiles = [
  ['A high school junior interested in technology and communities for young creators, Kashvi has hands-on experience in robotics, AI/ML and projects that connect hardware with software.', 'Through Hyperbloom, she wants students to experiment, collaborate and create useful responses to real challenges. Curiosity, teamwork and creativity guide that ambition.'],
  ['Kavish is a high school student with a strong interest in mathematics and logical problem solving who hopes to study computer science engineering. He has explored C, C++ and HTML, and is learning Python and Java.', 'He enjoys setting goals and learning independently. Guitar and visual art balance his technical interests and inform his approach to solving problems.'],
  ['Ramya is a high school senior from Ahmedabad who enjoys technology, coding and building communities. Her experience includes work with more than four hackathon organizations.', 'She joined Hyperbloom in March 2026 to help people learn, connect and create, giving innovators with an idea a place to find support and inspiration.'],
];
export function articlePath(article) { return new URL(article.href).pathname; }
export function articleForPath(path) { return articles.find(article => articlePath(article) === path.replace(/\/+$/, '')); }

export const faq = [
  {
    q: "What can I create for October?",
    a: "The October challenge focuses on UI/UX and web design. Create an original digital experience or redesign an existing one. Read the challenge brief on Devpost for the full requirements.",
    link: links.october,
    label: "Read the challenge brief",
  },
  {
    q: "Where do I register and submit?",
    a: "Registration and project submission happen on Devpost. Follow the event page, review its requirements, and submit your project before October 19, 2026 at 5 PM EDT.",
    link: links.october,
    label: "Open October on Devpost",
  },
  {
    q: "Who is eligible?",
    a: "The October Devpost listing is for students above the legal age of majority in their country of residence. Review the official eligibility rules before entering.",
    link: links.rules,
    label: "Check official eligibility",
  },
  {
    q: "Can I join if I am just getting started?",
    a: "Hyperbloom welcomes curious builders and learners. Start with the event brief and connect with the community on Discord for event updates and questions.",
    link: links.discord,
    label: "Visit the community",
  },
  {
    q: "Where can I find prize details?",
    a: "The current award descriptions are listed on the official October Devpost page. Use those descriptions and the official rules for prize amounts, credits, terms and eligibility.",
    link: links.october + "#prizes",
    label: "View the prize descriptions",
  },
];
export const media = {
  recap:
    "https://video.wixstatic.com/video/0d796b_78298a4e839a4aa8ac0223bedb5f6d5e/360p/mp4/file.mp4",
  presentations:
    "https://video.wixstatic.com/video/0d796b_341221ffadb14109aa568c93ab315e14/480p/mp4/file.mp4",
  poster:
    "https://static.wixstatic.com/media/0d796b_341221ffadb14109aa568c93ab315e14f000.jpg/v1/fill/w_708,h_304,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0d796b_341221ffadb14109aa568c93ab315e14f000.jpg",
};
