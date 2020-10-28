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
            combo_departamentos: {
                data: [{
                    id: 0,
                    nombre: "Cargando..."
                }]
            },
            registro: {
                id: 0,
                idprovincia: 1,
                iddepartamento: 0,
                nombre: "",
                caracteristica: "",
                cp: "",
                latitud: 0,
                longitud: 0,
                descripcion: ""
            },
            filtro: "",
            MsgVisible: false,
            MsgBody: ""
        }
        this.handleFiltroClick = this.handleFiltroClick.bind(this);
        this.handleBusquedaChange = this.handleBusquedaChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.handleFormError = this.handleFormError.bind(this);
        this.handleFormOk = this.handleFormError.bind(this);
        this.handleFormCancel = this.handleFormCancel.bind(this);
    }

    handleFormError = (msg) => {
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

    handleFormOk = (registro) => {
        console.log(registro);
        /*
        this.setState({
            MsgVisible: true,
            MsgBody: registro
        });
        */
    }

    handleFormCancel = () => {
        alert("Asdad");
    }

    

    handleSave() {
        fetch(`${process.env.REACT_APP_API_HOST}/ciudad/${this.state.registro.id}`, {
            method: 'PATCH',
            headers: {
                "Authorization": "asdssffsdff",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.registro)
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
            console.log(error);
            this.setState({
                isLoaded: true,
                error
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
            //Buscar los datos de la Ciudad (Localidad)
            //registro
            fetch(`${process.env.REACT_APP_API_HOST}/ciudad/${id}`, {
                method: 'GET',
                headers: {
                    "Authorization": "asdssffsdff",
                    //"Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then((result) => {
                if(!result.err) {
                    this.setState({registro: result.data.registros[0]});
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

        fetch(`${process.env.REACT_APP_API_HOST}/departamentos`, {
            method: 'GET',
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({
                    combo_departamentos: {
                        data: result.data.registros,
                        selected: result.data.registros[0].id
                    }
                });
            } else {
                this.setState({
                    MsgVisible: true,
                    MsgBody: result.errMsg
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

    render() {
        const filtro = this.state.localidades.data.map((lf) => {
            return (
                // active
                <button type="button" className={`list-group-item list-group-item-action${(lf.id === this.state.localidades.selected) ? " active" : ""}${lf.visible ? " d-block" : " d-none"}`} key={`lloc-${lf.id}`} onClick={(e) => this.handleFiltroClick(lf.id)}>{lf.nombre}</button>
            );
        });
        const departamentos = this.state.combo_departamentos.data.map((d) => {
            return (<option key={`departamento-opt-${d.id}`} value={d.id}>{d.nombre}</option>);
        });
        return (
            <Consumer>
                {value => {
                    return (
                        <React.Fragment>
                            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s"><i className="fas fa-city"></i> Localidades</h4>
                            {
                                this.state.newMode
                                ?
                                <React.Fragment>
                                    <h5>Nueva Localidad</h5>
                                </React.Fragment>
                                :
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <div className="row">
                                            <div className="col-sm-10">
                                                <div className="form-group">
                                                    <label htmlFor="buscar">Buscar</label>
                                                    <input type="text" name="buscar" id="buscar" className="form-control" value={this.state.filtro} onChange={this.handleBusquedaChange} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="col-sm-2">
                                                <button className="btn btn-success btn-mt float-right" onClick={(e) => this.setState({newMode: true})}><i className="fas fa-folder-plus"></i></button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <ul className="list-group">
                                                        {filtro}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (this.state.localidades.selected !== 0)
                                        ?
                                        <React.Fragment>
                                            <div className="col-sm-12 col-md-6">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label htmlFor="iddepartamento">Departamento</label>
                                                            <select name="iddepartamento" id="iddepartamento" className="form-control" value={this.state.registro.iddepartamento} onChange={(e) => this.setState({registro: {...this.state.registro, iddepartamento: e.target.value}})}>
                                                                {departamentos}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label htmlFor="nombre">Localidad</label>
                                                            <input type="text" name="nombre" id="nombre" className="form-control" value={this.state.registro.nombre} onChange={(e) => this.setState({registro: {...this.state.registro, nombre: e.target.value}})} maxLength="50" autoComplete="off" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label htmlFor="caracteristica">Característica</label>
                                                            <input type="text" name="caracteristica" id="caracteristica" className="form-control" value={this.state.registro.caracteristica} onChange={(e) => this.setState({registro: {...this.state.registro, caracteristica: e.target.value}})} maxLength="15" autoComplete="off" />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label htmlFor="cp">Código Postal</label>
                                                            <input type="text" name="cp" id="cp" className="form-control" value={this.state.registro.cp} onChange={(e) => this.setState({registro: {...this.state.registro, cp: e.target.value}})} maxLength="10" autoComplete="off" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label htmlFor="latitud">Latitud</label>
                                                            <input type="text" name="latitud" id="latitud" className="form-control" value={this.state.registro.latitud} onChange={(e) => this.setState({registro: {...this.state.registro, latitud: e.target.value}})} autoComplete="off" />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label htmlFor="longitud">Longitud</label>
                                                            <input type="text" name="longitud" id="longitud" className="form-control" value={this.state.registro.longitud} onChange={(e) => this.setState({registro: {...this.state.registro, longitud: e.target.value}})} autoComplete="off" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label htmlFor="descripcion">Descripción</label>
                                                            <textarea rows="5" name="descripcion" id="descripcion" className="form-control" value={this.state.registro.descripcion} onChange={(e) => this.setState({registro: {...this.state.registro, descripcion: e.target.value}})} autoComplete="off" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <button className="btn btn-dark float-right" onClick={this.handleSave}>Guardar</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <style jsx="true">{`
                                                .btn-mt {
                                                    margin-top: 32px;
                                                }
                                            `}</style>
                                        </React.Fragment>
                                        :
                                        ""
                                    }
                                </div>
                            }
                            
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3">Los datos de Oficinas de Informes, Terminales de Omnibus, Horarios de Colectivos, Cajeros Automáticos y Estaciones de GNC, se desprenden del apartado Servicios, ya que cada uno de estos estará ligado a una Ciudad</div>
                                </div>
                            </div>
                            <Msg visible={this.state.MsgVisible} okClose={() => this.setState({MsgVisible: false})}>
                                {this.state.MsgBody}
                            </Msg>
                            <FormLoc id={33} error={this.handleFormError} ok={this.handleFormOk} cancel={this.handleFormCancel} />
                        </React.Fragment>
                    )
                }}
            </Consumer>
        );
    }
}

export default Localidades;
