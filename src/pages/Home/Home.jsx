import TypeWriterText from '../../components/TypeWriterText';
import './Home.css';

const Home = () => {
    return (
        <div className='home-content'>
            <div className='description'>
                <TypeWriterText 
                    text="My journey in web development is driven by a desire to blend aesthetics with functionality, ensuring every project I undertake is both visually appealing and highly performant."
                    delay={0}
                />
            </div>
        </div>
    );
};

export default Home;