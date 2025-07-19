import { useRef, useCallback, useReducer, useEffect, useState } from "react";
import {
  FileSystemItem,
  HistoryEntry,
  TerminalState,
  Command,
  TabCompleteResult,
  TerminalAction,
  CommandResult,
  TypewriterEffect,
} from "../types/terminal";
import { getFileContentByPath } from "../data/fileContents";
import { manPages } from "../data/manPages";
import { generateProcessList, updateProcessList } from "../data/processData";
import { VimCommand } from "../components/Terminal/commands/VimCommand";

// Terminal reducer function
const terminalReducer = (
  state: TerminalState,
  action: TerminalAction
): TerminalState => {
  switch (action.type) {
    case "SET_COMMAND_HISTORY":
      return { ...state, commandHistory: action.payload };

    case "SET_CURRENT_COMMAND":
      return { ...state, currentCommand: action.payload };

    case "SET_SHOW_PROMPT":
      return { ...state, showPrompt: action.payload };

    case "SET_TARGET_ROUTE":
      return { ...state, targetRoute: action.payload };

    case "SET_AUTOCOMPLETE_INDEX":
      return { ...state, autocompleteIndex: action.payload };

    case "SET_CURRENT_DIRECTORY":
      return { ...state, currentDirectory: action.payload };

    case "SET_IS_MINIMIZED":
      return { ...state, isMinimized: action.payload };

    case "SET_IS_MAXIMIZED":
      return { ...state, isMaximized: action.payload };

    case "SET_SHOW_PREVIEW":
      return { ...state, showPreview: action.payload };

    case "SET_ACTIVE_TYPEWRITER":
      return { ...state, activeTypewriter: action.payload };

    case "SET_HISTORY_INDEX":
      return { ...state, historyIndex: action.payload };

    case "RESET_HISTORY_INDEX":
      return { ...state, historyIndex: -1 };

    case "START_REVERSE_SEARCH":
      return {
        ...state,
        isReverseSearch: true,
        reverseSearchTerm: "",
        reverseSearchIndex: 0,
        reverseSearchResults: [],
      };

    case "UPDATE_REVERSE_SEARCH":
      return {
        ...state,
        reverseSearchTerm: action.payload.term,
        reverseSearchResults: action.payload.results,
        reverseSearchIndex: 0, // Reset to first match when search term changes
      };

    case "SET_REVERSE_SEARCH_INDEX":
      return {
        ...state,
        reverseSearchIndex: action.payload,
      };

    case "EXIT_REVERSE_SEARCH":
      return {
        ...state,
        isReverseSearch: false,
        reverseSearchTerm: "",
        reverseSearchIndex: 0,
        reverseSearchResults: [],
      };

    case "SHOW_MAN_PAGE":
      return {
        ...state,
        isManPage: true,
        currentManPage: action.payload,
        manPageScrollPosition: 0,
      };

    case "HIDE_MAN_PAGE":
      return {
        ...state,
        isManPage: false,
        currentManPage: "",
        manPageScrollPosition: 0,
      };

    case "SET_MAN_PAGE_SCROLL":
      return {
        ...state,
        manPageScrollPosition: action.payload,
      };

    case "SHOW_TOP_COMMAND":
      return {
        ...state,
        isTopCommand: true,
        topSelectedPid: null,
      };

    case "HIDE_TOP_COMMAND":
      return {
        ...state,
        isTopCommand: false,
        topSelectedPid: null,
      };

    case "UPDATE_TOP_PROCESSES":
      return {
        ...state,
        topProcesses: action.payload,
      };

    case "SET_TOP_SORT":
      return {
        ...state,
        topSortBy: action.payload.field,
        topSortOrder: action.payload.order,
      };

    case "SET_TOP_REFRESH_RATE":
      return {
        ...state,
        topRefreshRate: action.payload,
      };

    case "SET_TOP_SELECTED_PID":
      return {
        ...state,
        topSelectedPid: action.payload,
      };

    case "ADD_HISTORY_ENTRY":
      return {
        ...state,
        commandHistory: [...state.commandHistory, action.payload],
      };

    case "CLEAR_COMMAND":
      return {
        ...state,
        currentCommand: "",
        autocompleteIndex: 0,
      };

    case "MINIMIZE_TERMINAL":
      return {
        ...state,
        isMinimized: true,
      };

    case "RESTORE_TERMINAL":
      return {
        ...state,
        isMinimized: false,
        showPreview: false,
      };

    case "MAXIMIZE_TERMINAL":
      return {
        ...state,
        isMaximized: !state.isMaximized,
        isMinimized: false, // Ensure minimized is false when maximizing
      };

    case "SHOW_PREVIEW":
      return {
        ...state,
        showPreview: true,
      };

    case "HIDE_PREVIEW":
      return {
        ...state,
        showPreview: false,
      };

    case "UPDATE_HISTORY_ENTRY":
      return {
        ...state,
        commandHistory: state.commandHistory.map((entry) =>
          entry.id === action.payload.id ? action.payload.entry : entry
        ),
      };

    case "ADD_SCRAPE_JOB":
      return {
        ...state,
        activeScrapeJobs: {
          ...state.activeScrapeJobs,
          [action.payload.jobId]: action.payload,
        },
      };

    case "UPDATE_SCRAPE_JOB":
      return {
        ...state,
        activeScrapeJobs: {
          ...state.activeScrapeJobs,
          [action.payload.jobId]: {
            ...state.activeScrapeJobs[action.payload.jobId],
            ...action.payload.updates,
          },
        },
      };

    case "REMOVE_SCRAPE_JOB":
      const { [action.payload]: removed, ...remainingJobs } =
        state.activeScrapeJobs;
      return {
        ...state,
        activeScrapeJobs: remainingJobs,
      };

    case "CREATE_VIRTUAL_FILE":
      // This will be handled by the file system context
      return state;

    case "SET_NEXT_HISTORY_ID":
      return {
        ...state,
        nextHistoryId: action.payload,
      };

    // AI Chat actions
    case "START_AI_CHAT":
      return {
        ...state,
        isAiChatting: true,
        aiInputValue: "",
      };

    case "EXIT_AI_CHAT":
      return {
        ...state,
        isAiChatting: false,
        aiInputValue: "",
      };

    case "ADD_AI_MESSAGE":
      return {
        ...state,
        aiChatHistory: [...state.aiChatHistory, action.payload],
      };

    case "SET_AI_TYPING":
      return {
        ...state,
        isAiTyping: action.payload,
      };

    case "SET_AI_INPUT_VALUE":
      return {
        ...state,
        aiInputValue: action.payload,
      };

    case "CLEAR_AI_CHAT_HISTORY":
      return {
        ...state,
        aiChatHistory: [],
      };

    // Vim editor actions removed

    case "SHOW_SCRAPE_RESULTS":
      return {
        ...state,
        showScrapeResults: true,
        scrapeResults: action.payload.results,
        currentScrapeJobId: action.payload.jobId,
      };

    case "HIDE_SCRAPE_RESULTS":
      return {
        ...state,
        showScrapeResults: false,
        scrapeResults: [],
        currentScrapeJobId: "",
      };

    case "ADD_FILE_TO_FILESYSTEM":
      // This will be handled by the file system context
      return state;

    default:
      return state;
  }
};

