import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";
import AreasServicio from "./AreasServicio";

/*
    Parámetros:
    id: Id de la Novedad
    eliminar: manejador de evento de eliminación
*/

class FormGuiasTuristicos extends Component {
  constructor(props) {
    super(props);
    let date = new Date().toISOString().substr(0, 10);
    this.state = {
      loading: true,
      id: 0,
      registro: {
        idciudad: 6, //Ciudad de San Luis por defecto
        legajo: 0,
        categoria: "Guía profesional de Turismo",
        nombre: "",
        telefono: "",
        ambito: "",
        correo: "",
        adhiereDosep: 0,
        adhiereCovid: 0,
        fechUltimaRenovacion: date,
        dni: 0,
        fechNac: date,
        direccion: "",
        foto: "default.jpg",
        capacitaciones: "default",
        certificados: "default",
        titulo: "default",
      },
      localidades: [],
      categorias: ["Guía profesional de Turismo", "Guía idóneo", "Guía baqueano"],
      msg: {
        visible: false,
        body: ""
      }
    };
    
    this.setData = this.setData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleCategoriaChange = this.handleCategoriaChange.bind(this);
  }

  handleCategoriaChange(event) {
    this.setState({
      registro: {
        ...this.state.registro,
        categoria: event.target.value
      }
    });
  }

  handleLocalidadChange(event) {
    this.setState({
      registro: {
        ...this.state.registro,
        idciudad: event.target.value
      }
    });
  }

  handleFileChange(event){
    let target;
    this.state.id < 100?
       target = event.target.name.slice(7)
    : 
      target = event.target.name.slice(8)
    const value = document.getElementById(`${event.target.name}`).files[0].name;
    this.setState({
        registro: {
            ...this.state.registro,
            [target]: value
        }
    });
  }

  handleImgChange(event) {
    let id = "img-" + event.target.id;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  askDelete(nombre) {
    this.setState({
      msg: {
        visible: true,
        body: `Seguro de eliminar "${nombre}"`,
        tipo: 1
      }
    });
  }

  okDelete() {
    this.setState(
      {
        msg: {
          visible: false,
          body: "",
          tipo: 0
        }
      },
      () => {
        this.props.eliminar(this.state.registro.id);
      }
    );
  }

  saveData(event) {
    event.preventDefault();

    const data = new FormData();
    
    data.append("idciudad", this.state.registro.idciudad);
    data.append("legajo", this.state.registro.legajo);
    data.append("categoria", this.state.registro.categoria);
    data.append("nombre", this.state.registro.nombre);
    data.append("telefono", this.state.registro.telefono);
    data.append("ambito", this.state.registro.ambito);
    data.append("correo", this.state.registro.correo);
    data.append("adhiereDosep", this.state.registro.adhiereDosep);
    data.append("adhiereCovid", this.state.registro.adhiereCovid);
    data.append("fechUltimaRenovacion", this.state.registro.fechUltimaRenovacion);
    data.append("dni", this.state.registro.dni);
    data.append("fechNac", this.state.registro.fechNac);
    data.append("direccion", this.state.registro.direccion);
    /*
    data.append("foto", this.state.registro.foto);
    data.append("capacitaciones", this.state.registro.capacitaciones);
    data.append("certificados", this.state.registro.certificados);
    data.append("titulo", this.state.registro.titulo);
    */
    //ARCHIVOS
    var img = document.getElementById(`upl-${this.state.id}-nov-uno`).files[0];
    if (img) {
      data.append("foto-file", img, img.name);
    }

    var cap = document.getElementById(`upl-${this.state.id}-capacitaciones`).files[0];
    if (cap) {
      data.append("capacitaciones-file", cap, cap.name);
    }

    var cer = document.getElementById(`upl-${this.state.id}-certificados`).files[0];
    if (cer) {
      data.append("certificados-file", cer, cer.name);
    }

    var titulo = document.getElementById(`upl-${this.state.id}-titulo`).files[0];
    if (titulo) {
      data.append("titulo-file", titulo, titulo.name);
    }

    data.forEach(e => {
      console.log(e);
    })

    fetch(`${process.env.REACT_APP_API_HOST}/guiasturismox/${this.state.id}`, {
      method: "POST",
      headers: {
        "Authorization": ""
      },
      body: data,
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState({
              msg: {
                tipo: 0,
                visible: true,
                body: "Los datos se guardaron correctamente"
              }
            });
          } else {
            this.setState({
              msg: {
                tipo: 0,
                visible: true,
                body: result.errMsgs
              }
            });
          }
        },
        error => {
          //???
          console.log(error);
        }
      );
  }

