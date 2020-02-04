import React, {Component} from 'react';
import Navigation from '../components/Navigation/Navigation';
import Logo from "../components/Logo/Logo";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import Rank from "../components/Rank/Rank";
import Particles from "react-particles-js";
import Clarifai from 'clarifai';
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import './App.css';

const app = new Clarifai.App({
    apiKey: 'bc6bc358244541979d74584721f50fa0'//Clarifai Api Key
});

const particlesOptions = { //background component options
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
};

class App extends Component{

    constructor() { //creating constructor in order to get state
        super();
        this.state = {
            input: '', //that's the user's input
            imageUrl: '',
            // modalIsOpen: false,
            box: [] //that's the face box array that gets sent to FaceRecognition.js
        };
    }

    calculateFaceLocation = (data) => { //< calculates face location
        //const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.querySelector('#inputImage'); //selecting the image for detection
        const width = Number(image.width); //it's string and we turn it to a number
        const height = Number(image.height);
        const clarifaiMultipleFaces = data.outputs[0].data.regions.map(face => {
            let boxCoords =  face.region_info.bounding_box;
            return {
                leftCol: boxCoords.left_col * width,
                topRow: boxCoords.top_row * height,
                rightCol: width - (boxCoords.right_col * width),
                bottomRow: height - (boxCoords.bottom_row * height)
            }
        });
        return clarifaiMultipleFaces //returns array with positions of each face (box)
    };

    diaplayFaceBox = (box) => { //setting the box state
        this.setState({box: box});
    };

    onInputChange = (event) => { //this func gets called in ImageLinkForm.js from the text input onChange event listener
        this.setState({input: event.target.value});
    };

    onButtonSubmit = () => { //this func gets called in ImageLinkForm.js when Detect button gets clicked from the onClick event listener
        this.setState({imageUrl: this.state.input}); //updating imageUrl with whatever the input from the text area is, so the imageUrl can be passed down to FaceRecognition as prop
        app.models.predict(
            Clarifai.FACE_DETECT_MODEL, //setting face detection as model //image link from textarea
            this.state.input).then(response => this.diaplayFaceBox(this.calculateFaceLocation(response))//passing response box position values to calculateFaceLocation and then it passes the outcome to the displayFaceBox in order to draw the box on the image
                .catch(err => console.log(err)));
    };

    render() {
        return (
            <div className="App">
                <Particles className='particles'
                           params={particlesOptions} />
                <Navigation />
                <Logo />
                <Rank />
                <ImageLinkForm
                    onInputChange={this.onInputChange}
                    onButtonSubmit={this.onButtonSubmit}/> {/*passing onInputChange and onButtonSubmit as a prop to ImageLinkForm.js (property of the App)*/}
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/> {/*passing imageUrl and box to FaceRecognition.js   */}
            </div>
        );
    }
}

export default App;