/*
// Note: This fileContents object is no longer used as we now use the fileContents.ts module
// Keeping for reference but marking as unused
const fileContents: Record<string, string[]> = {
  "personal-info": [
    "=== Personal Information ===",
    "",
    "Name: Kareem Sasa",
    "Title: Full Stack Developer",
    "Location: [Your Location]",
    "Email: [Your Email]",
    "",
    "About Me:",
    "I am a passionate full stack developer with expertise in modern web technologies.",
    "I love creating elegant solutions to complex problems and building user-friendly applications.",
    "My journey in software development started with curiosity and has evolved into a career",
    "filled with continuous learning and growth.",
    "",
    "Skills:",
    "- Frontend: React, TypeScript, JavaScript, HTML, CSS",
    "- Backend: Node.js, Python, Express, Django",
    "- Database: MongoDB, PostgreSQL, MySQL",
    "- DevOps: Docker, AWS, CI/CD",
    "- Tools: Git, VS Code, Figma",
    "",
    "Interests:",
    "- Web Development",
    "- Open Source Projects",
    "- Learning New Technologies",
    "- Problem Solving",
    "- User Experience Design",
    "",
    "I'm always excited to work on new projects and collaborate with talented developers.",
    "Feel free to reach out if you'd like to connect or discuss potential opportunities!",
  ],
  skills: [
    "=== Technical Skills ===",
    "",
    "Programming Languages:",
    "- JavaScript/TypeScript (Advanced)",
    "- Python (Intermediate)",
    "- Java (Intermediate)",
    "- HTML/CSS (Advanced)",
    "",
    "Frontend Technologies:",
    "- React.js & React Native",
    "- Vue.js",
    "- Angular",
    "- Next.js",
    "- Tailwind CSS",
    "- Bootstrap",
    "",
    "Backend Technologies:",
    "- Node.js & Express",
    "- Python Flask/Django",
    "- RESTful APIs",
    "- GraphQL",
    "",
    "Databases:",
    "- MongoDB",
    "- PostgreSQL",
    "- MySQL",
    "- Redis",
    "",
    "DevOps & Tools:",
    "- Docker & Kubernetes",
    "- AWS/Google Cloud",
    "- Git & GitHub",
    "- CI/CD Pipelines",
    "- Linux/Unix",
    "",
    "Other Skills:",
    "- Agile/Scrum Methodologies",
    "- Test-Driven Development",
    "- Performance Optimization",
    "- Security Best Practices",
    "- UI/UX Design Principles",
  ],
  interests: [
    "=== Personal Interests ===",
    "",
    "Technology:",
    "- Artificial Intelligence & Machine Learning",
    "- Blockchain & Web3",
    "- Mobile App Development",
    "- Cloud Computing",
    "- Cybersecurity",
    "",
    "Professional Development:",
    "- Open Source Contributions",
    "- Technical Blogging",
    "- Conference Speaking",
    "- Mentoring Junior Developers",
    "- Learning New Programming Languages",
    "",
    "Personal:",
    "- Reading Tech Books & Articles",
    "- Playing Strategy Games",
    "- Hiking & Outdoor Activities",
    "- Photography",
    "- Travel & Cultural Exploration",
    "",
    "Community:",
    "- Local Developer Meetups",
    "- Online Tech Communities",
    "- Code Review & Collaboration",
    "- Knowledge Sharing",
    "",
    "I believe in continuous learning and staying updated with the latest",
    "technologies and industry trends to deliver the best solutions.",
  ],
  "resolute consulting group": [
    "=== Resolute Consulting Group ===",
    "",
    "Role: Software Consultant",
    "Duration: 2024 - Present",
    "Location: Remote",
    "",
    "Role Overview:",
    "Leading development initiatives and architecting enterprise solutions",
    "for Fortune 500 clients in the consulting space.",
    "",
    "Key Responsibilities:",
    "- Lead development of enterprise applications for major clients",
    "- Architect scalable solutions using modern cloud technologies",
    "- Mentor junior developers and conduct technical interviews",
    "- Collaborate with cross-functional teams to deliver high-quality solutions",
    "- Implement best practices and coding standards across projects",
    "",
    "Technologies Used:",
    "- Backend: Node.js, Python, Java, Spring Boot, .NET",
    "- Frontend: React, Angular, TypeScript, JavaScript",
    "- Database: SQL Server, PostgreSQL, MongoDB, Redis",
    "- Cloud: AWS, Azure, Docker, Kubernetes",
    "- Tools: Git, Azure DevOps, Jira, Confluence",
    "",
    "Key Achievements:",
    "- Successfully delivered 8+ enterprise applications on time",
    "- Reduced deployment time by 70% through CI/CD optimization",
    "- Implemented automated testing achieving 90% code coverage",
    "- Received 'Excellence in Delivery' award for Q4 2023",
    "",
    "Client Impact:",
    "- Improved client system performance by 60%",
    "- Reduced operational costs by 40% through automation",
    "- Enhanced security posture for financial services clients",
    "",
    "Leadership:",
    "- Led technical teams of 5-8 developers",
    "- Conducted 15+ technical interviews",
    "- Established development standards and processes",
  ],
  capgemini: [
    "=== Capgemini ===",
    "",
    "Role: Full Stack Developer",
    "Duration: 2021 - 2022",
    "Location: Remote",
    "",
    "Role Overview:",
    "Developed enterprise-level applications and digital solutions",
    "for global clients in a consulting environment.",
    "",
    "Key Responsibilities:",
    "- Built scalable web applications using modern frameworks",
    "- Developed RESTful APIs and microservices architecture",
    "- Implemented CI/CD pipelines and DevOps practices",
    "- Collaborated with international teams across time zones",
    "- Participated in agile development methodologies",
    "",
    "Technologies Used:",
    "- Frontend: React, Angular, TypeScript, JavaScript, HTML5, CSS3",
    "- Backend: Java, Spring Boot, Node.js, Python",
    "- Database: Oracle, PostgreSQL, MongoDB",
    "- Cloud: AWS, Azure, Docker, Kubernetes",
    "- Tools: Git, Jenkins, Jira, Confluence",
    "",
    "Key Projects:",
    "- Banking Platform: Developed core banking features for major financial institution",
    "- E-commerce Solution: Built scalable online retail platform",
    "- Data Analytics Dashboard: Real-time business intelligence tools",
    "- Mobile App Backend: REST API for cross-platform mobile applications",
    "",
    "Achievements:",
    "- Delivered 5+ major client projects on schedule",
    "- Improved application performance by 45%",
    "- Reduced deployment time by 60% through automation",
    "- Received 'Outstanding Performance' recognition",
    "",
    "Global Collaboration:",
    "- Worked with teams across 3 continents",
    "- Contributed to knowledge sharing initiatives",
    "- Mentored junior developers in best practices",
  ],
  freelance: [
    "=== Freelance Development ===",
    "",
    "Role: Independent Software Developer",
    "Duration: 2021 - Present",
    "Location: Remote",
    "",
    "Role Overview:",
    "Providing specialized software development services to diverse clients",
    "across various industries and technology stacks.",
    "",
    "Key Responsibilities:",
    "- Develop custom web applications and mobile solutions",
    "- Provide technical consulting and architecture guidance",
    "- Implement modern development practices and best practices",
    "- Deliver end-to-end solutions from concept to deployment",
    "- Maintain and optimize existing applications",
    "",
    "Technologies Used:",
    "- Frontend: React, Vue.js, Angular, TypeScript, JavaScript",
    "- Backend: Node.js, Python, Django, Flask, Express",
    "- Database: PostgreSQL, MongoDB, MySQL, Redis",
    "- Mobile: React Native, Flutter, Ionic",
    "- Cloud: AWS, Google Cloud, Heroku, Vercel",
    "",
    "Client Projects:",
    "- E-commerce Platform: Built complete online store with payment integration",
    "- Real Estate Management System: Property listing and management platform",
    "- Healthcare Dashboard: Patient data visualization and reporting tools",
    "- Educational Platform: Learning management system for online courses",
    "- Restaurant Management: Order processing and inventory management",
    "",
    "Achievements:",
    "- Completed 25+ successful client projects",
    "- Maintained 100% client satisfaction rate",
    "- Delivered projects 15% under average industry timeline",
    "- Built long-term relationships with recurring clients",
    "",
    "Business Skills:",
    "- Project management and client communication",
    "- Technical proposal writing and cost estimation",
    "- Time management and deadline adherence",
    "- Continuous learning and skill development",
  ],
  "outlier ai": [
    "=== Outlier AI ===",
    "",
    "Role: AI/ML Engineer",
    "Duration: 2022 - 2023",
    "Location: Remote",
    "",
    "Role Overview:",
    "Developed machine learning models and AI solutions for data analysis",
    "and predictive analytics in the artificial intelligence space.",
    "",
    "Key Responsibilities:",
    "- Developed and deployed machine learning models for data analysis",
    "- Implemented natural language processing solutions",
    "- Built data pipelines and ETL processes",
    "- Collaborated with data scientists and engineers",
    "- Optimized model performance and accuracy",
    "",
    "Technologies Used:",
    "- Python: TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy",
    "- ML/AI: Natural Language Processing, Computer Vision, Deep Learning",
    "- Data Processing: Apache Spark, Kafka, Airflow",
    "- Cloud: AWS SageMaker, Google Cloud AI, Azure ML",
    "- Tools: Jupyter, Git, Docker, Kubernetes",
    "",
    "Key Projects:",
    "- Sentiment Analysis Model: Analyzed customer feedback for product insights",
    "- Recommendation System: Built personalized content recommendation engine",
    "- Data Classification Pipeline: Automated document classification system",
    "- Predictive Analytics Dashboard: Real-time business forecasting tools",
    "",
    "Achievements:",
    "- Improved model accuracy by 25% through optimization",
    "- Reduced processing time by 60% through pipeline optimization",
    "- Successfully deployed 3 production ML models",
    "- Published research paper on novel NLP approach",
    "",
    "Innovation:",
    "- Developed custom algorithms for specific business use cases",
    "- Contributed to open-source ML libraries",
    "- Mentored junior data scientists",
  ],
  "varsity tutors": [
    "=== Varsity Tutors ===",
    "",
    "Role: Software Development Intern",
    "Duration: 2021 - 2022",
    "Location: Remote / St. Louis, MO",
    "",
    "Role Overview:",
    "Gained hands-on experience in software development while contributing",
    "to educational technology platforms and learning management systems.",
    "",
    "Key Responsibilities:",
    "- Assisted in developing web applications for online education",
    "- Implemented features for virtual classroom functionality",
    "- Fixed bugs and improved application performance",
    "- Participated in code reviews and team meetings",
    "- Documented code and user guides",
    "",
    "Technologies Used:",
    "- Frontend: React, JavaScript, HTML5, CSS3",
    "- Backend: Node.js, Express, Python",
    "- Database: MongoDB, PostgreSQL",
    "- Tools: Git, VS Code, Postman, Jira",
    "",
    "Projects Contributed To:",
    "- Virtual Classroom Platform: Enhanced real-time communication features",
    "- Student Dashboard: Built personalized learning analytics interface",
    "- Tutor Matching System: Improved algorithm for student-tutor pairing",
    "- Mobile App Backend: Developed API endpoints for mobile application",
    "",
    "Learning Outcomes:",
    "- Gained practical experience with modern web technologies",
    "- Learned agile development methodologies",
    "- Improved problem-solving and debugging skills",
    "- Developed professional communication skills",
    "",
    "Impact:",
    "- Contributed to platform serving 100K+ students",
    "- Improved user experience for virtual learning",
    "- Received positive feedback from development team",
    "",
    "Growth:",
    "This role provided valuable experience in educational technology",
    "and laid the foundation for future software development opportunities.",
  ],
  "react-complete-guide": [
    "=== React Complete Guide Course ===",
    "",
    "Platform: Udemy / GitHub",
    "Instructor: Maximilian Schwarzmüller",
    "Duration: 50+ hours",
    "Status: Completed",
    "",
    "Course Overview:",
    "Comprehensive React.js course covering everything from basics to advanced",
    "concepts including hooks, context, Redux, and modern React patterns.",
    "",
    "Key Topics Covered:",
    "- React fundamentals and JSX",
    "- Components, props, and state management",
    "- React Hooks (useState, useEffect, useContext, useReducer)",
    "- Custom hooks and hook rules",
    "- Context API and state management",
    "- Redux Toolkit and async actions",
    "- React Router and navigation",
    "- Forms, validation, and user input",
    "- HTTP requests and API integration",
    "- Error handling and debugging",
    "",
    "Projects Built:",
    "- E-commerce application with cart functionality",
    "- User authentication system",
    "- Real-time chat application",
    "- Task management app with Redux",
    "",
    "Skills Acquired:",
    "- Modern React development patterns",
    "- State management best practices",
    "- Component architecture and reusability",
    "- Performance optimization techniques",
    "",
    "GitHub Repository:",
    "Access the complete course materials and projects on GitHub.",
    "Click to open the repository and explore the code examples.",
  ],
  "nodejs-masterclass": [
    "=== Node.js Masterclass Course ===",
    "",
    "Platform: Udemy / GitHub",
    "Instructor: Andrew Mead",
    "Duration: 40+ hours",
    "Status: Completed",
    "",
    "Course Overview:",
    "Complete Node.js course covering server-side JavaScript development,",
    "including Express.js, MongoDB, authentication, and deployment.",
    "",
    "Key Topics Covered:",
    "- Node.js fundamentals and event loop",
    "- Express.js framework and middleware",
    "- RESTful API development",
    "- MongoDB and Mongoose ODM",
    "- User authentication and authorization",
    "- File uploads and data validation",
    "- Testing with Jest and Supertest",
    "- Error handling and logging",
    "- Deployment and production setup",
    "- Security best practices",
    "",
    "Projects Built:",
    "- Task management API with authentication",
    "- Weather application with external APIs",
    "- Chat application with Socket.io",
    "- E-commerce backend with payment integration",
    "",
    "Skills Acquired:",
    "- Server-side JavaScript development",
    "- API design and documentation",
    "- Database design and optimization",
    "- Authentication and security implementation",
    "",
    "GitHub Repository:",
    "Access the complete course materials and projects on GitHub.",
    "Click to open the repository and explore the backend code.",
  ],
  "typescript-fundamentals": [
    "=== TypeScript Fundamentals Course ===",
    "",
    "Platform: Frontend Masters / GitHub",
    "Instructor: Mike North",
    "Duration: 6+ hours",
    "Status: Completed",
    "",
    "Course Overview:",
    "Comprehensive TypeScript course covering type system fundamentals,",
    "advanced patterns, and real-world application development.",
    "",
    "Key Topics Covered:",
    "- TypeScript basics and type annotations",
    "- Interfaces and type aliases",
    "- Generics and advanced types",
    "- Union and intersection types",
    "- Type guards and narrowing",
    "- Decorators and metadata",
    "- Module systems and namespaces",
    "- Configuration and compilation",
    "- Integration with React and Node.js",
    "- Best practices and patterns",
    "",
    "Projects Built:",
    "- Type-safe API client library",
    "- React application with TypeScript",
    "- Node.js backend with type safety",
    "- Utility library with generics",
    "",
    "Skills Acquired:",
    "- Strong typing and type safety",
    "- Advanced TypeScript patterns",
    "- Integration with existing JavaScript code",
    "- Type system design and architecture",
    "",
    "GitHub Repository:",
    "Access the complete course materials and projects on GitHub.",
    "Click to open the repository and explore the TypeScript examples.",
  ],
  "python-data-science": [
    "=== Python Data Science Course ===",
    "",
    "Platform: Coursera / GitHub",
    "Instructor: Dr. Charles Severance",
    "Duration: 30+ hours",
    "Status: Completed",
    "",
    "Course Overview:",
    "Comprehensive data science course covering Python programming,",
    "data analysis, visualization, and machine learning fundamentals.",
    "",
    "Key Topics Covered:",
    "- Python programming fundamentals",
    "- Data manipulation with Pandas",
    "- Data visualization with Matplotlib and Seaborn",
    "- Statistical analysis and hypothesis testing",
    "- Machine learning with Scikit-learn",
    "- Data cleaning and preprocessing",
    "- Exploratory data analysis (EDA)",
    "- Jupyter notebooks and data storytelling",
    "- SQL and database integration",
    "- Big data tools and techniques",
    "",
    "Projects Built:",
    "- Data analysis dashboard",
    "- Machine learning model for prediction",
    "- Data visualization portfolio",
    "- Automated data processing pipeline",
    "",
    "Skills Acquired:",
    "- Data analysis and manipulation",
    "- Statistical modeling and inference",
    "- Machine learning fundamentals",
    "- Data visualization and storytelling",
    "",
    "GitHub Repository:",
    "Access the complete course materials and projects on GitHub.",
    "Click to open the repository and explore the data science projects.",
  ],
  "aws-cloud-practitioner": [
    "=== AWS Cloud Practitioner Course ===",
    "",
    "Platform: AWS Training / GitHub",
    "Instructor: AWS Official",
    "Duration: 20+ hours",
    "Status: Completed",
    "",
    "Course Overview:",
    "AWS Cloud Practitioner certification course covering cloud fundamentals,",
    "AWS services, security, and best practices for cloud architecture.",
    "",
    "Key Topics Covered:",
    "- Cloud computing fundamentals",
    "- AWS global infrastructure",
    "- Core AWS services (EC2, S3, RDS, Lambda)",
    "- Security and compliance",
    "- Pricing and cost optimization",
    "- Well-Architected Framework",
    "- AWS CLI and SDKs",
    "- Monitoring and logging",
    "- Disaster recovery and backup",
    "- DevOps and CI/CD practices",
    "",
    "Projects Built:",
    "- Multi-tier web application deployment",
    "- Serverless application with Lambda",
    "- Automated backup and recovery system",
    "- Cloud monitoring and alerting setup",
    "",
    "Skills Acquired:",
    "- AWS service architecture",
    "- Cloud security best practices",
    "- Cost optimization strategies",
    "- Infrastructure as Code (IaC)",
    "",
    "GitHub Repository:",
    "Access the complete course materials and projects on GitHub.",
    "Click to open the repository and explore the AWS infrastructure code.",
  ],
};
*/

