import { useRef, useCallback, useReducer, useEffect } from "react";
import {
  FileSystemItem,
  HistoryEntry,
  TerminalState,
  Command,
  TabCompleteResult,
  TerminalAction,
} from "../types/terminal";

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

    default:
      return state;
  }
};

// File content mapping for specific files
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

// Helper function to create properly typed history entries
const createHistoryEntry = (
  text: string,
  type?: "error" | "success" | "info" | "command",
  useTypewriter?: boolean
): HistoryEntry => ({
  text,
  type,
  useTypewriter,
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
    newHistory.push(createHistoryEntry("Available commands:", "info"));
    newHistory.push(
      createHistoryEntry(
        "  ls         List files and directories (names only)",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry("  ls -l      List files in long format", "info")
    );
    newHistory.push(
      createHistoryEntry("  ls -a      List all files including hidden", "info")
    );
    newHistory.push(
      createHistoryEntry("  ls -al     List all files in long format", "info")
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
        "  exit [route] Close terminal and go to specified page (default: home)",
        "info"
      )
    );
    newHistory.push(
      createHistoryEntry("  help       Show this help message", "info")
    );
    newHistory.push(createHistoryEntry("  clear      Clear terminal", "info"));
    newHistory.push(createHistoryEntry("", "info"));
    newHistory.push(
      createHistoryEntry(
        "Tip: Press Tab to autocomplete commands and directory names",
        "info"
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
    dispatch: React.Dispatch<TerminalAction>,
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

class CatCommand implements Command {
  name = "cat";

  execute(
    args: string[],
    history: HistoryEntry[],
    fileSystem: FileSystemItem[],
    dispatch: React.Dispatch<TerminalAction>,
    currentDirectory: string,
    onNavigate?: (route: string) => void,
    state?: TerminalState
  ): HistoryEntry[] {
    const newHistory = [...history];
    // Handle quoted filenames by joining args and removing quotes
    const filename = args.join(" ").replace(/^["']|["']$/g, "");

    if (!filename) {
      newHistory.push(
        createHistoryEntry("Error: Please specify a file to view", "error")
      );
      return newHistory;
    }

    const currentItems = getCurrentDirectoryItems(fileSystem, currentDirectory);
    const file = currentItems.find((item) => item.name === filename);

    if (!file) {
      newHistory.push(
        createHistoryEntry(`Error: File '${filename}' not found`, "error")
      );
      return newHistory;
    }

    if (file.type !== "file") {
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
    } else {
      // Check if we have content for this specific file
      const content = fileContents[filename];
      if (content) {
        // Mark typewriter as active
        dispatch({ type: "SET_ACTIVE_TYPEWRITER", payload: true });

        // Start with the first line
        newHistory.push(createHistoryEntry(content[0], "info", true));

        // Schedule the remaining lines to appear after the previous line completes
        let currentIndex = 1;
        const scheduleNextLine = () => {
          // Check if typewriter was cancelled
          if (state && !state.activeTypewriter) {
            return;
          }

          if (currentIndex < content.length) {
            // Calculate delay based on the length of the previous line
            const previousLine = content[currentIndex - 1];
            const typewriterDelay = previousLine.length * 30; // 30ms per character
            const lineDelay = 100; // Additional delay between lines
            const totalDelay = typewriterDelay + lineDelay;

            setTimeout(() => {
              // Check again if typewriter was cancelled during the delay
              if (state && state.activeTypewriter) {
                dispatch({
                  type: "ADD_HISTORY_ENTRY",
                  payload: createHistoryEntry(
                    content[currentIndex],
                    "info",
                    true
                  ),
                });
                currentIndex++;
                scheduleNextLine();
              }
            }, totalDelay);
          } else {
            // Typewriter animation completed
            dispatch({ type: "SET_ACTIVE_TYPEWRITER", payload: false });
          }
        };

        // Start scheduling the next lines
        scheduleNextLine();
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

        // Mark typewriter as active
        dispatch({ type: "SET_ACTIVE_TYPEWRITER", payload: true });

        // Start with the first line
        newHistory.push(createHistoryEntry(defaultContent[0], "info", true));

        // Schedule the remaining lines to appear after the previous line completes
        let currentIndex = 1;
        const scheduleNextLine = () => {
          // Check if typewriter was cancelled
          if (state && !state.activeTypewriter) {
            return;
          }

          if (currentIndex < defaultContent.length) {
            // Calculate delay based on the length of the previous line
            const previousLine = defaultContent[currentIndex - 1];
            const typewriterDelay = previousLine.length * 30; // 30ms per character
            const lineDelay = 100; // Additional delay between lines
            const totalDelay = typewriterDelay + lineDelay;

            setTimeout(() => {
              // Check again if typewriter was cancelled during the delay
              if (state && state.activeTypewriter) {
                dispatch({
                  type: "ADD_HISTORY_ENTRY",
                  payload: createHistoryEntry(
                    defaultContent[currentIndex],
                    "info",
                    true
                  ),
                });
                currentIndex++;
                scheduleNextLine();
              }
            }, totalDelay);
          } else {
            // Typewriter animation completed
            dispatch({ type: "SET_ACTIVE_TYPEWRITER", payload: false });
          }
        };

        // Start scheduling the next lines
        scheduleNextLine();
      }
    }

    return newHistory;
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
  "exit",
];

export const useTerminal = (
  fileSystem: FileSystemItem[],
  onNavigate: (route: string) => void,
  isVisible: boolean = true
) => {
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

  // Helper function to find item by path
  const findItemByPath = useCallback(
    (path: string): FileSystemItem | null => {
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
    },
    [fileSystem]
  );

  // Command registry using Command Pattern
  const commandRegistry: Record<string, Command> = {
    ls: new LsCommand(),
    cd: new CdCommand(),
    help: new HelpCommand(),
    clear: new ClearCommand(),
    pwd: new PwdCommand(),
    cat: new CatCommand(),
    exit: new ExitCommand(),
  };

  const executeCommand = useCallback(
    (command: string) => {
      const newHistoryEntry = createHistoryEntry(`$ ${command}`, "command");
      dispatchWithSave({ type: "ADD_HISTORY_ENTRY", payload: newHistoryEntry });

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
        const updatedHistory = commandRegistry[commandName].execute(
          expandedArgs,
          [...state.commandHistory, newHistoryEntry], // Pass the updated history
          fileSystem,
          dispatchWithSave, // Pass dispatchWithSave instead of dispatch
          state.currentDirectory,
          onNavigate, // Pass the navigation function
          state // Pass the current state
        );
        dispatchWithSave({
          type: "SET_COMMAND_HISTORY",
          payload: updatedHistory,
        });
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
      fileSystem,
      commandRegistry,
      dispatchWithSave,
    ]
  );

  const getAutocompleteSuggestions = useCallback(
    (input: string): string[] => {
      if (!input.trim()) return [];

      const suggestions: string[] = [];
      // Use the shared helper
      const currentItems = getCurrentDirectoryItems(
        fileSystem,
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
      dispatchWithSave({ type: "SET_CURRENT_COMMAND", payload: command });
    },
    [dispatchWithSave]
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

    // Helpers
    findItemByPath,

    // Computed
    isLoading: false,
  };
};
