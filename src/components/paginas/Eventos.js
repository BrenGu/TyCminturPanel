import React, { Component } from "react";
import FormEve from "./comeventos/FormEve";
import Msg from "../utiles/Msg";

class Eventos extends Component {
    constructor(props) {
        super(props);
        let date = new Date().toISOString().substr(0, 10);
        this.state = {
            loading: true,
            evento: {
                idlocalidad: 6, //Ciudad de San Luis por defecto
                titulo: "",
                lugar: "",
                direccion: "",
                dfecha: date,
                hfecha: date,
                dhora: "00:00:00",
                hhora: "00:00:00",
                descripcion: "",
                costo: 0,
                invita: "",
                organiza: "",
                foto_uno: "default.jpg",
                foto_dos: "default.jpg",
                destacado: 10
            },
            eventos: [],
            localidades: [],
            msg: {
                visible: false,
                body: ""
            }
        };
        this.getData = this.getData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.handleImgChange = this.handleImgChange.bind(this);
        this.handleFormEveSubmit = this.handleFormEveSubmit.bind(this);
        this.eliminarEvento = this.eliminarEvento.bind(this);
    }

    eliminarEvento(id) {
        this.setState({
            loading: true
        }, () => {
            fetch(`${process.env.REACT_APP_API_HOST}/evento/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "",
                }
            })
            .then(res => res.json())
            .then((result) => {
                if(!result.err) {
                    this.setState({
                        msg: {
                            visible: true,
                            body: "Los datos se eliminaron correctamente."
                        }
                    }, () => {
                        this.getData();
                    });
                } else {
                    this.setState({
                        msg: {
                            visible: true,
                            body: result.errMsgs
                        }
                    });
                }
            }, (error) => { //???
                console.log(error);
            });
        });
    }

    handleFormEveSubmit(event) {
        event.preventDefault();
        const data = new FormData();
        data.append("idlocalidad", this.state.evento.idlocalidad);
        data.append("titulo", this.state.evento.titulo);
        data.append("lugar", this.state.evento.lugar);
        data.append("direccion", this.state.evento.direccion);
        data.append("dfecha", this.state.evento.dfecha);
        data.append("hfecha", this.state.evento.hfecha);
        data.append("dhora", this.state.evento.dhora);
        data.append("hhora", this.state.evento.hhora);
        data.append("descripcion", this.state.evento.descripcion);
        data.append("costo", this.state.evento.costo);
        data.append("invita", this.state.evento.invita);
        data.append("organiza", this.state.evento.organiza);
        data.append("destacado", this.state.evento.destacado);

        //Imágenes
        var img_uno = document.getElementById("upl-eve-uno").files[0];
		if(img_uno) {
			data.append("img-uno", img_uno, img_uno.name);
        }
        var img_dos = document.getElementById("upl-eve-dos").files[0];
		if(img_dos) {
			data.append("img-dos", img_dos, img_dos.name);
        }
        //Verificar tamaño de las imágenes no mas de 4MB
        if(data.has("img-uno")) {
            if(data.get("img-uno").size > 500000) {
                this.setState({
                    msg: {
                        visible: true,
                        body: "El tamaño de la primer imágen supera los 4MB."
                    }
                });
                return false;
            }
        }
        if(data.has("img-dos")) {
            if(data.get("img-dos").size > 500000) {
                this.setState({
                    msg: {
                        visible: true,
                        body: "El tamaño de la segunda imágen supera los 4MB."
                    }
                });
                return false;
            }
        }
        fetch(`${process.env.REACT_APP_API_HOST}/evento`, {
            method: "POST",
            headers: {
                "Authorization": "",
            },
            body: data
        })
        .then(res => res.json())
        .then((result) => {
            if(!result.err) {
                this.setState({
                    msg: {
                        visible: true,
                        body: "Los datos se agregaron correctamente"
                    }
                }, () => {
                    this.resetForm();
                    this.getData();
                });
            } else {
                this.setState({
                    msg: {
                        visible: true,
                        body: result.errMsgs
                    }
                });
            }
        }, (error) => { //???
            console.log(error);
        });
    }

    resetForm() {
        let date = new Date().toISOString().substr(0, 10);
        this.setState({
            evento: {
                idlocalidad: 6, //Ciudad de San Luis por defecto
                titulo: "",
                lugar: "",
                direccion: "",
                dfecha: date,
                hfecha: date,
                dhora: "00:00:00",
                hhora: "00:00:00",
                descripcion: "",
                costo: 0,
                invita: "",
                organiza: "",
                foto_uno: "default.jpg",
                foto_dos: "default.jpg",
                destacado: 10
            }
        });
        document.getElementById("frm-eventos").reset();
        document.getElementById("img-upl-eve-uno").setAttribute("src", `${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_DIRECTORY_EVENTOS_FOTOS}/default.jpg`);
        document.getElementById("img-upl-eve-dos").setAttribute("src", `${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_DIRECTORY_EVENTOS_FOTOS}/default.jpg`);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        this.setState({
            evento: {
                ...this.state.evento,
                [name]: value
            }
        });
    }

    handleLocalidadChange(event) {
        this.setState({
            evento: {
                ...this.state.evento,
                idlocalidad: event.target.value
            }
        });
    }

    handleImgChange(event) {
        let id = "img-" + event.target.id;
        var reader = new FileReader();
        reader.onload = function(e) {
            let imagen = document.getElementById(id);
            imagen.setAttribute("src", e.target.result);
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    getData() {
        //Localidades
        let ciudades = new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
                method: "GET",
                headers: {
                    "Authorization": "",
                }
            })
            .then(res => res.json())
            .then((result) => {
                if(!result.err) {
                    this.setState({
                        localidades: result.data.registros
                    }, () => {
                        resolve("Ok Ciudades");
                    });
                } else {
                    this.setState({
                        msg: {
                            visible: true,
                            body: result.errMsg
                        }
                    }, () => {
                        reject("Error");
                    });
                }
            }, (error) => { //???
                console.log(error);
                reject("Error");
            });
        });
        //Eventos
        let eventos = new Promise((resolve, reject) => {
            fetch(`${process.env.REACT_APP_API_HOST}/eventos/panel/100`, {
                method: "GET",
                headers: {
                    "Authorization": "",
                }
            })
            .then(res => res.json())
            .then((result) => {
                if(!result.err) {
                    this.setState({
                        eventos: result.data.registros
                    }, () => {
                        resolve("Ok Eventos");
                    });
                } else {
                    this.setState({
                        msg: {
                            visible: true,
                            body: result.errMsg
                        }
                    }, () => {
                        reject("Error");
                    });
                }
            }, (error) => { //???
                reject("Error");
            });
        });
        Promise.all([ciudades, eventos]).then(values => { 
            this.setState({
                loading: false
            });
        });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        const lista_eventos = this.state.eventos.map((evento) => {
            return <FormEve key={`evento-${evento.id}`} id={evento.id} localidades={this.state.localidades} eliminar={this.eliminarEvento} />
        });
        const localidades = this.state.localidades.map((localidad) => {
            return (<option key={`loc-${localidad.id}`} value={localidad.id}>{localidad.nombre}</option>);
        });

        return (
            <div className="Eventos">
                {
                    this.state.loading ?
                    <div>Cargando</div>
                    :
                    <React.Fragment>
                        <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s"><i className="fas fa-newspaper"></i> Eventos</h4>
                        <form method="post" onSubmit={this.handleFormEveSubmit} id="frm-eventos">
                            <div className="grid-eventos">
                                <div className="eventos-span-row-2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="idlocalidad">Localidad</label>
                                                <select name="idlocalidad" id="idlocalidad" className="form-control" value={this.state.evento.idlocalidad} onChange={this.handleLocalidadChange}>
                                                    {localidades}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="titulo">Título</label>
                                                <input type="text" name="titulo" id="titulo" className="form-control" value={this.state.evento.titulo} onChange={this.handleInputChange} maxLength="100" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="lugar">Lugar</label>
                                                <input type="text" name="lugar" id="lugar" className="form-control" value={this.state.evento.lugar} onChange={this.handleInputChange} maxLength="100" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="direccion">Dirección</label>
                                                <input type="text" name="direccion" id="direccion" className="form-control" value={this.state.evento.direccion} onChange={this.handleInputChange} maxLength="100" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="invita">Invita</label>
                                                <input type="text" name="invita" id="invita" className="form-control" value={this.state.evento.invita} onChange={this.handleInputChange} maxLength="100" placeholder="Ej: Ministerio de Turísmo y Parques" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="organiza">Organiza</label>
                                                <input type="text" name="organiza" id="organiza" className="form-control" value={this.state.evento.organiza} onChange={this.handleInputChange} maxLength="100" placeholder="Ej: Gobierno de San Luis" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="dfecha">Desde Fecha</label>
                                                <input type="date" name="dfecha" id="dfecha" className="form-control" value={this.state.evento.dfecha} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="hfecha">Hasta Fecha</label>
                                                <input type="date" name="hfecha" id="hfecha" className="form-control" value={this.state.evento.hfecha} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="dhora">Desde Hora</label>
                                                <input type="text" name="dhora" id="dhora" className="form-control" value={this.state.evento.dhora} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="hhora">Hasta Hora</label>
                                                <input type="text" name="hhora" id="hhora" className="form-control" value={this.state.evento.hhora} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="costo">Costo</label>
                                                <input type="text" name="costo" id="costo" className="form-control" value={this.state.evento.costo} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="costo">destacado</label>
                                                <input type="text" name="destacado" id="destacado" className="form-control" value={this.state.evento.destacado} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <label htmlFor="descripcion">Descripción</label>
                                                <textarea rows="15" name="descripcion" id="descripcion" className="form-control" value={this.state.evento.descripcion} onChange={this.handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="row">
                                        <div className="col mb-2">
                                            Tamaño sugerido no menor a 800px de ancho 600px de alto 72ppp
                                        </div>
                                        <div className="d-flex">
                                            <div className="col">
                                                <input type="file" className="d-none" name="upl-eve-uno" id="upl-eve-uno" accept="image/*" onChange={this.handleImgChange} />
                                                <img
                                                    id="img-upl-eve-uno"
                                                    className="img-fluid img-evento"
                                                    src={`${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_DIRECTORY_EVENTOS_FOTOS}/${this.state.evento.foto_uno}`}
                                                    alt="Foto"
                                                    onClick={(e) => {document.getElementById("upl-eve-uno").click()}}
                                                />
                                            </div>
                                            <div className="col">
                                                <input type="file" className="d-none" name="upl-eve-dos" id="upl-eve-dos" accept="image/*" onChange={this.handleImgChange} />
                                                <img
                                                    id="img-upl-eve-dos"
                                                    className="img-fluid img-evento"
                                                    src={`${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_DIRECTORY_EVENTOS_FOTOS}/${this.state.evento.foto_dos}`}
                                                    alt="Foto"
                                                    onClick={(e) => {document.getElementById("upl-eve-dos").click()}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col">
                                    <div className="d-flex justify-content-between">
                                        <button type="button" className="btn btn-warning" onClick={this.resetForm}><i className="far fa-window-restore"></i></button>
                                        <button type="submit" className="btn btn-primary"><i className="fas fa-arrow-down"></i> Agregar Evento</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <hr/>
                        <h5 className="bg-dark text-white p-3 mb-3 rounded">Lista de Eventos</h5>
                        <div className="row">
                            <div className="col">
                                <span>Últimos 100 Eventos</span>
                                <hr/>
                                { lista_eventos }
                            </div>
                        </div>
                    </React.Fragment>
                }
                <Msg visible={this.state.msg.visible} okClose={() => this.setState({msg: {...this.state.msg, visible: false}})} tipo="0">
                    {this.state.msg.body}
                </Msg>
                <style jsx="true">{`
                    .grid-eventos {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        grid-gap: 10px;
                    }
                    .eventos-span-row-2 {
                        grid-row: span 2 / auto;
                    }
                `}</style>
            </div>
        );
    }
}

export default Eventos;
