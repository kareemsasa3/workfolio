import React from 'react';
import './Projects.css';
import ProjectsList from '../../components/ProjectsList';
import TypeWriterText from '../../components/TypeWriterText';

const Projects = () => {
  return (
    <div className='projects-content'>
      <div className='projects-title'>
        <TypeWriterText text="Projects" delay={0} />
      </div>
      <ProjectsList />
    </div>
  );
};

export default Projects;
