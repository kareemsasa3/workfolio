export interface Project {
  id: string;
  category: string;
  date: string;
  title: string;
  url: string;
}

export const projectsData: Project[] = [
  {
    id: "workfolio",
    category: "Portfolio",
    date: "July 2024",
    title: "WORKFOLIO",
    url: "https://github.com/kareemsasa3/workfolio",
  },
  {
    id: "curated-collectibles",
    category: "E-Commerce",
    date: "Jan. 2024",
    title: "CURATED COLLECTIBLES",
    url: "https://github.com/kareemsasa3/react-ecommerce",
  },
  {
    id: "king-of-diamonds",
    category: "Freelance",
    date: "Jan. 2023",
    title: "KING OF DIAMONDS",
    url: "https://github.com/kareemsasa3/KingOfDiamonds",
  },
  {
    id: "face-mask-detector",
    category: "Contributor",
    date: "Dec. 2022",
    title: "FACE MASK DETECTOR",
    url: "https://github.com/kareemsasa3/face-mask-detector",
  },
  {
    id: "patient-management",
    category: "Freelance",
    date: "June 2022",
    title: "PATIENT MANAGEMENT",
    url: "https://github.com/kareemsasa3/patient-management-system",
  },
];
