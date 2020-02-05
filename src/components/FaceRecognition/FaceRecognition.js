import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box}) => { //getting imageUrl from App.js
    const faceBoxes = box.map((face,index) => { //Todo change key value from index to something unique
        return <div key={index} className='bounding-box' style={{top: face.topRow, right: face.rightCol, bottom: face.bottomRow, left: face.leftCol}}></div>;
    });
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' alt='' src={imageUrl} style={{minWidth:'320px', width:'320px', height:'auto'}}/>
                {faceBoxes}
            </div>
        </div>
    );
};

export default FaceRecognition;