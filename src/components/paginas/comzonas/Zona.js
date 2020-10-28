import React, { Component } from "react";
//import Heditor from "../../utiles/Heditor";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";

class Zona extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            id: 0, //Id de registro
            zona: {
                id: 0,
                nombre: "Cargando...",
                descripcion: "Cargando...",
                mapa: "default.jpg",
                activo: true
            },
            colorSet: "000",
            ciudades: [],
            combo_ciudades: {
                selected: 0,
                data: [{id: 0, nombre: "Cargando..."}]
            },
            MsgVisible: false
        };
        this.updateComponent = this.updateComponent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCiudadChange = this.handleCiudadChange.bind(this);
        this.findZonaCiudades = this.findZonaCiudades.bind(this);
        this.handleAddCiudad = this.handleAddCiudad.bind(this);
        this.handleDeleteCity = this.handleDeleteCity.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleImgChange = this.handleImgChange.bind(this);
    }

    handleSave = () => {
        const data = new FormData();
        data.append("idzona", this.state.zona.id);
        data.append("nombre", this.state.zona.nombre);
        data.append("descripcion", this.state.zona.descripcion);
        data.append("mapa", this.state.zona.mapa);
        data.append("foto", this.state.zona.foto);
        data.append("mini", this.state.zona.mini);
        //Verificación de color hexa válido
        let color = this.state.colorSet;
        var isOk = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test("#" + this.state.zona.color);
        if(isOk) {
            color = this.state.zona.color;
        }
        data.append("color", color);
        data.append("activo", this.state.zona.activo);
        var mapa = document.getElementById("uploadMapa-" + this.state.zona.id).files[0];
		if(mapa) {
			data.append("imgmapa", mapa, mapa.name);
        }
        var foto = document.getElementById("uploadFoto-" + this.state.zona.id).files[0];
		if(foto) {
			data.append("imgfoto", foto, foto.name);
        }
        var mini = document.getElementById("uploadMini-" + this.state.zona.id).files[0];
		if(mini) {
			data.append("imgmini", mini, mini.name);
        }
        var token = this.context.token;
        fetch(`${process.env.REACT_APP_API_HOST}/zona/${this.state.id}`, {
            method: "POST",
            headers: {
                "Authorization": token,
                //"Content-Type": "multipart/form-data"
            },
            body: data
        })
        .then(res => res.json())
        .then((result) => {
            this.setState({
                zona: {
                    ...this.state.zona,
                    mapa: result.mapa,
                    foto: result.foto,
                    mini: result.mini
                },
                MsgVisible: true
            });
        }, (error) => { //???
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    handleImgChange = (event) => {
        let tipo = event.target.id.substring(6);
        tipo = tipo.split("-");
        //let idx = "mapa-" + this.state.zona.id;
        let idx = tipo[0].toLowerCase() + "-" + tipo[1];
        var reader = new FileReader();
        reader.onload = function(e) {
            let imagen = document.getElementById(idx);
            imagen.setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    handleDeleteCity = (id) => {
        var token = this.context.token;
        fetch(`${process.env.REACT_APP_API_HOST}/zona/delete/ciudad/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then((result) => {
            this.findZonaCiudades(this.state.idZona);
        }, (error) => { //???
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    handleAddCiudad = (event) => {
        var token = this.context.token;
        fetch(`${process.env.REACT_APP_API_HOST}/zona/${this.state.zona.id}/add/ciudad`, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({idciudad: this.state.combo_ciudades.selected})
        })
        .then(res => res.json())
        .then((result) => {
            this.findZonaCiudades(this.state.zona.id);
        }, (error) => { //???
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    handleChange = (event) => {
        this.setState({
            zona: {
                ...this.state.zona,
                [event.target.name]: event.target.value
            }
        });
    }

    handleCiudadChange = (event) => {
        this.setState({
            combo_ciudades: {
                ...this.state.combo_ciudades,
                selected: event.target.value
            }
        });
    }

    findZonaCiudades = (idzona) => {
        const token = this.context.token;
        fetch(`${process.env.REACT_APP_API_HOST}/zona/${idzona}/ciudades`, {
            method: "GET",
            headers: new Headers({
                "Authorization": token,
                "Content-Type": "application/json"
            })
        })
        .then(res => res.json())
        .then((result) => {
            this.setState({
                ciudades: result.data.registros
            });
        }, (error) => { //???
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    updateComponent = () => {
        this.setState({
            isLoaded: false,
        }, () => {
            const token = this.context.token;
            console.log("Token: " + token);
            fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
                method: "GET",
                headers: new Headers({
                    "Authorization": token,
                    "Content-Type": "application/json"
                })
            })
            .then(res => res.json())
            .then((result) => {
                this.setState({
                    combo_ciudades: {
                        data: result.data.registros,
                        selected: result.data.registros[0].id
                    }
                });
            }, (error) => { //???
                this.setState({
                    isLoaded: true,
                    error
                });
            });
            fetch(`${process.env.REACT_APP_API_HOST}/zona/${this.state.id}`, {
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
                    zona: result.data.registros[0]
                }, () => {
                    this.setState({
                        colorSet: this.state.zona.color
                    });
                    this.findZonaCiudades(result.data.registros[0].id);
                });
            }, (error) => { //???
                this.setState({
                    isLoaded: true,
                    error
                });
            });
        });
    }

    componentDidMount() {
        this.setState({id: this.props.id}, () => {
            this.updateComponent();
        });
    }

    render() {
        const ciudades = this.state.combo_ciudades.data.map((ciu) => {
            return (<option key={`opt-${ciu.id}`} value={ciu.id}>{ciu.nombre}</option>);
        });
        const ciudades_zona = this.state.ciudades.map((c, index) => {
            return (
                <li key={`lista-${c.id}`} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <i className="fas fa-hashtag"></i> <strong>{index + 1} <i className="fas fa-arrows-alt-h"></i> {c.ciudad} ({c.departamento})</strong>
                        </div>
                        <div>
                            <button className="btn btn-danger btn-sm" onClick={(e) => {this.handleDeleteCity(c.id, e)}}><i className="fas fa-trash"></i></button>
                        </div>
                    </div>
                </li>
            );
        });
        return (
            <React.Fragment>
                {
                    this.state.isLoaded ?
                    <div className="row mb-3">
                        <div className="col">
                            <button className="btn btn-block" style={{backgroundColor: "#" + this.state.zona.color, color: "#fff"}} type="button" data-toggle="collapse" data-target={`#collapse-${this.state.zona.id}`} aria-expanded="false" aria-controls={`collapse-${this.state.zona.id}`}>
                            {this.state.zona.nombre}
                            </button>
                            <div className="collapse" id={`collapse-${this.state.zona.id}`}>
                                <div className="card card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="col-8">
                                                    <div className="form-group">
                                                        <label htmlFor="nombre">Nombre</label>
                                                        <input type="text" name="nombre" id="nombre" className="form-control" value={this.state.zona.nombre} onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="form-group">
                                                        <label htmlFor="color">Color {
                                                            this.state.zona.color !== this.state.colorSet ?
                                                            <span 
                                                                onClick={() => this.setState({
                                                                    zona: {
                                                                        ...this.state.zona,
                                                                        color: this.state.colorSet
                                                                    }
                                                                })}
                                                                style={{cursor: "pointer"}}
                                                            ><i className="fas fa-times"></i></span>
                                                            :
                                                            ""
                                                        }</label>
                                                        <input type="text" name="color" id="color" className="form-control" value={this.state.zona.color} onChange={this.handleChange} style={{backgroundColor: `#${this.state.zona.color}`, color: "#fff"}} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label htmlFor="descripcion">Descripción</label>
                                                        <textarea rows="15" name="descripcion" id="descripcion" className="form-control" value={this.state.zona.descripcion} onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="foto">Foto (1024px ancho / 768px alto / 72ppp)</label>
                                                        <input id={`uploadFoto-${this.state.zona.id}`} name={`uploadFoto-${this.state.zona.id}`} type="file" className="d-none" accept="image/*" onChange={this.handleImgChange} />
                                                        <img name={`foto-${this.state.zona.id}`} id={`foto-${this.state.zona.id}`} onClick={(e) => {document.getElementById("uploadFoto-" + this.state.zona.id).click()}} src={`${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_DIRECTORY_ZONA_FOTOS}/${this.state.zona.foto}`} className="img-fluid rounded" alt="Foto" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="mapa">Mapa (300px ancho / 400px alto / 72ppp)</label>
                                                <input id={`uploadMapa-${this.state.zona.id}`} name={`uploadMapa-${this.state.zona.id}`} type="file" className="d-none" accept="image/*" onChange={this.handleImgChange} />
                                                <img name={`mapa-${this.state.zona.id}`} id={`mapa-${this.state.zona.id}`} onClick={(e) => {document.getElementById("uploadMapa-" + this.state.zona.id).click()}} src={`${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_DIRECTORY_MAPAS}/${this.state.zona.mapa}`} className="img-fluid rounded" alt="Mapa" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="mini">MiniMapa (150px ancho / 250px alto / 72ppp)</label>
                                                <input id={`uploadMini-${this.state.zona.id}`} name={`uploadMini-${this.state.zona.id}`} type="file" className="d-none" accept="image/*" onChange={this.handleImgChange} />
                                                <img name={`mini-${this.state.zona.id}`} id={`mini-${this.state.zona.id}`} onClick={(e) => {document.getElementById("uploadMini-" + this.state.zona.id).click()}} src={`${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_DIRECTORY_MAPAS}/mini/${this.state.zona.mini}`} className="img-fluid rounded" alt="SL" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <button type="button" name="btn_ok" id="btn_ok" className="btn btn-success btn-block" onClick={this.handleSave}>Guardar Cambios</button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-md-10">
                                            <div className="form-group">
                                                <label htmlFor="ciudad">Localidad</label>
                                                <select name="ciudad" id="ciudad" className="form-control" value={this.state.combo_ciudades.selected} onChange={this.handleCiudadChange}>
                                                    { ciudades }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <button className="btn btn-dark btn-block btn-mt" onClick={this.handleAddCiudad}><i className="fas fa-arrow-down"></i></button>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-12">
                                            Localidades de la Zona
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <ul className="list-group">
                                                { ciudades_zona }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <h1>Cargando...</h1>
                }
                <Msg visible={this.state.MsgVisible} okClose={() => this.setState({MsgVisible: false})} tipo="0">
                    Los dato se actualizaron correctamente.
                </Msg>
                <style jsx="true">{`
                    #mapa {
                        border: 1px solid #ced4da;
                        border-radius: .25rem;
                    }
                    .btn-mt {
                        margin-top: 32px;
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

Zona.contextType = Consumer;

export default Zona;
