import React, { Component } from "react";
import ddToDms from "../../../gm";
import Msg from "../../utiles/Msg";

/*
    Parámetros:
    idlocalidad: Id de la Ciudad (Localidad)
*/

class FormOfi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            localidadNombre: "",
            registro: {
                id: 0,
                idlocalidad: 0,
                domicilio: "",
                telefono: "",
                interno: "",
                mail: "",
                web: "",
                responsable: "",
                latitud: 0,
                longitud: 0,
                latitudg: 0,
                longitudg: 0
            },
            msg: {
                visible: false,
                body: ""
            }
        };
        this.resetData = this.resetData.bind(this);
        this.setData = this.setData.bind(this);
        this.setLatLng = this.setLatLng.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveData = this.saveData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        /*
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        */
        
    }

    deleteData(id) {
        fetch(`${process.env.REACT_APP_API_HOST}/oficina/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "asdssffsdff"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({
                    msg: {
                        visible: true,
                        body: "Los datos se eliminaron correctamente"
                    }
                }, () => {
                    this.setData();
                });
            } else {
                this.setState({
                    msg: {
                        visible: true,
                        body: result.errMsg
                    }
                });
            }
        }, (error) => { //???
            this.setState({
                msg: {
                    visible: true,
                    body: error
                }
            });
        });
    }

    saveData() {
        let url = "";
        let metodo = "";
        if((parseInt(this.state.registro.id, 10) > 0) && (parseInt(this.state.registro.idlocalidad, 10) > 0)) {
            url = `${process.env.REACT_APP_API_HOST}/oficina/${this.state.registro.id}`;
            metodo = "patch";
        } else if((parseInt(this.state.registro.id, 10) === 0) && (parseInt(this.state.registro.idlocalidad, 10) > 0)) {
            url = `${process.env.REACT_APP_API_HOST}/oficina/${this.state.registro.idlocalidad}`;
            metodo = "post";
        } else {
            console.log("Error!");
        }
        fetch(url, {
            method: metodo,
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
                    msg: {
                        visible: true,
                        body: "Los datos se actualizaron correctamente"
                    }
                });
            } else {
                this.setState({
                    msg: {
                        visible: true,
                        body: result.errMsg
                    }
                });
            }
        }, (error) => { //???
            this.setState({
                msg: {
                    visible: true,
                    body: error
                }
            });
        });
    }

    resetData(idlocalidad) {
        this.setState({
           registro: {
                id: 0,
                idlocalidad: idlocalidad,
                domicilio: "",
                telefono: "",
                interno: "",
                mail: "",
                web: "",
                responsable: "",
                latitud: 0,
                longitud: 0,
                latitudg: 0,
                longitudg: 0
            }
        });
    }

    setLatLng() {
        let LatLng = ddToDms(this.state.registro.latitud, this.state.registro.longitud);
        this.setState({
            registro: {
                ...this.state.registro,
                latitudg: LatLng.lat,
                longitudg: LatLng.lng
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
            registro: {
                ...this.state.registro,
                [name]: value
            }
        }, () => {
            if(name === "latitud" || name === "longitud") {
                let grados = ddToDms(this.state.registro.latitud, this.state.registro.longitud);
                this.setState({
                    registro: {
                        ...this.state.registro,
                        latitudg: grados.lat,
                        longitudg: grados.lng
                    }
                });
            }
        });
    }

    setData() {
        let idlocalidad = parseInt(this.props.localidad.id, 10);
        if(idlocalidad === 0) {
            this.resetData(idlocalidad);
        } else {
            this.setState({
                localidadNombre: this.props.localidad.nombre,
                registro: {
                    ...this.state.registro,
                    idlocalidad: idlocalidad
                }
            }, () => {
                fetch(`${process.env.REACT_APP_API_HOST}/oficinas/localidad/${idlocalidad}`, {
                    method: "GET",
                    headers: {
                        "Authorization": "asdssffsdff",
                        //"Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then((result) => {
                    if(!result.err) {
                        if(parseInt(result.data.count, 10) > 0) {
                            //Se Supone que solo existirá una oficina por Localidad
                            this.setState({
                                registro: result.data.registros[0]
                            });
                        } else {
                            this.resetData(idlocalidad);
                        }
                    } else {
                        this.setState({
                            msg: {
                                visible: true,
                                body: result.errMsg
                            }
                        });
                    }
                }, (error) => { //???
                    this.setState({
                        msg: {
                            visible: true,
                            body: error
                        }
                    });
                });
            });
        }
    }

    componentDidMount() {
        this.setData();
    }

    componentDidUpdate(prevProps) {
        if(this.props.localidad !== prevProps.localidad) {
            this.setData();
        }
    }

    render() {
        const nombre_localidad = this.state.localidadNombre;
        const esEdicion = this.state.registro.id > 0;
        return(
            <React.Fragment>
                {
                    this.state.isLoaded
                    ?
                    <React.Fragment>
                        <div className="row">
                            <div className="col-sm-12 col-md-12 bg-primary text-white p-2 mb-3">
                                <div style={{fontSize: "1.4rem"}}>Datos de la Oficina Turística en {nombre_localidad}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-6 m-auto">
                                <div className="form-group">
                                    <label htmlFor="domicilio">Domicilio</label>
                                    <input type="text" name="domicilio" id="domicilio" className="form-control" value={this.state.registro.domicilio} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3 m-auto">
                                <div className="form-group">
                                    <label htmlFor="telefono">Teléfono</label>
                                    <input type="text" name="telefono" id="telefono" className="form-control" value={this.state.registro.telefono} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3 m-auto">
                                <div className="form-group">
                                    <label htmlFor="interno">Interno</label>
                                    <input type="text" name="interno" id="interno" className="form-control" value={this.state.registro.interno} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 m-auto">
                                <div className="form-group">
                                    <label htmlFor="mail">Email</label>
                                    <input type="text" name="mail" id="mail" className="form-control" value={this.state.registro.mail} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 m-auto">
                                <div className="form-group">
                                    <label htmlFor="web">Página Web</label>
                                    <input type="text" name="web" id="web" className="form-control" value={this.state.registro.web} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 m-auto">
                                <div className="form-group">
                                    <label htmlFor="responsable">Responsable</label>
                                    <input type="text" name="responsable" id="responsable" className="form-control" value={this.state.registro.responsable} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3 m-auto">
                                <div className="form-group">
                                    <label htmlFor="latitud">Latitud</label>
                                    <input type="text" name="latitud" id="latitud" className="form-control" value={this.state.registro.latitud} onChange={this.handleInputChange} />
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-3 m-auto">
                                <div className="form-group">
                                    <label htmlFor="longitud">Longitud</label>
                                    <input type="text" name="longitud" id="longitud" className="form-control" value={this.state.registro.longitud} onChange={this.handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-5">
                            <div className="col">
                                {
                                    esEdicion ?
                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-danger" onClick={(e) => this.deleteData(this.state.registro.id, e)}>Eliminar</button>
                                        <button type="button" className="btn btn-primary" onClick={this.saveData}>Guardar</button>
                                    </div>
                                    :
                                    <div className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary" onClick={this.saveData}>Guardar</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </React.Fragment>
                    :
                    <h1>Cargando...</h1>
                }
                <Msg visible={this.state.msg.visible} okClose={() => this.setState({msg: {...this.state.msg, visible: false}})} tipo="0">
                    {this.state.msg.body}
                </Msg>
            </React.Fragment>
        );
    }
}

export default FormOfi;