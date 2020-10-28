import React, { Component } from "react";
const Context = React.createContext();

//Provider
export class Provider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            token: "",
            login: this.login.bind(this)
        };
        this.login = this.login.bind(this);
    }

    async login(data) {
        try {
            let res = await fetch(`${process.env.REACT_APP_API_HOST}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            let respuesta = await res.json();
            if(respuesta.err) {
                return respuesta
            } else {
                this.setState({
                    auth: true,
                    token: respuesta.data.token
                });
                return { "err": false };
            }
        } catch(e) {
            return {
                err: true,
                errMsg: e.message,
                errMsgs: [e.message]
            }
        }
    }

    componentWillMount() {
        
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                { this.props.children }
            </Context.Provider>
        )
    }
}

//Consumer
export const Consumer = Context.Consumer;