// Helper function to create properly typed history entries
const createHistoryEntry = (
  text: string,
  type?: "error" | "success" | "info" | "command",
  useTypewriter?: boolean,
  id?: number,
  highlightedText?: string
): HistoryEntry => ({
  id: id || 0, // Will be set by the caller
  text,
  type,
  useTypewriter,
  highlightedText,
});

// Shared helper function to get items in current directory
const getCurrentDirectoryItems = (
  fileSystem: FileSystemItem[],
  currentDir: string
): FileSystemItem[] => {
  if (currentDir === "/") {
    return fileSystem;
  }

  const pathParts = currentDir.split("/").filter((part) => part);
  let currentItems = fileSystem;

  for (const part of pathParts) {
    const item = currentItems.find((item) => item.name === part);
    if (item && item.type === "directory" && item.children) {
      currentItems = item.children;
    } else {
      return [];
    }
  }

  return currentItems;
};

// Individual Command Implementations
class LsCommand implements Command {
  name = "ls";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];

    const currentItems = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const showHidden = args.includes("-a");
    const showDetails = args.includes("-l");

    // Get items to display (including hidden if -a flag is used)
    let itemsToShow = [...currentItems];
    if (showHidden) {
      itemsToShow = [
        {
          name: ".",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
        },
        {
          name: "..",
          type: "directory",
          permissions: "drwxr-xr-x",
          size: "4096",
          date: "Dec 15 10:30",
        },
        ...currentItems,
      ];
    }

    if (showDetails) {
      // Show detailed format
      newHistory.push(createHistoryEntry("total 32", "info"));
      itemsToShow.forEach((item) => {
        const icon = item.type === "directory" ? "📁" : "📄";
        newHistory.push(
          createHistoryEntry(
            `${item.permissions} 1 user group ${item.size.padStart(8)} ${
              item.date
            } ${icon} ${item.name}`,
            "info"
          )
        );
      });
    } else {
      // Show simple format
      const names = itemsToShow.map((item) => item.name);
      newHistory.push(createHistoryEntry(names.join("  "), "info"));
    }

    return newHistory;
  }

  getSuggestions(input: string): string[] {
    const suggestions = [];
    if (input.toLowerCase().startsWith("ls")) {
      suggestions.push("ls", "ls -l", "ls -a", "ls -al");
    }
    return suggestions.filter((s) =>
      s.toLowerCase().startsWith(input.toLowerCase())
    );
  }
}

class CdCommand implements Command {
  name = "cd";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string,
    onNavigate?: (route: string) => void
  ): HistoryEntry[] {
    const newHistory = [...history];
    const target = args[0];

    // Handle special cases
    if (!target || target === "~") {
      // Go to home directory (root)
      dispatch({ type: "SET_CURRENT_DIRECTORY", payload: "/" });
      newHistory.push(
        createHistoryEntry("Changed to home directory", "success")
      );
      return newHistory;
    }

    if (target === "..") {
      // Go up one directory
      if (currentDirectory === "/") {
        newHistory.push(
          createHistoryEntry("Already at root directory", "info")
        );
        return newHistory;
      }
      const newPath = currentDirectory.split("/").slice(0, -1).join("/") || "/";
      dispatch({ type: "SET_CURRENT_DIRECTORY", payload: newPath });
      newHistory.push(createHistoryEntry(`Changed to ${newPath}`, "success"));
      return newHistory;
    }

    // Helper function to find item by path
    const findItemByPath = (path: string): FileSystemItem | null => {
      if (path === "/") return null;

      const pathParts = path.split("/").filter((part) => part);
      let currentItems = fileSystem;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const item = currentItems.find((item) => item.name === part);

        if (!item) return null;

        if (i === pathParts.length - 1) {
          return item;
        }

        if (item.type === "directory" && item.children) {
          currentItems = item.children;
        } else {
          return null;
        }
      }

      return null;
    };

    const currentItems = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const item = currentItems.find((fs) => fs.name === target);

    if (item && item.type === "directory") {
      // Check if this is a project directory with a GitHub URL
      if (item.githubUrl) {
        newHistory.push(
          createHistoryEntry(`Opening ${target} on GitHub...`, "info")
        );
        newHistory.push(
          createHistoryEntry(
            `Access granted. Redirecting to GitHub repository.`,
            "success"
          )
        );
        // Open GitHub URL in a new tab
        setTimeout(() => {
          window.open(item.githubUrl, "_blank");
        }, 1500);
      } else {
        // Regular directory navigation
        const newPath =
          currentDirectory === "/"
            ? `/${target}`
            : `${currentDirectory}/${target}`;
        dispatch({ type: "SET_CURRENT_DIRECTORY", payload: newPath });
        newHistory.push(createHistoryEntry(`Changed to ${newPath}`, "success"));
      }
    } else if (item && item.type === "file") {
      newHistory.push(
        createHistoryEntry(
          `Error: ${target} is a file, not a directory.`,
          "error"
        )
      );
    } else {
      // Check if this is a path to a project directory that should open a page or GitHub
      const fullPath =
        currentDirectory === "/"
          ? `/${target}`
          : `${currentDirectory}/${target}`;
      const pathItem = findItemByPath(fullPath);

      if (pathItem && pathItem.githubUrl) {
        // This is a project directory with a GitHub URL
        const projectName = target.split("/").pop() || target;
        newHistory.push(
          createHistoryEntry(`Opening ${projectName} on GitHub...`, "info")
        );
        newHistory.push(
          createHistoryEntry(
            `Access granted. Redirecting to GitHub repository.`,
            "success"
          )
        );
        // Open GitHub URL in a new tab
        setTimeout(() => {
          window.open(pathItem.githubUrl, "_blank");
        }, 1500);
      } else if (pathItem && pathItem.route) {
        // This is a file or directory that should open a page
        newHistory.push(createHistoryEntry(`Opening ${target}...`, "info"));
        newHistory.push(
          createHistoryEntry(
            `Access granted. Opening ${target} page.`,
            "success"
          )
        );
        const route = `/${pathItem.route}`;
        // Navigate directly instead of using fade out
        if (onNavigate) {
          setTimeout(() => {
            onNavigate(route);
          }, 1500);
        }
      } else {
        newHistory.push(
          createHistoryEntry(`Error: Directory '${target}' not found.`, "error")
        );
        newHistory.push(
          createHistoryEntry(
            `Available directories: ${currentItems
              .filter((fs) => fs.type === "directory")
              .map((fs) => fs.name)
              .join(", ")}`,
            "info"
          )
        );
      }
    }

    return newHistory;
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    if (input.toLowerCase().startsWith("cd ")) {
      const partialDir = input.substring(3).trim();
      const currentItems = getCurrentDirectoryItems(
        fileSystem,
        currentDirectory
      );
      return currentItems
        .filter((item) =>
          item.name.toLowerCase().startsWith(partialDir.toLowerCase())
        )
        .map((item) => `cd ${item.name}`);
    }
    return [];
  }
}

class HelpCommand implements Command {
  name = "help";

  execute(_args: string[], history: HistoryEntry[]): HistoryEntry[] {
    const newHistory = [...history];
    newHistory.push(createHistoryEntry("Available commands:", "success"));
    newHistory.push(
      createHistoryEntry("  ls         List files and directories", "info")
    );
    newHistory.push(
      createHistoryEntry("  cd <dir>   Navigate to directory", "info")
    );
    newHistory.push(
      createHistoryEntry("  pwd        Show current working directory", "info")
    );
    newHistory.push(
      createHistoryEntry(
        "  cat <file> View file contents or open file page",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "  grep <pattern> <file> Search for text pattern in file",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "  wc [file]  Count lines, words, and characters",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry("  history    Show command history", "info")
    );
    newHistory.push(
      createHistoryEntry(
        "  man <cmd>  Show detailed manual for command",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry("  top        System process monitor", "info")
    );
    newHistory.push(
      createHistoryEntry(
        "  curl <urls> Submit web scraping job to Arachne service",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "  arachne     Web scraping service with real-time tracking",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "  ai [message] Start AI chat assistant with optional initial message",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "  exit [route] Close terminal and go to specified page (default: home)",
        "info"
      )
    );
    newHistory.push(createHistoryEntry("", "info"));
    newHistory.push(
      createHistoryEntry(
        "Piping: Use | to chain commands (e.g., grep 'pattern' file | wc -l)",
        "success"
      )
    );
    newHistory.push(
      createHistoryEntry("  help       Show this help message", "info")
    );
    newHistory.push(createHistoryEntry("  clear      Clear terminal", "info"));
    newHistory.push(createHistoryEntry("", "info"));
    newHistory.push(
      createHistoryEntry(
        "Navigation: Use ↑/↓ arrow keys to browse command history",
        "success"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "Search: Press Ctrl+R for reverse-i-search in command history",
        "success"
      )
    );
    newHistory.push(
      createHistoryEntry(
        "Tip: Press Tab to autocomplete commands and directory names",
        "success"
      )
    );
    newHistory.push(createHistoryEntry("", "info"));
    newHistory.push(
      createHistoryEntry(
        "For detailed command options and examples, use: man <command>",
        "success"
      )
    );
    return newHistory;
  }
}

class ClearCommand implements Command {
  name = "clear";

  execute(
    _args: string[],
    _history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string
  ): HistoryEntry[] {
    // Stop any active typewriter animation
    dispatch({ type: "SET_ACTIVE_TYPEWRITER", payload: false });
    return [];
  }
}

class PwdCommand implements Command {
  name = "pwd";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];
    const displayPath = currentDirectory === "/" ? "/" : currentDirectory;
    newHistory.push(createHistoryEntry(displayPath, "info"));
    return newHistory;
  }
}

class ExitCommand implements Command {
  name = "exit";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string,
    onNavigate?: (route: string) => void
  ): HistoryEntry[] {
    const newHistory = [...history];
    const targetRoute = args[0] || "/"; // Allow specifying a target route

    newHistory.push(createHistoryEntry("Closing terminal...", "info"));
    newHistory.push(
      createHistoryEntry(
        `Access granted. Opening ${
          targetRoute === "/" ? "home" : targetRoute
        } page.`,
        "success"
      )
    );

    // Navigate directly instead of using fade out
    if (onNavigate) {
      setTimeout(() => {
        onNavigate(targetRoute);
      }, 1000);
    }

    return newHistory;
  }
}

class TopCommand implements Command {
  name = "top";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void
  ): HistoryEntry[] {
    const newHistory = [...history];

    // Parse arguments
    const refreshRate = args.find((arg) => arg.startsWith("-d"))?.split("=")[1];
    const parsedRefreshRate = refreshRate ? parseInt(refreshRate) * 1000 : 1000;

    newHistory.push(createHistoryEntry("Starting system monitor...", "info"));
    newHistory.push(
      createHistoryEntry("Press 'q' to quit, 'k' to kill process", "info")
    );

    // Show the top command interface
    dispatch({ type: "SHOW_TOP_COMMAND" });
    dispatch({ type: "SET_TOP_REFRESH_RATE", payload: parsedRefreshRate });

    return newHistory;
  }

  getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    if (input.toLowerCase().startsWith("top ")) {
      const afterTop = input.substring(4).trim();
      if (afterTop.startsWith("-d=")) {
        suggestions.push("top -d=1");
        suggestions.push("top -d=2");
        suggestions.push("top -d=3");
      } else if (afterTop === "-d") {
        suggestions.push("top -d=1");
        suggestions.push("top -d=2");
        suggestions.push("top -d=3");
      }
    }
    return suggestions.filter((s) =>
      s.toLowerCase().startsWith(input.toLowerCase())
    );
  }
}

