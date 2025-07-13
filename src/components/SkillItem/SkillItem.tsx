import { useState, useEffect, useRef } from "react";
import "./SkillItem.css";

interface SkillItemProps {
  name: string;
  icon: string;
  index: number;
}

const SkillItem = ({ name, icon, index }: SkillItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Disconnect after it's visible to save resources
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = itemRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <li
      ref={itemRef}
      className={`skill-item ${isVisible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <span className="skill-icon" aria-hidden="true">
        {icon}
      </span>
      {name}
    </li>
  );
};

export default SkillItem;
