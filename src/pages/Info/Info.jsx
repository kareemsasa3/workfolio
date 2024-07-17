import React from 'react';
import './Info.css';
import TypeWriterText from '../../components/TypeWriterText';

const Info = () => {
  return (
    <div className='info-content'>
      <div className='more-title'>
        <TypeWriterText text="More About Me" delay={0} />
      </div>
        <ul>
          <li>
            <a href='https://github.com/kareemsasa3' target='_blank' rel='noopener noreferrer'>
              <TypeWriterText text="GitHub" delay={200} />
            </a>
          </li>
          <li>
            <a href='https://linkedin.com/in/kareem-sasa' target='_blank' rel='noopener noreferrer'>
              <TypeWriterText text="LinkedIn" delay={400} />
            </a>
          </li>
          <li>
            <a href='https://www.youtube.com/@Sassasin2011' target='_blank' rel='noopener noreferrer'>
              <TypeWriterText text="YouTube" delay={600} />
            </a>
          </li>
          <li>
            <a href='https://www.instagram.com/kareem_the_dream' target='_blank' rel='noopener noreferrer'>
              <TypeWriterText text="Instagram" delay={800} />
            </a>
          </li>
          <li>
            <a href='https://x.com/tennisantelope' target='_blank' rel='noopener noreferrer'>
              <TypeWriterText text="X" delay={1000} />
            </a>
          </li>
        </ul>
    </div>
  );
};

export default Info;
