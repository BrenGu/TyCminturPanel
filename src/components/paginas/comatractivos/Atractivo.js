import React, { Component, useState} from "react";
import Msg from "../../utiles/Msg";

import 'bootstrap/dist/css/bootstrap.min.css'
import axios from "axios";

import Galeria from "./Galeria";
import ddToDms from "../../../gm";
import MyEditor from "../../paginas/subcomponentes/MyEditor";

class Atractivo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errMsg: "",
            tipos: [],
            atractivo: {
                id: 0,
                idlocalidad: 0,
                idTipo: 0,
                tipo: "",
                nombre: "",
                domicilio: "",
                descripcion: "",
                descripcionHTML: "",
                latitud: 0,
                longitud: 0,
                latitudg: 0,
                longitudg: 0,
                telefono: "",
                mail: "",
                web: "",
                costo: 0,
                lunes: "",
                martes: "",
                miercoles: "",
                jueves: "",
                viernes: "",
                sabado: "",
                domingo: "",
                audio:""
            },
            Msg: {
                MsgTipo: 0,
                MsgVisible: false,
                MsgBody: ""
            },
            file:'',
            idDelete: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveAtractivo = this.saveAtractivo.bind(this);
        this.fireMsg = this.fireMsg.bind(this);
        this.setLatLng = this.setLatLng.bind(this);
        this.setDays = this.setDays.bind(this);
        this.msgDelAtractivo = this.msgDelAtractivo.bind(this);
        this.delAtractivo = this.delAtractivo.bind(this);
        this.handlDescripcionHTMLChange = this.handlDescripcionHTMLChange.bind(this);
        this.handleTipoChange = this.handleTipoChange.bind(this);
        this.handleFile =this.handleFile.bind(this);
    }

    handlDescripcionHTMLChange(desHTML, des) {
        this.setState({
            atractivo: {
            ...this.state.atractivo,
            descripcionHTML: desHTML,
            descripcion: des
          },
        });
    }

    msgDelAtractivo(id, nombre) {
        this.setState({
            Msg: {
                MsgTipo: 1,
                MsgVisible: true,
                MsgBody: "Seguro de eliminar el Atractivo: " + nombre
            },
            idDelete: id
        });
    }

    delAtractivo() {
        fetch(`${process.env.REACT_APP_API_HOST}/atractivo/${this.state.idDelete}`, {
            method: 'DELETE',
            headers: {
                "Authorization": "asdssffsdff",
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.props.fireUpdateList();
                /*
                this.setState({
                    Msg: {
                        MsgTipo: 0,
                        MsgVisible: false,
                        MsgBody: ""
                    },
                    idDelete: 0
                });
                */
            } else {
                console.log(result.errMsg);
            }
        }, (error) => { //???
            console.log(error);
        });
    }

    setDays() {
        this.setState({
            atractivo: {
                ...this.state.atractivo,
                martes: this.state.atractivo.lunes,
                miercoles: this.state.atractivo.lunes,
                jueves: this.state.atractivo.lunes,
                viernes: this.state.atractivo.lunes,
                sabado: this.state.atractivo.lunes,
                domingo: this.state.atractivo.lunes
            }
        })
    }

    setLatLng() {
        let LatLng = ddToDms(this.state.atractivo.latitud, this.state.atractivo.longitud);
        this.setState({
            atractivo: {
                ...this.state.atractivo,
                latitudg: LatLng.lat,
                longitudg: LatLng.lng
            }
        });
    }

    fireMsg(msg, tipo = 0, id = 0) {
        this.setState({
            idDelete: id
        }, () => {
            let msgshow = "";
            if(Array.isArray(msg)) {
                msgshow = msg.join(", ");
            } else {
                msgshow = msg;
            }
            this.setState({
                Msg: {
                    MsgTipo: tipo,
                    MsgVisible: true,
                    MsgBody: msgshow
                }
            });
        });
    }

    handleFile(e){
        
        const file = e.target.files[0]
        this.setState({file:file})

        console.log(file, "AAAAA");
      
    }

    saveAtractivo (id) {  
        let data = {
            
            idlocalidad: this.state.idlocalidad,
            idTipo: this.state.idTipo,
            tipo: this.state.tipo,
            nombre: this.state.nombre,
            domicilio: this.state.domicilio,
            descripcion: this.state.descripcion,
            descripcionHTML: this.state.descripcionHTML,
            latitud: this.state.longitud,
            longitud: this.state.longitud,
            latitudg: this.state.latitudg,
            longitudg: this.state.longitudg,
            telefono: this.state.telefono,
            mail: this.state.mail,
            web: this.state.web,
            costo: this.state.costo,
            lunes: this.state.lunes,
            martes: this.state.martes,
            miercoles: this.state.miercoles,
            jueves: this.state.jueves,
            viernes: this.state.viernes,
            sabado: this.state.sabado,
            domingo: this.state.domingo,
            audio: file
            
        }
      const file = this.state.file
       /* const formData = new FormData();

        console.log ("The STATE ----------SSS", this.state);

       formData.append('audio', file);
       formData.append('name', 'audio');
*/
        fetch(`${process.env.REACT_APP_API_HOST}/atractivo/${this.state.atractivo.id}`, {
            method: 'PATCH',
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "multipart/form-data"
                "Content-Type": "application/json"
            },
           body: JSON.stringify(data)
           
        })
        .then(res => res.json())
        .then((result) => {
            console.log("APERR",this.state.atractivo);
            if(!result.err) {
                this.fireMsg("Los datos se guardaron correctamente.", 0, 0);
            } else {
                if(result.errMsgs.length) {
                    this.fireMsg(result.errMsgs, 0, 0);
                } else {
                    this.fireMsg(result.errMsg, 0, 0);
                }
            }
        }, (error) => { //???
            this.fireMsg(error);
        });
    }

    handleChange(event) {
        const target = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            atractivo: {
                ...this.state.atractivo,
                [target]: value
            }
        });

    }

    componentDidMount() {
        //Obtener los datos del Atractivo
        fetch(`${process.env.REACT_APP_API_HOST}/atractivo/${this.props.idAtractivo}`, {
            method: "GET",
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "multipart/form-data"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({
                    atractivo: result.data.registros[0],
                    loading: false
                });
            } else {
                this.setState({
                    loading: false,
                    error: true,
                    errMsg: result.errMsg
                });
            }
        }, (error) => { //???
            this.setState({
                loading: false,
                error: true,
                errMsg: error
            });
        });

        fetch(`${process.env.REACT_APP_API_HOST}/clasificacion/all`, {
            method: "GET",
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "multipart/form-data"
            }
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                result.data.registros.unshift({
                    id: 0,
                    nombre: "Todos los Tipos"
                });
                this.setState({
                    tipos: result.data.registros,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false,
                    error: true,
                    errMsg: result.errMsg
                });
            }
        }, (error) => { //???
            this.setState({
                loading: false,
                error: true,
                errMsg: error
            });
        });

    }

    handleTipoChange(event) {
        this.setState({
          atractivo: {
            ...this.state.atractivo,
            idTipo: event.target.value,
          },
        });
    }

    render() {
        const tipos = this.state.tipos.map((tip) => {
            return (
              <option key={`loc-${tip.id}`} value={tip.id}>
                {tip.nombre}
              </option>
            );
        });

      

        return (
            <React.Fragment>
            {
                 this.state.loading
                 ?
                 <h1>Cargando...</h1>
                 :
            <React.Fragment>
                <div className="card">
                    <div className="card-header" id={`atractivo-${this.state.atractivo.id}`}>
                        <h5 className="mb-0 d-flex justify-content-between">
                            <button className="btn" type="button" data-toggle="collapse" data-target={`#collapse-activo-${this.state.atractivo.id}`} aria-expanded="true" aria-controls={`collapse-activo-${this.state.atractivo.id}`} onClick={(e) => { window.scrollTo(0, 700); }}>
                                {this.state.atractivo.nombre}
                            </button>
                            <button className="btn btn-danger" type="button" onClick={(e) => { this.msgDelAtractivo(this.state.atractivo.id, this.state.atractivo.nombre, e) }}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </h5>
                    </div>
                    <div id={`collapse-activo-${this.state.atractivo.id}`} className="collapse" aria-labelledby={`atractivo-${this.state.atractivo.id}`} data-parent="#accordionAtractivos">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="idTipo">Tipo</label>
                                                <select
                                                name="idTipo"
                                                id="idTipo"
                                                className="form-control"
                                                value={this.state.atractivo.idTipo}
                                                onChange={this.handleTipoChange}
                                                >
                                                {tipos}
                                                </select>
                                            </div>
                                            {/*<div className="form-group">
                                                <label htmlFor="tipo">Tipo</label>
                                                <input type="text" name="tipo" id="tipo" className="form-control" value={this.state.atractivo.tipo} onChange={this.handleChange} autoComplete="off" />
                                            </div>*/}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="nombre">Nombre</label>
                                                <input type="text" name="nombre" id="nombre" 
                                                className="form-control" 
                                                value={this.state.atractivo.nombre} 
                                                onChange={this.handleChange} 
                                                autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="descripcion">Descripción</label>
                                                {
                                                    this.state.atractivo.descripcionHTML === "" ?
                                                    <MyEditor
                                                        descripcionHTML={this.handlDescripcionHTMLChange}
                                                        contenido={this.state.atractivo.descripcion}
                                                    />
                                                    :
                                                    <MyEditor
                                                        descripcionHTML={this.handlDescripcionHTMLChange}
                                                        contenido={this.state.atractivo.descripcionHTML}
                                                    />
                                                }
                                                
                                                {/*<textarea rows="8" type="text" name="descripcion" id="descripcion" className="form-control" value={this.state.atractivo.descripcion} onChange={this.handleChange} autoComplete="off" />*/}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="domicilio">Domicilio</label>
                                                <input type="text" name="domicilio" id="domicilio" className="form-control" value={this.state.atractivo.domicilio} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="latitud" style={{cursor: "pointer"}} onClick={this.setLatLng}>Latitud</label>
                                                <input type="text" name="latitud" id="latitud" className="form-control" value={this.state.atractivo.latitud} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="longitud" style={{cursor: "pointer"}} onClick={this.setLatLng}>Longitud</label>
                                                <input type="text" name="longitud" id="longitud" className="form-control" value={this.state.atractivo.longitud} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="latitudg">Latitud º</label>
                                                <input type="text" name="latitudg" id="latitudg" className="form-control" value={this.state.atractivo.latitudg} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="longitudg">Longitud º</label>
                                                <input type="text" name="longitudg" id="longitudg" className="form-control" value={this.state.atractivo.longitudg} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="telefono">Teléfono</label>
                                                <input type="text" name="telefono" id="telefono" className="form-control" value={this.state.atractivo.telefono} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="costo">Costo</label>
                                                <input type="number" name="costo" id="costo" className="form-control" value={this.state.atractivo.costo} onChange={this.handleChange} min={0} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4 d-flex align-items-center justify-content-center">
                                            <div className="form-check">
                                                <input name="imperdible" id="imperdible" className="form-check-input" type="checkbox" value={this.state.atractivo.imperdible} onChange={this.handleChange} />
                                                <label className="form-check-label" htmlFor="imperdible">
                                                    Imperdible?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="mail">Email</label>
                                                <input type="text" name="mail" id="mail" className="form-control" value={this.state.atractivo.mail} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="web">Web</label>
                                                <input type="text" name="web" id="web" className="form-control" value={this.state.atractivo.web} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="row mb-3">
                                        <div className="col-sm-12 col-md-12">
                                            <span className="bg-dark text-white p-2 rounded d-block">Horarios</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="lunes" style={{cursor: "pointer"}} onClick={this.setDays}>Lunes</label>
                                                <input type="text" name="lunes" id="lunes" className="form-control" value={this.state.atractivo.lunes} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="martes">Martes</label>
                                                <input type="text" name="martes" id="martes" className="form-control" value={this.state.atractivo.martes} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="miercoles">Miércoles</label>
                                                <input type="text" name="miercoles" id="miercoles" className="form-control" value={this.state.atractivo.miercoles} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="jueves">Jueves</label>
                                                <input type="text" name="jueves" id="jueves" className="form-control" value={this.state.atractivo.jueves} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="viernes">Viernes</label>
                                                <input type="text" name="viernes" id="viernes" className="form-control" value={this.state.atractivo.viernes} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="sabado">Sábado</label>
                                                <input type="text" name="sabado" id="sabado" className="form-control" value={this.state.atractivo.sabado} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="domingo">Domingo</label>
                                                <input type="text" name="domingo" id="domingo" className="form-control" value={this.state.atractivo.domingo} onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group
                                            ">
                                                <br/>
                                                <input type="file" name="file" multiple onChange={(e)=> this.handleFile(e)} />
                                                <br/>
                                                
                                            </div>

                                            <button className="btn btn-primary float-right" onClick={this.saveAtractivo}>Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row mb-3">
                                <div className="col-sm-12 col-md-12">
                                    <span className="bg-dark text-white p-2 rounded d-block">Imágenes</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <Galeria idAtractivo={this.state.atractivo.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Msg visible={this.state.Msg.MsgVisible} okClose={() => this.setState({Msg: { ...this.state.Msg, MsgVisible: false}})} okAceptar={this.delAtractivo} tipo={this.state.Msg.MsgTipo}>
                    {this.state.Msg.MsgBody}
                </Msg>
                <style jsx="true">{`
                    
                `}</style>
             </React.Fragment>
                }
            </React.Fragment>
        );
    }
}
/*
<div className="row mb-3">
                    <div className="col">
                        <button className="btn btn-primary btn-block" type="button" data-toggle="collapse" data-target={`#collapse-activo-${this.state.atractivo.id}`} aria-expanded="false" aria-controls={`collapse-activo-${this.state.atractivo.id}`}>
                            {this.state.atractivo.nombre}
                        </button>
                        <div className="collapse" id={`collapse-activo-${this.state.atractivo.id}`}>
                            <div className="card card-body">
                                
                            </div>
                        </div>
                    </div>
                </div>
                */

/*
<Msg visible={this.state.MsgVisible} okClose={() => this.setState({MsgVisible: false})}>
    {this.state.MsgBody}
</Msg>
*/

export default Atractivo;
