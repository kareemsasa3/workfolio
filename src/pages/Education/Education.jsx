import React from 'react';
import './Education.css';
import TypeWriterText from '../../components/TypeWriterText';
import EducationDetails from '../../components/EducationDetails';

const Education = () => {
  return (
    <div className='education-content'>
      <div className='education-title'>
        <TypeWriterText text="Education" delay={2200} />
      </div>
      <EducationDetails
        largeText="Bachelor of Science in Computer Science"
        smallText="University of Texas at San Antonio, 2017-2021"
      />
    </div>
  );
};

export default Education;
