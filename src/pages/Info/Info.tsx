import "./Info.css";
import TypeWriterText from "../../components/TypeWriterText";

const Info = () => {
  return (
    <div className="info-content">
      <div className="info-title">
        <TypeWriterText text="More About Me" delay={0} speed={80} />
      </div>
      <div className="social-links">
        <a
          href="https://github.com/kareemsasa3"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/kareemsasa"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://youtube.com/@kareemsasa"
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube
        </a>
        <a
          href="https://instagram.com/kareemsasa"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://x.com/kareemsasa"
          target="_blank"
          rel="noopener noreferrer"
        >
          X
        </a>
      </div>
    </div>
  );
};

export default Info;
