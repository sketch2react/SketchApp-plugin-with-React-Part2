import React, {Component} from 'react';

class App extends Component {
  constructor(props){
    super(props);

    // We bind it this way, since support for class properties are 
    // not included in the boilerplate project.
    this.handleSendDataEvent = this.handleSendDataEvent.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.state = {};
  }

  handleSendDataEvent(e){
    this.setState({
      data: e.detail.data
    });
  }

  handleButtonClick(e){
    const newName = `${this.state.data} 🦖`;

    window.postMessage('setLayerName', newName); 
    
    this.setState({
      data: newName 
    });
  }

  componentDidMount(){
    window.addEventListener("send-data", this.handleSendDataEvent);
  }

  componentWillUnmount(){
    window.removeEventListener("send-data", this.handleSendDataEvent);
  }

  render(){
    return(<div>
            <p>{this.state.data}</p>
            <button onClick={this.handleButtonClick}>Watch out for the dinosaur!</button>
          </div>)
  }
}

export default App;