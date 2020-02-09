import React, {Component} from 'react';
import Navigation from '../components/Navigation/Navigation';
import Logo from "../components/Logo/Logo";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import Rank from "../components/Rank/Rank";
import Particles from "react-particles-js";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";
import SignIn from "../components/SignIn/SignIn";
import Register from "../components/Register/Register";
import './App.css';


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
const initialState= {
    input: '', //that's the user's input
    imageUrl: '',
    // modalIsOpen: false,
    box: [], //that's the face box array that gets sent to FaceRecognition.js
    route: 'signin', //keeps track of where we are in the page
    isSignedIn: '',
    user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component{

    constructor() { //creating constructor in order to get state
        super();
        this.state = initialState;
    }
    loadUser = (data) => {
        this.setState({user: {
            id:data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
        }})
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
        this.setState({box});
    };

    onInputChange = (event) => { //this func gets called in ImageLinkForm.js from the text input onChange event listener
        this.setState({input: event.target.value});
    };

    onPictureSubmit = () => { //this func gets called in ImageLinkForm.js when Detect button gets clicked from the onClick event listener
        this.setState({imageUrl: this.state.input}); //updating imageUrl with whatever the input from the text area is, so the imageUrl can be passed down to FaceRecognition as prop
        fetch('https://fathomless-lake-96510.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response) {
                    fetch('https://fathomless-lake-96510.herokuapp.com/image', {
                        method: 'put',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id,
                            box: this.state.box
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, {entries: count}))
                        })
                        .catch(console.log);
                }
                this.diaplayFaceBox(this.calculateFaceLocation(response))
            })//passing response box position values to calculateFaceLocation and then it passes the outcome to the displayFaceBox in order to draw the box on the image
                .catch(err => console.log('Error',err));
    };

    onRouteChange = (route) => { //creating event handler...
        if (route === 'signout') {
            this.setState(initialState);
        } else if (route === 'home') {
            this.setState({isSignedIn: true});
        }
        this.setState({route:route});
    };

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state; //destructuring
        return (
            <div className="App">
                <Particles className='particles'
                           params={particlesOptions} />
                <Navigation isSignedIn={isSignedIn} route={route} onRouteChange={this.onRouteChange}/>
                { this.state.route === 'home'
                    ?  <div>
                        <Logo />
                        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onPictureSubmit={this.onPictureSubmit}/> {/*passing onInputChange and onPictureSubmit as a prop to ImageLinkForm.js (property of the App)*/}
                        <FaceRecognition box={box} imageUrl={imageUrl}/> {/*passing imageUrl and box to FaceRecognition.js*/}
                    </div>
                    : (
                        route === 'register'
                        ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                        : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    )
                }
            </div>
        );
    }
}

export default App;
