import React, { Component } from "react";
import { Consumer } from "../../context";
import Msg from "../utiles/Msg";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: {
                email: "",
                password: ""
            },
            msg: {
                visible: false,
                body: ""
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formatMsg = this.formatMsg.bind(this);
    }

    formatMsg(value) {
        if(Object.prototype.toString.call(value) === "[object Array]") {
            let divs = value.map((v, index) => {
                return (<div key={`msg-${index}`}>{v}</div>);
            });
            return divs;
        } else {
            return value;
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let resp = this.context.login(this.state.data);
        resp.then((datos) => {
            if(datos.err) {
                this.setState({
                    msg: {
                        visible: true,
                        body: datos.errMsgs
                    }
                });
            } else {
                this.props.okLogin();
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="Login">
                    <div className="navbar navbar-dark bg-dark"><span className="navbar-brand mb-0 h1 mx-auto">SisTur</span></div>
                    <div className="container mt-5">
                        <div className="row">
                            <div className="col-sm-12 col-md-4 m-auto">
                                <form method="post" autoComplete="false" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" aria-describedby="mailHelp" placeholder="Ingrese email" value={this.state.data.email} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña</label>
                                        <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={this.state.data.password} onChange={this.handleChange} />
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">Ingresar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Msg visible={this.state.msg.visible} okClose={() => this.setState({msg: { ...this.state.msg, visible: false}})} okAceptar={null} tipo="0">
                    {this.state.msg.body}
                </Msg>
                <style jsx="true">{`
                `}</style>
            </React.Fragment>
        );
    }
}

Login.contextType = Consumer;

export default Login;
