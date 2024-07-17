import React from 'react';
import './Work.css';
import WorkList from '../../components/WorkList';
import TypeWriterText from '../../components/TypeWriterText';

const Work = () => {
  return (
    <div className='work-content'>
      <div className='work-title'>
        <TypeWriterText text="Work" delay={2000} />
      </div>
      <WorkList />
    </div>
  );
};

export default Work;
