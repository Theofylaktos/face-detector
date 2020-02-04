import React from 'react';
import Tilt from "react-tilt";
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt parallax-effect br2 shadow-2 flex justify-center items-center"
                  options={{ max : 50 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner">
                    <img alt='logo' src={brain}/>
                </div>
            </Tilt>
        </div>
    );
};

export default Logo;