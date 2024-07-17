import React from 'react';
import './WorkDetails.css';
import TypeWriterText from '../TypeWriterText';

const WorkDetails = ({ smallText, largeText, url }) => {
    return (
        <div className='work-container'>
            <div className='work-text large-font'>
                <a className='company-link' href={url} target='_blank' rel='noopener noreferrer'>
                    <TypeWriterText text={largeText} delay={3500} />
                </a>
            </div>
            <div className='work-text small-font'>
                <TypeWriterText text={smallText} delay={4000} />
            </div>
        </div>
    );  
};

export default WorkDetails;