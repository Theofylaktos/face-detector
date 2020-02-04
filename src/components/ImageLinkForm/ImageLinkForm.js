import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => { //getting onInputChange & onButtonSubmit from App.js + destructuring (the {prop} thing) onInputChange & onButtonSubmit from props (properties)
    return (
        <div>
            <p className='f3'>
                {'This Smart Brain will detect faces in your pictures! Want to try?'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 br-0 bt-0 bw1 bl bl-0 b--black bg-transparent outline-0' type='text' onChange={onInputChange}/> {/* create event listener for the text input and on change call onInputChange from App.js and pass the event: onInputChange(event) */}
                    <button className='btn dib w-30 f4 underline link black bg-transparent bw0 pa0 outline-0 over'
                        onClick={onButtonSubmit} //creating button event listener | when clicked, call onButtonSubmit from App.js and pass the event: onButtonSubmit(event)
                    >Detect</button>
                </div>
               </div>
        </div>
    );
};

export default ImageLinkForm;