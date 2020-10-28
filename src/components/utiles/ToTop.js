import React, { Component } from "react";

class ToTop extends Component {
    constructor(props) {
        super(props);
        this.topFunction = this.topFunction.bind(this);
    }

    topFunction() {
        document.body.scrollTop = 0; // Safari
        document.documentElement.scrollTop = 0; // Chrome, Firefox, IE y Opera
    }

    componentDidMount() {
        this.setState({
            showAt: parseInt(this.props.showAt, 10)
        }, () => {
            window.onscroll = () => {
                if(document.body.scrollTop > this.state.showAt || document.documentElement.scrollTop > this.state.showAt) {
                    document.getElementById("myBtn").style.display = "block";
                } else {
                    document.getElementById("myBtn").style.display = "none";
                }
            };
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="ToTop">
                    <button id="myBtn" onClick={this.topFunction}><i className="fas fa-arrow-alt-circle-up"></i></button>
                </div>
                <style jsx="true">{`  
                    #myBtn {
                        display: none; /* Hidden by default */
                        position: fixed; /* Fixed/sticky position */
                        bottom: 20px; /* Place the button at the bottom of the page */
                        right: 50%; /* Place the button 30px from the right */
                        z-index: 99; /* Make sure it does not overlap */
                        border: none; /* Remove borders */
                        outline: none; /* Remove outline */
                        background-color: rgba(0, 0, 0, .3); /* Set a background color */
                        color: white; /* Text color */
                        cursor: pointer; /* Add a mouse pointer on hover */
                        padding: 5px 10px; /* Some padding */
                        border-radius: 5px; /* Rounded corners */
                        font-size: 16px; /* Increase font size */
                        transform: translateX(50%);
                        -webkit-transition: all .1s linear; /* Safari */
                        transition: all .1s linear;
                    }

                    #myBtn:hover {
                        font-size: 22px; /* Increase font size */
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default ToTop;