import React, { Component } from "react";
import { Consumer } from "../../context";
import Zona from "./comzonas/Zona";
import Msg from "../utiles/Msg";

class Zonas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            zonas: [],
            nombre: "",
            MsgVisible: false,
            MsgBody: ""
        }
        this.handleAddZona = this.handleAddZona.bind(this);
    }

    handleAddZona = () => {
        var token = this.context.token;
        fetch(`${process.env.REACT_APP_API_HOST}/zona`, {
            method: 'POST',
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nombre: this.state.nombre})
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({nombre: ""});
                this.componentDidMount();
            } else {
                this.setState({
                    MsgVisible: true,
                    MsgBody: result.errMsgs.join(", ")
                });
            }
        }, (error) => { //???
            console.log(error);
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    componentDidMount() {
        var token = this.context.token;
        fetch(`${process.env.REACT_APP_API_HOST}/zonas`, {
            method: "GET",
            headers: new Headers({
                "Authorization": token,
                "Content-Type": "application/json"
            })
        })
        .then(res => res.json())
        .then((result) => {
            this.setState({
                isLoaded: true,
                zonas: result.data.registros
            });
        }, (error) => { //???
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    render() {
        const zonas = this.state.zonas.map((zona) => {
            return(
                <Zona key={`zona-${zona.id}`} id={zona.id} />
            );
        });
        return (
            <Consumer>
                {value => {
                    return (
                        <React.Fragment>
                            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s"><i className="fas fa-map-marked-alt"></i> Zonas</h4>
                            <div className="row mb-3">
                                <div className="col">
                                    <button className="btn btn-dark btn-block" type="button" data-toggle="collapse" data-target="#nueva_zona" aria-expanded="false" aria-controls="nueva_zona">
                                        Nueva Zona
                                    </button>
                                    <div className="collapse" id="nueva_zona">
                                        <div className="card card-body">
                                            <div className="row">
                                                <div className="col-md-10">
                                                    <div className="form-group">
                                                        <label htmlFor="new_nombre">Nombre</label>
                                                        <input type="text" name="new_nombre" id="new_nombre" className="form-control" value={this.state.nombre} onChange={(e) => this.setState({nombre: e.target.value})} />
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <button className="btn btn-dark btn-block btn-mt" onClick={this.handleAddZona}><i className="fas fa-arrow-down"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    Zonas Cargadas
                                </div>
                            </div>
                            {zonas}
                            <Msg visible={this.state.MsgVisible} okClose={() => this.setState({MsgVisible: false})}>
                                {this.state.MsgBody}
                            </Msg>
                        </React.Fragment>
                    )
                }}
            </Consumer>
        );
    }
}

Zonas.contextType = Consumer;

export default Zonas;