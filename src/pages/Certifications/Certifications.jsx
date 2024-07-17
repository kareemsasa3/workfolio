import React from 'react';
import './Certifications.css';
import TypeWriterText from '../../components/TypeWriterText';
import CertificationDetails from '../../components/CertificationDetails';

const Certifications = () => {
  return (
    <div className='certifications-content'>
      <div className='certifications-title'>
        <TypeWriterText text="Certifications" delay={2400} />
      </div>
      <CertificationDetails
        largeText="Oracle Certified Associate, Java SE 8 Programmer"
        smallText="Valid Sep. 2021 - Sep. 2024"
      />
    </div>
  );
};

export default Certifications;
