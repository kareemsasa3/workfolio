import React from 'react';
import './ProjectDetails.css';
import TypeWriterText from '../TypeWriterText';

const ProjectDetails = ({ smallText, largeText, url }) => {
    return (
        <div className='project-container'>
            <div className='project-text large-font'>
                <a className='project-link' href={url} target='_blank' rel='noopener noreferrer'>
                    <TypeWriterText text={largeText} delay={200} />
                </a>
            </div>
            <div className='project-text small-font'>
                <TypeWriterText text={smallText} delay={400} />
            </div>
        </div>
    );  
};

export default ProjectDetails;