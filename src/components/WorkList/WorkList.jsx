import React from "react"
import './WorkList.css';
import WorkDetails from "../WorkDetails";

const WorkList = () => {
    return (
        <div className="work-list-content">
            <ul className='work-directory'>
                <li className='exp'>
                    <WorkDetails smallText="Jul. 2021 - Oct. 2022" largeText="CAPGEMINI / SOFTWARE DEVELOPER" url='https://www.capgemini.com' />
                </li>
                <li className='exp'>
                    <WorkDetails smallText="Oct. 2023 - Present" largeText="VARSITY TUTORS / PROGRAMMING TUTOR" url='https://www.varsitytutors.com' />
                </li>
            </ul>
        </div>
    );
};

export default WorkList;