class CatCommand implements Command {
  name = "cat";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string,
    onNavigate?: (route: string) => void,
    _state?: TerminalState,
    _stdin?: string[],
    getFileContent?: (path: string) => { content: string[] } | null
  ): CommandResult {
    const newHistory = [...history];
    // Handle quoted filenames by joining args and removing quotes
    const filename = args.join(" ").replace(/^["']|["']$/g, "");

    if (!filename) {
      newHistory.push(
        createHistoryEntry("Error: Please specify a file to view", "error")
      );
      return newHistory;
    }

    // Resolve the file path using the same logic as other commands
    let resolvedPath = filename;
    if (!filename.startsWith("/")) {
      resolvedPath =
        currentDirectory === "/" ? filename : `${currentDirectory}/${filename}`;
    } else {
      resolvedPath = filename.substring(1);
    }

    // Find the file in the file system
    const pathParts = resolvedPath.split("/").filter((part) => part);
    let currentItems = fileSystem;
    let file = null;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const item = currentItems.find((item) => item.name === part);

      if (!item) {
        newHistory.push(
          createHistoryEntry(`Error: File '${filename}' not found`, "error")
        );
        return newHistory;
      }

      if (i === pathParts.length - 1) {
        // This is the target file
        file = item;
      } else if (item.type === "directory" && item.children) {
        // Navigate deeper into the directory structure
        currentItems = item.children;
      } else {
        // Hit a file when we expected a directory
        newHistory.push(
          createHistoryEntry(`Error: '${filename}' not found`, "error")
        );
        return newHistory;
      }
    }

    if (!file || file.type !== "file") {
      newHistory.push(
        createHistoryEntry(`Error: '${filename}' is not a file`, "error")
      );
      return newHistory;
    }

    // Check if this file has a GitHub URL first (for course files that should redirect)
    if (file.githubUrl) {
      newHistory.push(
        createHistoryEntry(`Opening ${filename} on GitHub...`, "info")
      );
      newHistory.push(
        createHistoryEntry(
          `Access granted. Redirecting to GitHub repository.`,
          "success"
        )
      );
      // Open GitHub URL in a new tab
      setTimeout(() => {
        window.open(file.githubUrl, "_blank");
      }, 1500);
      return newHistory;
    } else {
      // Check if we have content for this specific file
      // Resolve the full path for content lookup
      let resolvedPath = filename;
      if (!filename.startsWith("/")) {
        resolvedPath =
          currentDirectory === "/"
            ? filename
            : `${currentDirectory}/${filename}`;
      } else {
        resolvedPath = filename.substring(1);
      }

      const fileContent = getFileContent
        ? getFileContent(resolvedPath)
        : getFileContentByPath(resolvedPath);
      if (fileContent) {
        // Check if we're in a pipe context by looking at the command history
        // If the last command entry contains a pipe, we're in a pipe
        const isInPipe = newHistory.some((entry) => entry.text.includes("|"));

        if (isInPipe) {
          // Being used in a pipe - return content as stdout
          return {
            history: newHistory,
            stdout: fileContent.content,
          };
        } else {
          // Normal display - return typewriter effect
          return {
            _effect: "TYPEWRITER",
            lines: fileContent.content,
          };
        }
      } else if (file.route) {
        // This is a file that should open a page (only if no specific content is defined)
        newHistory.push(createHistoryEntry(`Opening ${filename}...`, "info"));
        newHistory.push(
          createHistoryEntry(
            `Access granted. Opening ${filename} page.`,
            "success"
          )
        );
        const route = `/${file.route}`;
        // Navigate directly instead of using fade out
        if (onNavigate) {
          setTimeout(() => {
            onNavigate(route);
          }, 1500);
        }
        return newHistory;
      } else {
        // Show file contents (simulated) for files without specific content
        const defaultContent = [
          `--- ${filename} ---`,
          `File size: ${file.size}`,
          `Last modified: ${file.date}`,
          `Permissions: ${file.permissions}`,
          "",
          "(File content would be displayed here)",
        ];

        // Return typewriter effect for default content
        return {
          _effect: "TYPEWRITER",
          lines: defaultContent,
        };
      }
    }
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    if (input.toLowerCase().startsWith("cat ")) {
      const partialFile = input.substring(4);

      // Check if the partial file starts with a quote
      const isQuoted =
        partialFile.startsWith('"') || partialFile.startsWith("'");
      const searchTerm = isQuoted ? partialFile.slice(1) : partialFile;

      const currentItems = getCurrentDirectoryItems(
        fileSystem,
        currentDirectory
      );
      return currentItems
        .filter(
          (item) =>
            item.type === "file" &&
            item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        .map((item) => {
          // If the original input was quoted, keep it quoted
          // If the filename contains spaces, wrap in quotes
          let displayName = item.name;
          if (isQuoted || item.name.includes(" ")) {
            displayName = `"${item.name}"`;
          }
          return `cat ${displayName}`;
        });
    }
    return [];
  }
}

class GrepCommand implements Command {
  name = "grep";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string,
    _onNavigate?: (route: string) => void,
    _state?: TerminalState,
    stdin?: string[],
    getFileContent?: (path: string) => { content: string[] } | null
  ): CommandResult {
    const newHistory = [...history];

    // Parse arguments - handle quoted search terms
    let searchTerm = args[0];
    let filePath = args[1];

    // Remove quotes from search term if present
    if (
      searchTerm &&
      (searchTerm.startsWith('"') || searchTerm.startsWith("'"))
    ) {
      searchTerm = searchTerm.slice(1, -1);
    }

    // Handle case where search term and file path might be combined
    if (!filePath && args.length > 1) {
      // If no separate filePath, the second part might be the file path
      filePath = args.slice(1).join(" ");
    }

    if (!searchTerm) {
      newHistory.push(
        createHistoryEntry("Usage: grep <pattern> <file>", "error")
      );
      return { history: newHistory };
    }

    // Determine input source: stdin or file
    let inputLines: string[] = [];

    if (stdin && stdin.length > 0) {
      // Use stdin if provided (for piping)
      inputLines = stdin;
    } else if (filePath) {
      // Use file if specified
      let resolvedPath = filePath;
      if (!filePath.startsWith("/")) {
        // Relative path - resolve from current directory
        resolvedPath =
          currentDirectory === "/"
            ? filePath
            : `${currentDirectory}/${filePath}`;
      } else {
        // Remove leading slash for absolute paths to match file content paths
        resolvedPath = filePath.substring(1);
      }

      const fileContent = getFileContent
        ? getFileContent(resolvedPath)
        : getFileContentByPath(resolvedPath);
      if (!fileContent) {
        newHistory.push(
          createHistoryEntry(
            `grep: ${filePath}: No such file or directory`,
            "error"
          )
        );
        return { history: newHistory };
      }
      inputLines = fileContent.content;
    } else {
      newHistory.push(
        createHistoryEntry("Usage: grep <pattern> <file>", "error")
      );
      return { history: newHistory };
    }

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(searchTerm, "gi");
    const matchingLines: HistoryEntry[] = [];
    const stdoutLines: string[] = [];

    // Search through each line
    inputLines.forEach((line, lineIndex) => {
      if (searchRegex.test(line)) {
        // Create highlighted version of the line
        const highlightedLine = line.replace(
          new RegExp(searchTerm, "gi"),
          (match) => `\x1b[1;31m${match}\x1b[0m` // ANSI color codes for highlighting
        );

        const outputLine = `${lineIndex + 1}:${highlightedLine}`;
        matchingLines.push(
          createHistoryEntry(outputLine, "info", false, 0, highlightedLine)
        );
        stdoutLines.push(outputLine);
      }
    });

    if (matchingLines.length === 0) {
      // grep returns nothing on no match (no error, just no output)
      return { history: newHistory, stdout: [] };
    }

    // Add all matching lines to history
    newHistory.push(...matchingLines);
    return { history: newHistory, stdout: stdoutLines };
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    if (input.toLowerCase().startsWith("grep ")) {
      const afterGrep = input.substring(5).trim();
      const parts = afterGrep.split(" ");

      if (parts.length === 1 && parts[0]) {
        // User has typed search term, suggest files
        const currentItems = getCurrentDirectoryItems(
          fileSystem,
          currentDirectory
        );
        return currentItems
          .filter((item) => item.type === "file")
          .map((item) => `grep ${parts[0]} ${item.name}`);
      }
    }
    return [];
  }
}

class WcCommand implements Command {
  name = "wc";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string,
    _onNavigate?: (route: string) => void,
    _state?: TerminalState,
    stdin?: string[],
    getFileContent?: (path: string) => { content: string[] } | null
  ): CommandResult {
    const newHistory = [...history];

    // Parse flags
    const countLines = args.includes("-l");
    const countWords = args.includes("-w");
    const countChars = args.includes("-c");
    const countBytes = args.includes("-m");

    // If no specific flags, count all (lines, words, chars)
    const shouldCountLines =
      countLines || (!countLines && !countWords && !countChars && !countBytes);
    const shouldCountWords =
      countWords || (!countLines && !countWords && !countChars && !countBytes);
    const shouldCountChars =
      countChars || (!countLines && !countWords && !countChars && !countBytes);

    // Get input lines from stdin or file
    let inputLines: string[] = [];
    let _sourceName = "";

    if (stdin && stdin.length > 0) {
      // Use stdin if provided (for piping)
      inputLines = stdin;
      _sourceName = "";
    } else {
      // Look for file argument
      const fileArg = args.find((arg) => !arg.startsWith("-"));
      if (fileArg) {
        let resolvedPath = fileArg;
        if (!fileArg.startsWith("/")) {
          resolvedPath =
            currentDirectory === "/"
              ? fileArg
              : `${currentDirectory}/${fileArg}`;
        } else {
          resolvedPath = fileArg.substring(1);
        }

        const fileContent = getFileContent
          ? getFileContent(resolvedPath)
          : getFileContentByPath(resolvedPath);
        if (!fileContent) {
          newHistory.push(
            createHistoryEntry(
              `wc: ${fileArg}: No such file or directory`,
              "error"
            )
          );
          return { history: newHistory };
        }
        inputLines = fileContent.content;
        _sourceName = fileArg;
      } else {
        newHistory.push(
          createHistoryEntry("Usage: wc [-lwc] [file...]", "error")
        );
        return { history: newHistory };
      }
    }

    // Calculate counts
    const lineCount = inputLines.length;
    const wordCount = inputLines.reduce((total, line) => {
      return (
        total +
        line
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      );
    }, 0);
    const charCount = inputLines.reduce(
      (total, line) => total + line.length,
      0
    );

    // Format output
    let output = "";
    if (shouldCountLines) output += `${lineCount}`;
    if (shouldCountWords) output += `${output ? " " : ""}${wordCount}`;
    if (shouldCountChars) output += `${output ? " " : ""}${charCount}`;
    if (_sourceName) output += ` ${_sourceName}`;

    newHistory.push(createHistoryEntry(output, "info"));
    return { history: newHistory, stdout: [output] };
  }

  getSuggestions(
    input: string,
    fileSystem: FileSystemItem[],
    currentDirectory: string
  ): string[] {
    if (input.toLowerCase().startsWith("wc ")) {
      const afterWc = input.substring(3).trim();
      const parts = afterWc.split(" ");

      // If no flags, suggest flags
      if (parts.length === 0 || !parts[0].startsWith("-")) {
        return ["wc -l", "wc -w", "wc -c", "wc -l -w -c"];
      }

      // If flags are present, suggest files
      const currentItems = getCurrentDirectoryItems(
        fileSystem,
        currentDirectory
      );
      return currentItems
        .filter((item) => item.type === "file")
        .map((item) => `wc ${afterWc} ${item.name}`);
    }
    return [];
  }
}

class HistoryCommand implements Command {
  name = "history";

  execute(
    _args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];

    // Filter to only show actual commands (entries that start with "$ ")
    const commands = history
      .filter((entry) => entry.text.startsWith("$ "))
      .map((entry) => entry.text.substring(2)); // Remove "$ " prefix

    if (commands.length === 0) {
      newHistory.push(createHistoryEntry("No command history found.", "info"));
      return newHistory;
    }

    // Display numbered list of commands
    newHistory.push(createHistoryEntry("Command History:", "info"));
    commands.forEach((command, index) => {
      newHistory.push(
        createHistoryEntry(
          `${(index + 1).toString().padStart(3)}  ${command}`,
          "info"
        )
      );
    });

    return newHistory;
  }

  getSuggestions(input: string): string[] {
    const suggestions = [];
    if (input.toLowerCase().startsWith("history")) {
      suggestions.push("history");
    }
    return suggestions.filter((s) =>
      s.toLowerCase().startsWith(input.toLowerCase())
    );
  }
}

class ManCommand implements Command {
  name = "man";

  execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string
  ): HistoryEntry[] {
    const newHistory = [...history];
    const commandName = args[0];

    if (!commandName) {
      newHistory.push(
        createHistoryEntry("Error: Please specify a command name", "error")
      );
      newHistory.push(createHistoryEntry("Usage: man <command>", "info"));
      return newHistory;
    }

    // Check if the man page exists
    const manPage = manPages[commandName];
    if (!manPage) {
      newHistory.push(
        createHistoryEntry(`Error: No manual entry for ${commandName}`, "error")
      );
      newHistory.push(createHistoryEntry("Available manual pages:", "info"));
      const availablePages = Object.keys(manPages).join(", ");
      newHistory.push(createHistoryEntry(availablePages, "info"));
      return newHistory;
    }

    // Show the man page
    dispatch({ type: "SHOW_MAN_PAGE", payload: commandName });
    return newHistory;
  }

  getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    if (input.toLowerCase().startsWith("man ")) {
      const afterMan = input.substring(4).trim();
      Object.keys(manPages).forEach((command) => {
        if (command.toLowerCase().startsWith(afterMan.toLowerCase())) {
          suggestions.push(`man ${command}`);
        }
      });
    } else if (input.toLowerCase().startsWith("man")) {
      // Suggest man command with available pages
      Object.keys(manPages).forEach((command) => {
        suggestions.push(`man ${command}`);
      });
    }
    return suggestions.filter((s) =>
      s.toLowerCase().startsWith(input.toLowerCase())
    );
  }
}

const availableCommands = [
  "ls",
  "ls -l",
  "ls -a",
  "ls -al",
  "cd",
  "help",
  "clear",
  "pwd",
  "cat",
  "grep",
  "wc",
  "wc -l",
  "wc -w",
  "wc -c",
  "history",
  "man",
  "top",
  "top -d=1",
  "top -d=2",
  "top -d=3",
  "exit",
  "curl",
  "arachne",
  "arachne help",
  "arachne scrape",
  "arachne status",
  "arachne jobs",
  "ai",
  'ai "Tell me about this portfolio"',
  'ai "What technologies did you use?"',
  'ai "How does the terminal work?"',
  "vim",
];

class CurlCommand implements Command {
  name = "curl";

