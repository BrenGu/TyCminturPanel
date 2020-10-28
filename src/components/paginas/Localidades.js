import React, { Component } from "react";
import { Consumer } from "../../context";
import FormLoc from "./comlocalidades/FormLoc";
import Msg from "../utiles/Msg";

class Localidades extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            newMode: false,
            localidades: {
                data: [{
                    id: 0,
                    nombre: "Cargando...",
                    visible: true
                }],
                selected: 0
            },
            filtro: "",
            MsgVisible: false,
            MsgBody: ""
        }
        this.handleFiltroClick = this.handleFiltroClick.bind(this);
        this.handleBusquedaChange = this.handleBusquedaChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleNew = this.handleNew.bind(this);

        this.fireNew = this.fireNew.bind(this);

        this.handleFormError = this.handleFormError.bind(this);
        this.handleFormOk = this.handleFormOk.bind(this);
        this.handleFormCancel = this.handleFormCancel.bind(this);
    }

    fireNew() {
        this.setState({
            localidades: {
                ...this.state.localidades,
                selected: 0
            },
            newMode: true
        });
    }

    handleFormError(msg) {
        let msgshow = "";
        if(Array.isArray(msg)) {
            msgshow = msg.join(", ");
        } else {
            msgshow = msg;
        }
        this.setState({
            MsgVisible: true,
            MsgBody: msgshow
        });
    }

    handleFormOk(registro) {
        registro = JSON.parse(registro);
        if(registro.id === 0) {
            this.handleNew(registro);
        } else {
            this.handleSave(registro);
        }
    }

    handleFormCancel() {
        this.setState({newMode: false});
    }

    handleNew(registro) {
        //La Api devuelve insertId
        fetch(`${process.env.REACT_APP_API_HOST}/ciudad`, {
            method: 'POST',
            headers: {
                "Authorization": "asdssffsdff",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registro)
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({
                    newMode: false,
                    MsgVisible: true,
                    MsgBody: "La Localidad se agregó correctamente."
                }, () => {
                    this.componentDidMount();
                    //Esto posiblemente no funcione bien
                    /*
                    this.setState({
                        localidades: {
                            selected: result.insertId
                        }
                    })
                    */
                });
            } else {
                this.setState({
                    MsgVisible: true,
                    MsgBody: result.errMsgs.join(", ")
                });
            }
        }, (error) => { //???
            this.setState({
                MsgVisible: true,
                MsgBody: error
            });
        });
    }
    
    handleSave(registro) {
        fetch(`${process.env.REACT_APP_API_HOST}/ciudad/${registro.id}`, {
            method: 'PATCH',
            headers: {
                "Authorization": "asdssffsdff",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registro)
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({
                    MsgVisible: true,
                    MsgBody: "Los datos se actualizaron correctamente."
                });
            } else {
                this.setState({
                    MsgVisible: true,
                    MsgBody: result.errMsgs.join(", ")
                });
            }
        }, (error) => { //???
            this.setState({
                MsgVisible: true,
                MsgBody: error
            });
        });
    }

    handleBusquedaChange(event) {
        let valor = event.target.value;
        this.setState({filtro: valor}, () => {
            var copy = Object.assign([], this.state.localidades.data);
            copy = copy.map((d) => {
                if(d.nombre.toLowerCase().indexOf(valor.toLowerCase()) > -1) {
                    d.visible = true;
                } else {
                    d.visible = false;
                }
                return d;
            });
            this.setState({
                localidades: {
                    ...this.state.localidades,
                    data: copy,
                    selected: 0
                }
            });
        });
    }

    handleFiltroClick(id) {
        this.setState({
            localidades: {
                ...this.state.localidades,
                selected: id
            }
        }, () => {
            if(window.scrollY > 350) {
                window.scrollTo(0, 140);
            }
        });
    }

    componentDidMount() {
        //Lista de Localidades
        fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
            method: 'GET',
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                var setX = result.data.registros.map((v) => {
                    return {
                        ...v,
                        visible: true
                    }
                });
                this.setState({
                    localidades: {
                        data: setX,
                        selected: setX[0].id
                    }
                }, () => {
                    this.handleFiltroClick(this.state.localidades.selected);
                });
            } else {
                this.setState({
                    MsgVisible: true,
                    MsgBody: result.errMsg
                });
            }
        }, (error) => { //???
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    render() {
        /*
        const filtro = this.state.localidades.data.map((lf) => {
            return (
                // active
                <button type="button" className={`list-group-item list-group-item-action${(lf.id === this.state.localidades.selected) ? " active" : ""}${lf.visible ? " d-block" : " d-none"}`} key={`lloc-${lf.id}`} onClick={(e) => this.handleFiltroClick(lf.id)}>{lf.nombre}</button>
            );
        });
        */
       const filtro = this.state.localidades.data.map((lf) => {
            return (
                // active
                <span className={`spanloc ${(lf.id === this.state.localidades.selected) ? "active" : ""}${lf.visible ? " d-block" : " d-none"}`} key={`lloc-${lf.id}`} onClick={(e) => this.handleFiltroClick(lf.id)}>{lf.nombre}</span>
            );
        });
        const localidad_selected = this.state.localidades.selected;
        const new_mode = this.state.newMode;
        return (
            <Consumer>
                {value => {
                    return (
                        <React.Fragment>
                            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s"><i className="fas fa-city"></i> Localidades</h4>
                            <div className="row justify-content-center mb-5">
                                {
                                    !this.state.newMode
                                    ?
                                    <div className="col-sm-12 col-md-12">
                                        <div className="row justify-content-center">
                                            <div className="col-sm-10 col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="buscar">Buscar</label>
                                                    <input type="text" name="buscar" id="buscar" className="form-control" value={this.state.filtro} onChange={this.handleBusquedaChange} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="col-sm-2 col-md-2">
                                                <button className="btn btn-success btn-mt" onClick={this.fireNew}><i className="fas fa-folder-plus"></i></button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <div className="d-flex justify-content-center flex-wrap">
                                                        {filtro}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    ""
                                }
                               
                                {
                                    (localidad_selected !== 0 || new_mode)
                                    ?
                                    <React.Fragment>
                                        <FormLoc id={localidad_selected} error={this.handleFormError} ok={this.handleFormOk} cancel={this.handleFormCancel} />
                                    </React.Fragment>
                                    :
                                    <React.Fragment>Esperando Elección</React.Fragment>
                                }
                            </div>
                            <Msg visible={this.state.MsgVisible} okClose={() => this.setState({MsgVisible: false})}>
                                {this.state.MsgBody}
                            </Msg>
                            <style jsx="true">{`
                                .btn-mt {
                                    margin-top: 32px;
                                }
                                .spanloc {
                                    padding: 4px 8px;
                                    margin: 8px 8px;
                                    background-color: #ccc;
                                    -webkit-border-radius: 4px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                }
                                .spanloc.active {
                                    background-color: #007bff;
                                    color: #fff;
                                }
                            `}</style>
                        </React.Fragment>
                    )
                }}
            </Consumer>
        );
    }
}

export default Localidades;