  handleInputChange(event) {
    const target = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
        registro: {
            ...this.state.registro,
            [target]: value
        }
    });
  }

  setData() {
    let token = this.context.token;
    this.setState(
      {
        id: this.props.id,
        localidades: this.props.localidades
      },
      () => {
        fetch(
          `${process.env.REACT_APP_API_HOST}/guiasturismo/${this.state.id}`,
          {
            method: "GET",
            headers: {
              Authorization: token
            }
          }
        )
          .then(res => res.json())
          .then(
            result => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                  this.setState({
                    registro: result.data.registros[0],
                    loading: false
                  });
                } else {
                  console.log("No hay registro: " + this.state.id);
                }
              } else {
                this.setState({
                  msg: {
                    visible: true,
                    body: result.errMsg
                  }
                });
              }
            },
            error => {
              //???
              this.setState({
                msg: {
                  visible: true,
                  body: error
                }
              });
            }
          );
          fetch(
            `${process.env.REACT_APP_API_HOST}/ciudades`,
            {
              method: "GET",
              headers: {
                Authorization: token
                //"Content-Type": "application/json"
              }
            }
          )
            .then(res => res.json())
            .then(
              result => {
                if (!result.err) {
                  if (parseInt(result.data.count, 10) > 0) {
                    this.setState({
                      localidades: result.data.registros
                    });
                  } else {
                    console.log("No hay registro: " + this.state.id);
                  }
                } else {
                  this.setState({
                    msg: {
                      visible: true,
                      body: result.errMsg
                    }
                  });
                }
              },
              error => {
                //???
                this.setState({
                  msg: {
                    visible: true,
                    body: error
                  }
                });
              }
            );
      }
    );
  }

  componentDidMount() {
    this.setData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setData();
    }
  }

  render() {
    const categorias = this.state.categorias.map(cat => {
      return (
        <option key={`cat-${cat}`} value={cat}>
          {cat}
        </option>
      );
    });
    const localidades = this.state.localidades.map(localidad => {
      return (
        <option key={`loc-${localidad.id}`} value={localidad.id}>
          {localidad.nombre}
        </option>
      );
    });
    return (
      <React.Fragment>
        {this.state.loading ? (
          <h1>Cargando...</h1>
        ) : (
          <React.Fragment>
          <form method="post" onSubmit={this.saveData} id="frm-novedades-update">
            <div className="grid-noveades">
                <div className="noveades-span-row-2">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="idciudad">Localidad</label>
                        <select
                          name="idciudad"
                          id="idciudad"
                          className="form-control"
                          value={this.state.registro.idciudad}
                          onChange={this.handleLocalidadChange}
                        >
                          {localidades}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="legajo">Legajo</label>
                        <input
                          type="text"
                          name="legajo"
                          id="legajo"
                          className="form-control"
                          value={this.state.registro.legajo}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="categoria">Categoría</label>
                        <select
                          name="categoria"
                          id="categoria"
                          className="form-control"
                          value={this.state.registro.categoria}
                          onChange={this.handleCategoriaChange}
                        >
                          {categorias}
                        </select>
                        {/*<input
                          type="text"
                          name="categoria"
                          id="categoria"
                          className="form-control"
                          value={this.state.guia.categoria}
                          onChange={this.handleInputChange}
                          maxLength="75"
                        />*/}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                          type="text"
                          name="nombre"
                          id="nombre"
                          className="form-control"
                          value={this.state.registro.nombre}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                          <label htmlFor="dni">Dni</label>
                          <input
                            type="number"
                            name="dni"
                            id="dni"
                            className="form-control"
                            value={this.state.registro.dni}
                            onChange={this.handleInputChange}
                          />
                        </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="direccion">Direccion</label>
                        <input
                          type="text"
                          name="direccion"
                          id="direccion"
                          className="form-control"
                          value={this.state.registro.direccion}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                          type="text"
                          name="telefono"
                          id="telefono"
                          className="form-control"
                          value={this.state.registro.telefono}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="correo">Correo</label>
                        <input
                          type="text"
                          name="correo"
                          id="correo"
                          className="form-control"
                          value={this.state.registro.correo}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
            
                  </div>
                </div>
                <div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="fecha">Fecha de nacimiento</label>
                      <input
                        type="date"
                        name="fechNac"
                        id="fechNac"
                        className="form-control"
                        value={this.state.registro.fechNac}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fecha">Fecha de ultima renovacion</label>
                      <input
                        type="date"
                        name="fechUltimaRenovacion"
                        id="fechUltimaRenovacion"
                        className="form-control"
                        value={this.state.registro.fechUltimaRenovacion}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`upl-${this.state.id}-nov-uno`}>Foto</label>
                        <br />
                        <input
                          type="file"
                          className="d-none"
                          name={`upl-${this.state.id}-nov-uno`}
                          id={`upl-${this.state.id}-nov-uno`}
                          accept="image/*"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id={`img-upl-${this.state.id}-nov-uno`}
                          className="img-fluid img-novedad"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_GUIAS_FOTOS
                          }/${this.state.registro.foto}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById(`upl-${this.state.id}-nov-uno`).click();
                          }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`upl-${this.state.id}-certificados`}>Certificado: </label>
                        <input
                          type="file"
                          className="d-none"
                          name={`upl-${this.state.id}-certificados`}
                          id={`upl-${this.state.id}-certificados`}
                          accept="application/msword, application/pdf"
                          onChange={this.handleFileChange}
                        />
                          <i className="far fa-file-pdf" style={{marginLeft: "20px"}}  id="arc-upl-certificado" onClick={(e) => {
                              document.getElementById(`upl-${this.state.id}-certificados`).click();
                          }}></i>
                          <span style={{marginLeft:"10px"}}>{this.state.registro.certificados}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`upl-${this.state.id}-capacitaciones`}>Capacitacion: </label>
                        <input
                          type="file"
                          className="d-none"
                          name={`upl-${this.state.id}-capacitaciones`}
                          id={`upl-${this.state.id}-capacitaciones`}
                          accept="application/msword, application/pdf"
                          onChange={this.handleFileChange}
                        />
                        <i className="far fa-file-pdf" style={{marginLeft: "20px"}}  id="arc-upl-capacitacion" onClick={(e) => {
                            document.getElementById(`upl-${this.state.id}-capacitaciones`).click();
                        }}></i>
                        <span style={{marginLeft:"10px"}}>{this.state.registro.capacitaciones}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`upl-${this.state.id}-titulo`}>Titulo: </label>
                        <input
                          type="file"
                          className="d-none"
                          name={`upl-${this.state.id}-titulo`}
                          id={`upl-${this.state.id}-titulo`}
                          accept="application/msword, application/pdf"
                          onChange={this.handleFileChange}
                        />
                        <i className="far fa-file-pdf" style={{marginLeft: "20px"}}  id="arc-upl-titulo" onClick={(e) => {
                            document.getElementById(`upl-${this.state.id}-titulo`).click();
                        }}></i>
                        <span style={{marginLeft:"10px"}}>{this.state.registro.titulo}</span>
                    </div>
                    {/*<div className="form-group">
                      <label htmlFor="ambito">Ámbito</label>
                      <input
                        type="text"
                        name="ambito"
                        id="ambito"
                        className="form-control"
                        value={this.state.guia.ambito}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="form-check">                   
                        <input name="adhiereDosep" id="adhiereDosep" 
                        className="form-check-input" 
                        type="checkbox" 
                        value={this.state.guia.adhiereDosep} 
                        onChange={this.handleInputChange} />                          
                        <label className="form-check-label" htmlFor="adhiereDosep">
                            Adhiere Dosep?
                        </label>
                      </div>*/}
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={e =>
                          this.props.eliminar(this.state.id)
                        }
                    >
                      <i className="fas fa-trash" />
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-arrow-down" /> Guardar Guía
                    </button>
                  </div>
                </div>
              </div>
          </form>
          <br/>
          <h5 className="bg-dark text-white p-3 mb-3 rounded">
            Agregar areas de cobertura de servicio
          </h5>
          <AreasServicio id ={this.state.id} />       
          <hr className="mt-5 mb-5" /> 
          </React.Fragment>
        )}
        <Msg
          visible={this.state.msg.visible}
          okAceptar={this.okDelete}
          okClose={() =>
            this.setState({
              msg: { ...this.state.msg, visible: false, tipo: 0 }
            })
          }
          tipo={this.state.msg.tipo}
        >
          {this.state.msg.body}
        </Msg>
      </React.Fragment>
    );
  }
}

FormGuiasTuristicos.contextType = Consumer;

export default FormGuiasTuristicos;