  async execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void,
    state?: TerminalState
  ): Promise<HistoryEntry[]> {
    const newHistory = [...history];

    // Parse URLs from arguments
    const urls: string[] = [];
    for (const arg of args) {
      // Remove quotes from the argument
      const cleanArg = arg.replace(/^["']|["']$/g, "");
      if (cleanArg.startsWith("http://") || cleanArg.startsWith("https://")) {
        urls.push(cleanArg);
      }
    }

    if (urls.length === 0) {
      newHistory.push(
        createHistoryEntry(
          "curl: No valid URLs provided. Usage: curl <url1> [url2] [url3] ...",
          "error"
        )
      );
      return newHistory;
    }

    try {
      // Import the API functions
      const { submitScrapeJob } = await import("../services/arachneApi");

      // Submit the scraping job
      const response = await submitScrapeJob(urls);

      // Create initial success message
      const historyId = state?.nextHistoryId || 1;
      const successEntry = createHistoryEntry(
        `🌐 Submitting job for ${urls.length} URL${
          urls.length > 1 ? "s" : ""
        }... Success! Job ID: ${response.job_id}`,
        "success",
        false,
        historyId
      );

      // Add the job to active jobs
      if (state) {
        dispatch({
          type: "ADD_SCRAPE_JOB",
          payload: {
            jobId: response.job_id,
            status: "submitted",
            historyEntryId: historyId,
            urls,
            startTime: Date.now(),
          },
        });

        // Increment the history ID
        dispatch({
          type: "SET_NEXT_HISTORY_ID",
          payload: historyId + 1,
        });
      }

      newHistory.push(successEntry);
      return newHistory;
    } catch (error) {
      newHistory.push(
        createHistoryEntry(
          `curl: Failed to submit scraping job: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "error"
        )
      );
      return newHistory;
    }
  }

  getSuggestions(input: string): string[] {
    if (input.toLowerCase().startsWith("curl ")) {
      const afterCurl = input.substring(5).trim();
      if (!afterCurl) {
        return [
          "curl https://example.com",
          "curl https://google.com https://github.com",
          "curl https://news.ycombinator.com",
        ];
      }
    }
    return [];
  }
}

class ArachneCommand implements Command {
  name = "arachne";

  async execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void,
    state?: TerminalState
  ): Promise<HistoryEntry[]> {
    const newHistory = [...history];

    if (args.length === 0) {
      newHistory.push(
        createHistoryEntry(
          `🌐 Arachne Web Scraper v2.0.0

Usage:
  arachne scrape <url1> [url2] [url3] ...  Submit scraping job
  arachne status <job_id>                   Check job status
  arachne jobs                              List active jobs
  arachne help                              Show this help

Examples:
  arachne scrape https://example.com
  arachne scrape https://google.com https://github.com
  arachne status 2c424e7e-18dc-44b2-a37a-cd757916febc
  arachne jobs`,
          "info"
        )
      );
      return newHistory;
    }

    const subcommand = args[0].toLowerCase();

    switch (subcommand) {
      case "scrape":
        return await this.handleScrape(
          args.slice(1),
          newHistory,
          dispatch,
          state
        );
      case "status":
        return await this.handleStatus(args.slice(1), newHistory);
      case "jobs":
        return this.handleJobs(newHistory, state);
      case "help":
        return this.handleHelp(newHistory);
      default:
        newHistory.push(
          createHistoryEntry(
            `arachne: Unknown subcommand '${subcommand}'. Use 'arachne help' for usage.`,
            "error"
          )
        );
        return newHistory;
    }
  }

  private async handleScrape(
    args: string[],
    history: HistoryEntry[],
    dispatch: React.Dispatch<TerminalAction>,
    state?: TerminalState
  ): Promise<HistoryEntry[]> {
    const urls: string[] = [];
    for (const arg of args) {
      const cleanArg = arg.replace(/^["']|["']$/g, "");
      if (cleanArg.startsWith("http://") || cleanArg.startsWith("https://")) {
        urls.push(cleanArg);
      }
    }

    if (urls.length === 0) {
      history.push(
        createHistoryEntry(
          "arachne scrape: No valid URLs provided. Usage: arachne scrape <url1> [url2] [url3] ...",
          "error"
        )
      );
      return history;
    }

    try {
      const { submitScrapeJob } = await import("../services/arachneApi");
      const response = await submitScrapeJob(urls);

      const historyId = state?.nextHistoryId || 1;
      const successEntry = createHistoryEntry(
        `🌐 Submitting scraping job for ${urls.length} URL${
          urls.length > 1 ? "s" : ""
        }... Success! Job ID: ${response.job_id}`,
        "success",
        false,
        historyId
      );

      if (state) {
        dispatch({
          type: "ADD_SCRAPE_JOB",
          payload: {
            jobId: response.job_id,
            status: "submitted",
            historyEntryId: historyId,
            urls,
            startTime: Date.now(),
          },
        });

        dispatch({
          type: "SET_NEXT_HISTORY_ID",
          payload: historyId + 1,
        });
      }

      history.push(successEntry);
      return history;
    } catch (error) {
      history.push(
        createHistoryEntry(
          `arachne scrape: Failed to submit job: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "error"
        )
      );
      return history;
    }
  }

  private async handleStatus(
    args: string[],
    history: HistoryEntry[]
  ): Promise<HistoryEntry[]> {
    if (args.length === 0) {
      history.push(
        createHistoryEntry(
          "arachne status: Job ID required. Usage: arachne status <job_id>",
          "error"
        )
      );
      return history;
    }

    const jobId = args[0];

    try {
      const { getScrapeStatus } = await import("../services/arachneApi");
      const status = await getScrapeStatus(jobId);

      const statusText = this.formatJobStatus(status);
      history.push(createHistoryEntry(statusText, "info"));
      return history;
    } catch (error) {
      history.push(
        createHistoryEntry(
          `arachne status: Failed to get status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "error"
        )
      );
      return history;
    }
  }

  private handleJobs(
    history: HistoryEntry[],
    state?: TerminalState
  ): HistoryEntry[] {
    if (!state || Object.keys(state.activeScrapeJobs).length === 0) {
      history.push(createHistoryEntry("No active scraping jobs.", "info"));
      return history;
    }

    const jobsList = Object.values(state.activeScrapeJobs)
      .map((job) => {
        const duration = Math.floor((Date.now() - job.startTime) / 1000);
        const statusIcon =
          job.status === "completed"
            ? "✅"
            : job.status === "failed"
            ? "❌"
            : job.status === "running"
            ? "🔄"
            : "⏳";

        return `${statusIcon} ${job.jobId} - ${
          job.status
        } (${duration}s) - ${job.urls.join(", ")}`;
      })
      .join("\n");

    history.push(
      createHistoryEntry(`Active Scraping Jobs:\n${jobsList}`, "info")
    );
    return history;
  }

  private handleHelp(history: HistoryEntry[]): HistoryEntry[] {
    history.push(
      createHistoryEntry(
        `🌐 Arachne Web Scraper v2.0.0

A powerful web scraping service with real-time progress tracking.

Commands:
  scrape <urls>    Submit URLs for scraping
  status <job_id>  Check job status and results
  jobs             List all active jobs
  help             Show this help

Examples:
  arachne scrape https://example.com
  arachne scrape https://google.com https://github.com
  arachne status 2c424e7e-18dc-44b2-a37a-cd757916febc
  arachne jobs

Features:
  • Real-time progress tracking
  • Concurrent scraping
  • Error handling and retries
  • Results storage
  • Metrics and analytics`,
        "info"
      )
    );
    return history;
  }

  private formatJobStatus(status: any): string {
    // Handle the case where status might be undefined or null
    if (!status) {
      return "❌ Job Status: UNKNOWN (No status data received)\n";
    }

    // The API returns a JobStatusResponse with a 'job' property
    const jobData = status.job || status;

    // Ensure we have a valid status
    if (!jobData || !jobData.status) {
      return "❌ Job Status: UNKNOWN (Invalid status data)\n";
    }

    const statusIcon =
      jobData.status === "completed"
        ? "✅"
        : jobData.status === "failed"
        ? "❌"
        : jobData.status === "running"
        ? "🔄"
        : "⏳";

    let result = `${statusIcon} Job Status: ${jobData.status.toUpperCase()}\n`;

    if (jobData.progress !== undefined) {
      result += `Progress: ${jobData.progress}%\n`;
    }

    if (jobData.status === "completed" && jobData.results) {
      result += `\nResults:\n`;
      jobData.results.forEach((resultItem: any, index: number) => {
        result += `  ${index + 1}. ${resultItem.url} (${resultItem.status}) - ${
          resultItem.size
        } bytes\n`;
        if (resultItem.title) {
          result += `     Title: ${resultItem.title}\n`;
        }
      });
    }

    if (jobData.status === "failed" && jobData.error) {
      result += `Error: ${jobData.error}\n`;
    }

    return result;
  }

  getSuggestions(input: string): string[] {
    if (input.toLowerCase().startsWith("arachne ")) {
      const afterArachne = input.substring(8).trim();
      if (!afterArachne) {
        return [
          "arachne scrape",
          "arachne status",
          "arachne jobs",
          "arachne help",
        ];
      }
      if (afterArachne.startsWith("scrape ")) {
        const afterScrape = afterArachne.substring(7).trim();
        if (!afterScrape) {
          return [
            "arachne scrape https://example.com",
            "arachne scrape https://google.com https://github.com",
            "arachne scrape https://news.ycombinator.com",
          ];
        }
      }
      if (afterArachne.startsWith("status ")) {
        return ["arachne status <job_id>"];
      }
    }
    return [];
  }
}

class AiCommand implements Command {
  name = "ai";

  async execute(
    args: string[],
    history: HistoryEntry[],
    _fileSystem: FileSystemItem[],
    _dispatch: React.Dispatch<TerminalAction>,
    _currentDirectory: string,
    _onNavigate?: (route: string) => void
  ): Promise<CommandResult> {
    const newHistory = [...history];

    // Check if an initial message was provided
    const initialMessage = args.join(" ").trim();

    if (!initialMessage) {
      newHistory.push(
        createHistoryEntry(
          "Usage: ai <message>\nExample: ai 'Tell me about this portfolio'",
          "error"
        )
      );
      return newHistory;
    }

    // Add user message to history
    newHistory.push(createHistoryEntry(`🤖 AI: ${initialMessage}`, "info"));

    // Add typing indicator
    newHistory.push(createHistoryEntry("🤖 AI is thinking...", "info"));

    try {
      // Import the AI API function
      const { sendMessageToAI } = await import("../services/aiApi");

      // Send message to AI
      const response = await sendMessageToAI(initialMessage, []);

      // Remove the typing indicator
      newHistory.pop(); // Remove "AI is thinking..."

      // Save conversation to localStorage
      const conversation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        userMessage: initialMessage,
        aiResponse: response.response,
      };

      // Load existing conversations
      const existingConversations = localStorage.getItem("ai-conversations");
      const conversations = existingConversations
        ? JSON.parse(existingConversations)
        : [];

      // Add new conversation (keep only last 50 conversations)
      conversations.unshift(conversation);
      if (conversations.length > 50) {
        conversations.splice(50);
      }

      // Save back to localStorage
      localStorage.setItem("ai-conversations", JSON.stringify(conversations));

      // Split the AI response into lines for typewriter effect
      const aiResponseLines = response.response.split("\n");

      // Return typewriter effect for the AI response
      return {
        _effect: "TYPEWRITER",
        lines: aiResponseLines,
      };
    } catch (error) {
      // Remove the typing indicator and add error message
      newHistory.pop(); // Remove "AI is thinking..."
      newHistory.push(
        createHistoryEntry(
          `🤖 AI Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "error"
        )
      );
      return newHistory;
    }
  }

  getSuggestions(input: string): string[] {
    if (input.toLowerCase().startsWith("ai ")) {
      const afterAi = input.substring(3).trim();
      if (!afterAi) {
        return [
          'ai "Tell me about this portfolio"',
          'ai "What technologies did you use?"',
          'ai "How does the terminal work?"',
          'ai "Show me some cool features"',
        ];
      }
    }
    return [];
  }
}

export const useTerminal = (
  fileSystem: FileSystemItem[],
  onNavigate: (route: string) => void,
  _isVisible: boolean = true
) => {
  // State for managing typewriter effects
  const [typewriter, setTypewriter] = useState<TypewriterEffect | null>(null);

  // State for managing top command process updates
  const [processUpdateInterval, setProcessUpdateInterval] = useState<
    number | null
  >(null);

  // State for dynamic file system (for scrape results)
  const [dynamicFileSystem, setDynamicFileSystem] =
    useState<FileSystemItem[]>(fileSystem);
  const [dynamicFileContents, setDynamicFileContents] = useState<
    Record<string, string[]>
  >({});

  // Load initial state from localStorage
  const getInitialState = (): TerminalState => {
    try {
      const savedState = localStorage.getItem("terminal-state");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Ensure we have all required properties with fallbacks
        return {
          commandHistory: parsed.commandHistory || [],
          currentCommand: parsed.currentCommand || "",
          showPrompt: parsed.showPrompt || false,
          targetRoute: parsed.targetRoute || "/",
          autocompleteIndex: parsed.autocompleteIndex || 0,
          currentDirectory: parsed.currentDirectory || "/",
          isMinimized: parsed.isMinimized || false, // Load minimized state
          isMaximized: parsed.isMaximized || false,
          showPreview: false, // Always start hidden
          activeTypewriter: false, // Always start inactive
          historyIndex: parsed.historyIndex || -1, // Load history index
          isReverseSearch: false, // Always start not in reverse search
          reverseSearchTerm: "",
          reverseSearchIndex: 0,
          reverseSearchResults: [],
          isManPage: false, // Always start not viewing man page
          currentManPage: "",
          manPageScrollPosition: 0,
          isTopCommand: false,
          topSelectedPid: null,
          topProcesses: [],
          topSortBy: "pid",
          topSortOrder: "asc",
          topRefreshRate: 1000,
          activeScrapeJobs: parsed.activeScrapeJobs || {},
          nextHistoryId: parsed.nextHistoryId || 1,
          // AI Chat functionality
          isAiChatting: false,
          aiChatHistory: [],
          isAiTyping: false,
          aiInputValue: "",
          // Vim editor functionality removed
          showScrapeResults: false,
          scrapeResults: [],
          currentScrapeJobId: "",
        };
      }
    } catch (error) {
      console.warn("Failed to load terminal state from localStorage:", error);
    }

    // Default state if no saved state or error
    return {
      commandHistory: [],
      currentCommand: "",
      showPrompt: false,
      targetRoute: "/",
      autocompleteIndex: 0,
      currentDirectory: "/",
      isMinimized: false,
      isMaximized: false,
      showPreview: false,
      activeTypewriter: false,
      historyIndex: -1, // Start at -1 (no history navigation active)
      isReverseSearch: false,
      reverseSearchTerm: "",
      reverseSearchIndex: 0,
      reverseSearchResults: [],
      isManPage: false,
      currentManPage: "",
      manPageScrollPosition: 0,
      isTopCommand: false,
      topSelectedPid: null,
      topProcesses: [],
      topSortBy: "pid",
      topSortOrder: "asc",
      topRefreshRate: 1000,
      activeScrapeJobs: {},
      nextHistoryId: 1,
      // AI Chat functionality
      isAiChatting: false,
      aiChatHistory: [],
      isAiTyping: false,
      aiInputValue: "",
      showScrapeResults: false,
      scrapeResults: [],
      currentScrapeJobId: "",
    };
  };

  const [state, dispatch] = useReducer(terminalReducer, getInitialState());

  const terminalRef = useRef<HTMLDivElement>(null);

  // Save state to localStorage whenever it changes
  const saveStateToStorage = useCallback((newState: TerminalState) => {
    try {
      // Only save persistent state (exclude temporary UI states)
      const stateToSave = {
        commandHistory: newState.commandHistory,
        currentCommand: newState.currentCommand,
        showPrompt: newState.showPrompt,
        targetRoute: newState.targetRoute,
        autocompleteIndex: newState.autocompleteIndex,
        currentDirectory: newState.currentDirectory,
        isMinimized: newState.isMinimized,
        isMaximized: newState.isMaximized,
        historyIndex: newState.historyIndex,
        isTopCommand: newState.isTopCommand,
        topSelectedPid: newState.topSelectedPid,
        topProcesses: newState.topProcesses,
        topSortBy: newState.topSortBy,
        topSortOrder: newState.topSortOrder,
        topRefreshRate: newState.topRefreshRate,
        activeScrapeJobs: newState.activeScrapeJobs,
        nextHistoryId: newState.nextHistoryId,
      };
      localStorage.setItem("terminal-state", JSON.stringify(stateToSave));
    } catch (error) {
      console.warn("Failed to save terminal state to localStorage:", error);
    }
  }, []);

  // Custom dispatch that saves state
  const dispatchWithSave = useCallback(
    (action: TerminalAction) => {
      dispatch(action);
    },
    [dispatch]
  );

  // Save state whenever it changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state, saveStateToStorage]);

  // Handle typewriter effects
  useEffect(() => {
    if (!typewriter) return;

    dispatchWithSave({ type: "SET_ACTIVE_TYPEWRITER", payload: true });

    let isCancelled = false;
    let lineIndex = 0;

    const typeLine = () => {
      if (isCancelled || lineIndex >= typewriter.lines.length) {
        dispatchWithSave({ type: "SET_ACTIVE_TYPEWRITER", payload: false });
        setTypewriter(null); // Clear the effect
        return;
      }

      const line = typewriter.lines[lineIndex];
      dispatchWithSave({
        type: "ADD_HISTORY_ENTRY",
        payload: createHistoryEntry(line, "info", true),
      });

      const delay = line.length * 30 + 100;
      lineIndex++;
      setTimeout(typeLine, delay);
    };

    typeLine();

    return () => {
      isCancelled = true;
    };
  }, [typewriter, dispatchWithSave]);

  // Helper function to find item by path
  const findItemByPath = useCallback(
    (path: string): FileSystemItem | null => {
      if (path === "/") return null;

      const pathParts = path.split("/").filter((part) => part);
      let currentItems = dynamicFileSystem;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const item = currentItems.find((item) => item.name === part);

        if (!item) return null;

        if (i === pathParts.length - 1) {
          return item;
        }

        if (item.type === "directory" && item.children) {
          currentItems = item.children;
        } else {
          return null;
        }
      }

      return null;
    },
    [dynamicFileSystem]
  );

  // Function to get file content from both static and dynamic sources
  const getFileContent = useCallback(
    (path: string) => {
      // First check dynamic file contents
      if (dynamicFileContents[path]) {
        return { content: dynamicFileContents[path] };
      }

      // Fall back to static file contents
      return getFileContentByPath(path);
    },
    [dynamicFileContents]
  );

  // Function to save scrape results to the virtual file system
  const saveScrapeResultsToFile = useCallback(
    (jobId: string, results: any[]) => {
      try {
        console.log(
          "Saving scrape results to file:",
          jobId,
          results.length,
          "results"
        );

        // Create JSON content for the results
        const jsonContent = JSON.stringify(results, null, 2);
        const filename = `job_${jobId}.json`;

        // Split JSON content into lines for display
        const contentLines = jsonContent.split("\n");

        // Add file to dynamic file system
        setDynamicFileSystem((prevFileSystem) => {
          console.log("Previous file system:", prevFileSystem.length, "items");
          const newFileSystem = [...prevFileSystem];

          // Find the scraping_results directory
          const scrapingResultsDir = newFileSystem.find(
            (item) => item.name === "scraping_results"
          );
          console.log("Found scraping_results dir:", !!scrapingResultsDir);

          if (scrapingResultsDir) {
            // Ensure children array exists
            if (!scrapingResultsDir.children) {
              scrapingResultsDir.children = [];
            }

            // Add the new file
            scrapingResultsDir.children.push({
              name: filename,
              type: "file",
              permissions: "-rw-r--r--",
              size: `${Math.round((jsonContent.length / 1024) * 10) / 10}K`,
              date: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
            console.log("Added file to scraping_results:", filename);
          } else {
            console.error("scraping_results directory not found");
          }

          return newFileSystem;
        });

        // Add file content to dynamic file contents
        setDynamicFileContents((prev) => {
          const newContents = {
            ...prev,
            [`scraping_results/${filename}`]: contentLines,
          };
          console.log(
            "Updated file contents, total files:",
            Object.keys(newContents).length
          );
          return newContents;
        });

        return true;
      } catch (error) {
        console.error("Failed to save scrape results to file:", error);
        return false;
      }
    },
    [setDynamicFileSystem, setDynamicFileContents]
  );

  // Command registry using Command Pattern
  const commandRegistry: Record<string, Command> = {
    ls: new LsCommand(),
    cd: new CdCommand(),
    help: new HelpCommand(),
    clear: new ClearCommand(),
    pwd: new PwdCommand(),
    cat: new CatCommand(),
    grep: new GrepCommand(),
    wc: new WcCommand(),
    history: new HistoryCommand(),
    man: new ManCommand(),
    top: new TopCommand(),
    exit: new ExitCommand(),
    curl: new CurlCommand(),
    arachne: new ArachneCommand(),
    ai: new AiCommand(),
    vim: new VimCommand(),
  };

  const executeCommand = useCallback(
    (command: string) => {
      const historyId = state.nextHistoryId;
      const newHistoryEntry = createHistoryEntry(
        `$ ${command}`,
        "command",
        false,
        historyId
      );
      dispatchWithSave({ type: "ADD_HISTORY_ENTRY", payload: newHistoryEntry });
      dispatchWithSave({ type: "SET_NEXT_HISTORY_ID", payload: historyId + 1 });

      // Check if command contains pipes
      if (command.includes("|")) {
        executePipeChain(command, [...state.commandHistory, newHistoryEntry]);
        return;
      }

      // Single command execution (existing logic)
      const [commandName, ...args] = command.split(" ");

      // Expand combined flags (e.g., -al becomes -a -l)
      const expandedArgs: string[] = [];
      args.forEach((arg) => {
        if (arg.startsWith("-") && arg.length > 2) {
          // Split combined flags like -al into -a -l
          for (let i = 1; i < arg.length; i++) {
            expandedArgs.push(`-${arg[i]}`);
          }
        } else {
          expandedArgs.push(arg);
        }
      });

      if (commandRegistry[commandName]) {
        const result = commandRegistry[commandName].execute(
          expandedArgs,
          [...state.commandHistory, newHistoryEntry], // Pass the updated history
          dynamicFileSystem, // Use dynamic file system instead of static
          dispatchWithSave, // Pass dispatchWithSave instead of dispatch
          state.currentDirectory,
          onNavigate, // Pass the navigation function
          state, // Pass the current state
          undefined, // No stdin for single commands
          getFileContent // Pass the file content function
        );

        // Handle both sync and async results
        if (result instanceof Promise) {
          result.then(handleCommandResult).catch((error) => {
            dispatchWithSave({
              type: "ADD_HISTORY_ENTRY",
              payload: createHistoryEntry(
                `Command execution failed: ${
                  error instanceof Error ? error.message : "Unknown error"
                }`,
                "error"
              ),
            });
          });
        } else {
          handleCommandResult(result);
        }
      } else {
        dispatchWithSave({
          type: "ADD_HISTORY_ENTRY",
          payload: createHistoryEntry(
            `Command not found: ${command}. Type 'help' for available commands.`,
            "error"
          ),
        });
      }
    },
    [
      state.commandHistory,
      state.currentDirectory,
      dynamicFileSystem,
      commandRegistry,
      dispatchWithSave,
      setTypewriter,
      getFileContent,
    ]
  );

  // Helper function to handle different command result types
  const handleCommandResult = useCallback(
    (result: CommandResult) => {
      if (Array.isArray(result)) {
        // It's a normal history update
        dispatchWithSave({
          type: "SET_COMMAND_HISTORY",
          payload: result,
        });
      } else if ("_effect" in result && result._effect === "TYPEWRITER") {
        // It's a typewriter effect! Let a dedicated useEffect handle it.
        setTypewriter(result);
      } else if ("history" in result) {
        // It's a pipe result
        dispatchWithSave({
          type: "SET_COMMAND_HISTORY",
          payload: result.history,
        });
      }
    },
    [dispatchWithSave, setTypewriter]
  );

  // New function to execute pipe chains
  const executePipeChain = useCallback(
    (command: string, currentHistory: HistoryEntry[]) => {
      const commands = command.split("|").map((cmd) => cmd.trim());
      let stdin: string[] | undefined = undefined;
      let finalHistory = [...currentHistory];

      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        const isLastCommand = i === commands.length - 1;

        const [commandName, ...args] = cmd.split(" ");

        // Expand combined flags
        const expandedArgs: string[] = [];
        args.forEach((arg) => {
          if (arg.startsWith("-") && arg.length > 2) {
            for (let j = 1; j < arg.length; j++) {
              expandedArgs.push(`-${arg[j]}`);
            }
          } else {
            expandedArgs.push(arg);
          }
        });

        if (!commandRegistry[commandName]) {
          dispatchWithSave({
            type: "ADD_HISTORY_ENTRY",
            payload: createHistoryEntry(
              `Command not found: ${commandName}. Type 'help' for available commands.`,
              "error"
            ),
          });
          return;
        }

        const result = commandRegistry[commandName].execute(
          expandedArgs,
          finalHistory,
          dynamicFileSystem, // Use dynamic file system
          dispatchWithSave,
          state.currentDirectory,
          onNavigate,
          state,
          stdin,
          getFileContent
        );

        // Handle the result and prepare stdin for next command
        console.log(
          `Pipe debug - Command ${i + 1}: ${commandName}, stdin:`,
          stdin
        );

        if (Array.isArray(result)) {
          // Traditional command result - no stdout for piping
          finalHistory = result;
          if (!isLastCommand) {
            // If not the last command, we need stdout for the next command
            // For now, we'll use the last history entry as stdout
            stdin = [result[result.length - 1]?.text || ""];
          }
        } else if ("_effect" in result && result._effect === "TYPEWRITER") {
          // Typewriter effect - not suitable for piping
          setTypewriter(result);
          return;
        } else if ("history" in result) {
          // Pipe result with stdout
          finalHistory = result.history;
          stdin = result.stdout;
          console.log(
            `Pipe debug - stdout from ${commandName}:`,
            result.stdout
          );
        }

        console.log(`Pipe debug - stdin for next command:`, stdin);

        // Update history after each command in the chain
        if (isLastCommand) {
          dispatchWithSave({
            type: "SET_COMMAND_HISTORY",
            payload: finalHistory,
          });
        }
      }
    },
    [
      commandRegistry,
      dynamicFileSystem,
      dispatchWithSave,
      state.currentDirectory,
      onNavigate,
      state,
      setTypewriter,
    ]
  );

  const getAutocompleteSuggestions = useCallback(
    (input: string): string[] => {
      if (!input.trim()) return [];

      const suggestions: string[] = [];
      // Use the shared helper
      const currentItems = getCurrentDirectoryItems(
        dynamicFileSystem,
        state.currentDirectory
      );

      // Check for commands
      availableCommands.forEach((cmd) => {
        if (cmd.toLowerCase().startsWith(input.toLowerCase())) {
          suggestions.push(cmd);
        }
      });

      // Check for cd command with directory names
      if (input.toLowerCase().startsWith("cd ")) {
        const partialPath = input.substring(3).trim();

        // Split the path to get the directory and the partial name
        const pathParts = partialPath.split("/");
        const basePath = pathParts.slice(0, -1).join("/");
        const partialName = pathParts[pathParts.length - 1];

        // Get the items from the base path
        let targetItems = fileSystem;
        if (basePath) {
          const basePathParts = basePath.split("/").filter((part) => part);
          for (const part of basePathParts) {
            const item = targetItems.find((item) => item.name === part);
            if (item && item.type === "directory" && item.children) {
              targetItems = item.children;
            } else {
              targetItems = [];
              break;
            }
          }
        } else {
          targetItems = currentItems;
        }

        // Find matching items
        targetItems.forEach((item) => {
          if (item.name.toLowerCase().startsWith(partialName.toLowerCase())) {
            const fullPath = basePath ? `${basePath}/${item.name}` : item.name;
            suggestions.push(`cd ${fullPath}`);
          }
        });
      }

      // Check for cat command with file names
      if (input.toLowerCase().startsWith("cat ")) {
        // Handle filenames with spaces by getting everything after "cat "
        const partialFile = input.substring(4);

        // Check if the partial file starts with a quote
        const isQuoted =
          partialFile.startsWith('"') || partialFile.startsWith("'");
        const searchTerm = isQuoted ? partialFile.slice(1) : partialFile;

        currentItems.forEach((item) => {
          if (
            item.type === "file" &&
            item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
          ) {
            // If the original input was quoted, keep it quoted
            // If the filename contains spaces, wrap in quotes
            let displayName = item.name;
            if (isQuoted || item.name.includes(" ")) {
              displayName = `"${item.name}"`;
            }
            suggestions.push(`cat ${displayName}`);
          }
        });
      }

      // Check for grep command with file names
      if (input.toLowerCase().startsWith("grep ")) {
        const afterGrep = input.substring(5).trim();
        const parts = afterGrep.split(" ");

        if (parts.length === 1 && parts[0]) {
          // User has typed search term, suggest files
          currentItems.forEach((item) => {
            if (item.type === "file") {
              suggestions.push(`grep ${parts[0]} ${item.name}`);
            }
          });
        }
      }

      // Check for wc command with file names
      if (input.toLowerCase().startsWith("wc ")) {
        const afterWc = input.substring(3).trim();
        const parts = afterWc.split(" ");

        // If no flags, suggest flags
        if (parts.length === 0 || !parts[0].startsWith("-")) {
          suggestions.push("wc -l", "wc -w", "wc -c", "wc -l -w -c");
        }

        // If flags are present, suggest files
        if (parts.length > 0 && parts[0].startsWith("-")) {
          currentItems.forEach((item) => {
            if (item.type === "file") {
              suggestions.push(`wc ${afterWc} ${item.name}`);
            }
          });
        }
      }

      // Check for man command with available man pages
      if (input.toLowerCase().startsWith("man ")) {
        const afterMan = input.substring(4).trim();

        // Get all available man pages
        const manPageNames = Object.keys(manPages);

        // Filter man pages that match the partial input
        manPageNames.forEach((pageName) => {
          if (pageName.toLowerCase().startsWith(afterMan.toLowerCase())) {
            suggestions.push(`man ${pageName}`);
          }
        });
      }

      // Check for arachne command with subcommands
      if (input.toLowerCase().startsWith("arachne ")) {
        const afterArachne = input.substring(8).trim();

        if (!afterArachne) {
          // No subcommand yet, suggest all subcommands
          suggestions.push(
            "arachne scrape",
            "arachne status",
            "arachne jobs",
            "arachne help"
          );
        } else if (afterArachne.startsWith("scrape ")) {
          // Suggest URLs for scraping
          const afterScrape = afterArachne.substring(7).trim();
          if (!afterScrape) {
            suggestions.push(
              "arachne scrape https://example.com",
              "arachne scrape https://google.com https://github.com",
              "arachne scrape https://news.ycombinator.com"
            );
          }
        } else if (afterArachne.startsWith("status ")) {
          // Suggest status command format
          const afterStatus = afterArachne.substring(7).trim();
          if (!afterStatus) {
            suggestions.push("arachne status <job_id>");
          }
        }
      }

      return suggestions;
    },
    [state.currentDirectory, fileSystem] // Update dependency array
  );

  const handleTabComplete = useCallback(
    (currentCommand: string, autocompleteIndex: number): TabCompleteResult => {
      const suggestions = getAutocompleteSuggestions(currentCommand);

      if (suggestions.length === 0) {
        // No suggestions, reset index.
        return { currentCommand, autocompleteIndex: 0 };
      }

      if (suggestions.length === 1) {
        // One suggestion, complete and reset index.
        return { currentCommand: suggestions[0], autocompleteIndex: 0 };
      }

      // Multiple suggestions:
      if (autocompleteIndex === 0) {
        // First Tab: Display suggestions in history.
        const newHistory = [...state.commandHistory];
        const filteredHistory = newHistory.filter(
          (entry) =>
            !entry.text.startsWith("Suggestions:") &&
            !entry.text.startsWith("  ")
        );
        const updatedHistory = [
          ...filteredHistory,
          createHistoryEntry(`$ ${currentCommand}`, "command"), // Re-add the current command for context
          createHistoryEntry(suggestions.join("  "), "info"), // Show suggestions in a single line
        ];
        dispatchWithSave({
          type: "SET_COMMAND_HISTORY",
          payload: updatedHistory,
        });

        // Don't change the command, but prepare for cycling.
        // We set the next command and the next index here.
        return {
          currentCommand: suggestions[0], // Show the first suggestion immediately
          autocompleteIndex: 1, // Next tab will go to index 1
        };
      } else {
        // Subsequent Tabs: Cycle through suggestions.
        const nextIndex = autocompleteIndex % suggestions.length;
        return {
          currentCommand: suggestions[nextIndex],
          autocompleteIndex: autocompleteIndex + 1, // Increment for the next cycle
        };
      }
    },
    [getAutocompleteSuggestions, state.commandHistory, dispatchWithSave]
  );

  const setCurrentCommand = useCallback(
    (command: string) => {
      // If the user is typing a new command (not navigating history), reset history index
      if (state.historyIndex !== -1 && command !== state.currentCommand) {
        dispatchWithSave({ type: "RESET_HISTORY_INDEX" });
      }
      dispatchWithSave({ type: "SET_CURRENT_COMMAND", payload: command });
    },
    [dispatchWithSave, state.historyIndex, state.currentCommand]
  );

  const setShowPrompt = useCallback(
    (show: boolean) => {
      dispatchWithSave({ type: "SET_SHOW_PROMPT", payload: show });
    },
    [dispatchWithSave]
  );

  const setAutocompleteIndex = useCallback(
    (index: number) => {
      dispatchWithSave({ type: "SET_AUTOCOMPLETE_INDEX", payload: index });
    },
    [dispatchWithSave]
  );

  const clearCommand = useCallback(() => {
    dispatchWithSave({ type: "CLEAR_COMMAND" });
  }, [dispatchWithSave]);

  const minimizeTerminal = useCallback(() => {
    dispatchWithSave({ type: "MINIMIZE_TERMINAL" });
  }, [dispatchWithSave]);

  const restoreTerminal = useCallback(() => {
    dispatchWithSave({ type: "RESTORE_TERMINAL" });
  }, [dispatchWithSave]);

  const maximizeTerminal = useCallback(() => {
    dispatchWithSave({ type: "MAXIMIZE_TERMINAL" });
  }, [dispatchWithSave]);

  const showPreviewFunc = useCallback(() => {
    if (state.isMinimized) {
      dispatchWithSave({ type: "SHOW_PREVIEW" });
    }
  }, [state.isMinimized, dispatchWithSave]);

  const hidePreview = useCallback(() => {
    dispatchWithSave({ type: "HIDE_PREVIEW" });
  }, [dispatchWithSave]);

  // History navigation functions
  const navigateHistoryUp = useCallback(() => {
    // Get all commands from history (entries that start with "$ ")
    const commands = state.commandHistory
      .filter((entry) => entry.text.startsWith("$ "))
      .map((entry) => entry.text.substring(2)); // Remove "$ " prefix

    if (commands.length === 0) return;

    // If we're at the end (historyIndex === -1), start from the last command
    if (state.historyIndex === -1) {
      const newIndex = commands.length - 1;
      dispatchWithSave({ type: "SET_HISTORY_INDEX", payload: newIndex });
      dispatchWithSave({
        type: "SET_CURRENT_COMMAND",
        payload: commands[newIndex],
      });
      return;
    }

    // Navigate up (older commands)
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      dispatchWithSave({ type: "SET_HISTORY_INDEX", payload: newIndex });
      dispatchWithSave({
        type: "SET_CURRENT_COMMAND",
        payload: commands[newIndex],
      });
    }
  }, [state.commandHistory, state.historyIndex, dispatchWithSave]);

  const navigateHistoryDown = useCallback(() => {
    // Get all commands from history
    const commands = state.commandHistory
      .filter((entry) => entry.text.startsWith("$ "))
      .map((entry) => entry.text.substring(2));

    if (commands.length === 0) return;

    // Navigate down (newer commands)
    if (state.historyIndex < commands.length - 1) {
      const newIndex = state.historyIndex + 1;
      dispatchWithSave({ type: "SET_HISTORY_INDEX", payload: newIndex });
      dispatchWithSave({
        type: "SET_CURRENT_COMMAND",
        payload: commands[newIndex],
      });
    } else if (state.historyIndex === commands.length - 1) {
      // We're at the most recent command, clear the input
      dispatchWithSave({ type: "RESET_HISTORY_INDEX" });
      dispatchWithSave({ type: "SET_CURRENT_COMMAND", payload: "" });
    }
  }, [state.commandHistory, state.historyIndex, dispatchWithSave]);

  const resetHistoryNavigation = useCallback(() => {
    dispatchWithSave({ type: "RESET_HISTORY_INDEX" });
  }, [dispatchWithSave]);

  // Reverse search functions
  const startReverseSearch = useCallback(() => {
    dispatchWithSave({ type: "START_REVERSE_SEARCH" });
  }, [dispatchWithSave]);

  const updateReverseSearch = useCallback(
    (term: string) => {
      // Get all commands from history
      const commands = state.commandHistory
        .filter((entry) => entry.text.startsWith("$ "))
        .map((entry) => entry.text.substring(2));

      // Filter commands that contain the search term (case-insensitive)
      const results = commands.filter((command) =>
        command.toLowerCase().includes(term.toLowerCase())
      );

      dispatchWithSave({
        type: "UPDATE_REVERSE_SEARCH",
        payload: { term, results },
      });

      // If we have results, set the current command to the first match
      if (results.length > 0) {
        dispatchWithSave({ type: "SET_CURRENT_COMMAND", payload: results[0] });
      }
    },
    [state.commandHistory, dispatchWithSave]
  );

  const navigateReverseSearchResults = useCallback(
    (direction: "up" | "down") => {
      if (state.reverseSearchResults.length === 0) return;

      let newIndex = state.reverseSearchIndex;
      if (direction === "up") {
        // Navigate to previous match (older command)
        newIndex =
          newIndex > 0 ? newIndex - 1 : state.reverseSearchResults.length - 1;
      } else {
        // Navigate to next match (newer command)
        newIndex =
          newIndex < state.reverseSearchResults.length - 1 ? newIndex + 1 : 0;
      }

      dispatchWithSave({ type: "SET_REVERSE_SEARCH_INDEX", payload: newIndex });
      dispatchWithSave({
        type: "SET_CURRENT_COMMAND",
        payload: state.reverseSearchResults[newIndex],
      });
    },
    [state.reverseSearchResults, state.reverseSearchIndex, dispatchWithSave]
  );

  const exitReverseSearch = useCallback(() => {
    dispatchWithSave({ type: "EXIT_REVERSE_SEARCH" });
  }, [dispatchWithSave]);

  // Man page functions
  const showManPage = useCallback(
    (commandName: string) => {
      dispatchWithSave({ type: "SHOW_MAN_PAGE", payload: commandName });
    },
    [dispatchWithSave]
  );

  const hideManPage = useCallback(() => {
    dispatchWithSave({ type: "HIDE_MAN_PAGE" });
  }, [dispatchWithSave]);

  const setManPageScroll = useCallback(
    (position: number) => {
      dispatchWithSave({ type: "SET_MAN_PAGE_SCROLL", payload: position });
    },
    [dispatchWithSave]
  );

  const showTopCommand = useCallback(() => {
    dispatchWithSave({ type: "SHOW_TOP_COMMAND" });

    // Initialize process list if empty
    if (state.topProcesses.length === 0) {
      const initialProcesses = generateProcessList();
      dispatchWithSave({
        type: "UPDATE_TOP_PROCESSES",
        payload: initialProcesses,
      });
    }

    // Start process update interval
    const interval = setInterval(() => {
      const updatedProcesses = updateProcessList(state.topProcesses);
      dispatchWithSave({
        type: "UPDATE_TOP_PROCESSES",
        payload: updatedProcesses,
      });
    }, state.topRefreshRate);

    setProcessUpdateInterval(interval);
  }, [dispatchWithSave, state.topProcesses, state.topRefreshRate]);

  const hideTopCommand = useCallback(() => {
    dispatchWithSave({ type: "HIDE_TOP_COMMAND" });

    // Clear process update interval
    if (processUpdateInterval) {
      clearInterval(processUpdateInterval);
      setProcessUpdateInterval(null);
    }
  }, [dispatchWithSave, processUpdateInterval]);

  const updateTopProcesses = useCallback(
    (processes: any[]) => {
      dispatchWithSave({ type: "UPDATE_TOP_PROCESSES", payload: processes });
    },
    [dispatchWithSave]
  );

  const setTopSort = useCallback(
    (field: "cpu" | "memory" | "pid" | "name", order: "asc" | "desc") => {
      dispatchWithSave({ type: "SET_TOP_SORT", payload: { field, order } });
    },
    [dispatchWithSave]
  );

  const setTopRefreshRate = useCallback(
    (rate: number) => {
      dispatchWithSave({ type: "SET_TOP_REFRESH_RATE", payload: rate });
    },
    [dispatchWithSave]
  );

  const setTopSelectedPid = useCallback(
    (pid: number | null) => {
      dispatchWithSave({ type: "SET_TOP_SELECTED_PID", payload: pid });
    },
    [dispatchWithSave]
  );

  const killTopProcess = useCallback(
    (pid: number) => {
      // Remove the process from the list
      const updatedProcesses = state.topProcesses.filter((p) => p.pid !== pid);
      dispatchWithSave({
        type: "UPDATE_TOP_PROCESSES",
        payload: updatedProcesses,
      });

      // Clear selection if the killed process was selected
      if (state.topSelectedPid === pid) {
        dispatchWithSave({ type: "SET_TOP_SELECTED_PID", payload: null });
      }
    },
    [dispatchWithSave, state.topProcesses, state.topSelectedPid]
  );

  // Polling system for active scrape jobs
  useEffect(() => {
    const activeJobs = Object.values(state.activeScrapeJobs);
    if (activeJobs.length === 0) return;

    const pollInterval = setInterval(async () => {
      const { getScrapeStatus } = await import("../services/arachneApi");

      for (const job of activeJobs) {
        if (job.status === "completed" || job.status === "failed") {
          continue; // Skip completed/failed jobs
        }

        try {
          const status = await getScrapeStatus(job.jobId);

          // Update job status
          dispatchWithSave({
            type: "UPDATE_SCRAPE_JOB",
            payload: {
              jobId: job.jobId,
              updates: {
                status: status.status,
                progress: status.progress,
                results: status.results,
                error: status.error,
              },
            },
          });

          // Update the history entry with progress
          const progressText =
            status.status === "running"
              ? `🔄 Scraping in progress... ${
                  status.progress ? `${status.progress}%` : ""
                }`
              : status.status === "completed"
              ? `✅ Scrape completed! Results saved to: scraping_results/job_${job.jobId}.json`
              : status.status === "failed"
              ? `❌ Scrape failed: ${status.error || "Unknown error"}`
              : `⏳ Job submitted...`;

          dispatchWithSave({
            type: "UPDATE_HISTORY_ENTRY",
            payload: {
              id: job.historyEntryId,
              entry: createHistoryEntry(
                progressText,
                "info",
                false,
                job.historyEntryId
              ),
            },
          });

          // Handle completion
          if (status.status === "completed" && status.results) {
            console.log(
              "Job completed, saving results:",
              job.jobId,
              status.results.length,
              "results"
            );

            dispatchWithSave({
              type: "UPDATE_SCRAPE_JOB",
              payload: {
                jobId: job.jobId,
                updates: {
                  results: status.results,
                },
              },
            });

            // Save results to file system
            saveScrapeResultsToFile(job.jobId, status.results);

            // Show results modal
            dispatchWithSave({
              type: "SHOW_SCRAPE_RESULTS",
              payload: {
                results: status.results,
                jobId: job.jobId,
              },
            });

            // Remove the job from active jobs after a delay
            setTimeout(() => {
              dispatchWithSave({
                type: "REMOVE_SCRAPE_JOB",
                payload: job.jobId,
              });
            }, 5000); // Keep for 5 seconds after completion
          }

          // Handle failure
          if (status.status === "failed") {
            // Remove the job from active jobs after a delay
            setTimeout(() => {
              dispatchWithSave({
                type: "REMOVE_SCRAPE_JOB",
                payload: job.jobId,
              });
            }, 10000); // Keep for 10 seconds after failure
          }
        } catch (error) {
          console.error(`Failed to poll job ${job.jobId}:`, error);
        }
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [state.activeScrapeJobs, dispatchWithSave, saveScrapeResultsToFile]);

  return {
    // State
    commandHistory: state.commandHistory,
    currentCommand: state.currentCommand,
    showPrompt: state.showPrompt,
    autocompleteIndex: state.autocompleteIndex,
    currentDirectory: state.currentDirectory,
    isMinimized: state.isMinimized,
    isMaximized: state.isMaximized,
    showPreview: state.showPreview,
    activeTypewriter: state.activeTypewriter,
    isReverseSearch: state.isReverseSearch,
    reverseSearchTerm: state.reverseSearchTerm,
    reverseSearchResults: state.reverseSearchResults,
    reverseSearchIndex: state.reverseSearchIndex,
    isManPage: state.isManPage,
    currentManPage: state.currentManPage,
    manPageScrollPosition: state.manPageScrollPosition,
    isTopCommand: state.isTopCommand,
    topSelectedPid: state.topSelectedPid,
    topProcesses: state.topProcesses,
    topSortBy: state.topSortBy,
    topSortOrder: state.topSortOrder,
    topRefreshRate: state.topRefreshRate,
    activeScrapeJobs: state.activeScrapeJobs,

    // Vim editor state removed

    // Scrape results state
    showScrapeResults: state.showScrapeResults,
    scrapeResults: state.scrapeResults,
    currentScrapeJobId: state.currentScrapeJobId,

    // Refs
    terminalRef,

    // Actions
    executeCommand,
    getAutocompleteSuggestions,
    handleTabComplete,
    setCurrentCommand,
    setShowPrompt,
    setAutocompleteIndex,
    clearCommand,
    minimizeTerminal,
    restoreTerminal,
    maximizeTerminal,
    showPreviewFunc,
    hidePreview,
    navigateHistoryUp,
    navigateHistoryDown,
    resetHistoryNavigation,
    startReverseSearch,
    updateReverseSearch,
    navigateReverseSearchResults,
    exitReverseSearch,
    showManPage,
    hideManPage,
    setManPageScroll,
    showTopCommand,
    hideTopCommand,
    updateTopProcesses,
    setTopSort,
    setTopRefreshRate,
    setTopSelectedPid,
    killTopProcess,

    // AI Chat actions
    dispatch: dispatchWithSave,

    // Helpers
    findItemByPath,

    // Computed
    isLoading: false,
  };
};
