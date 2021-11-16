import React, { Component } from "react";
import FormGuiasTuristicos from "./comguiasturisticos/FormGuiasTuristicos";
import Msg from "../utiles/Msg";
import AreasServicio from "./comguiasturisticos/AreasServicio";

class guiasdeturismo extends Component {
  constructor(props) {
    super(props);
    let date = new Date().toISOString().substr(0, 10);
    this.state = {
      loading: true,
      id: 0,
      guia: {
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
      guias: [],
      localidades: [],
      categorias: ["Guía profesional de Turismo", "Guía idóneo", "Guía baqueano"],
      msg: {
        visible: false,
        body: ""
      }
    };
    this.getData = this.getData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.eliminarGuia = this.eliminarGuia.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleCategoriaChange = this.handleCategoriaChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  handleFileChange(event){
    const target = event.target.name.slice(4);
    console.log(target);
    const value = document.getElementById(`${event.target.name}`).files[0].name;
    this.setState({
        guia: {
            ...this.state.guia,
            [target]: value
        }
    });
  }

  handleLocalidadChange(event) {
    this.setState({
      guia: {
        ...this.state.guia,
        idciudad: event.target.value
      }
    });
  }

  handleCategoriaChange(event) {
    this.setState({
      guia: {
        ...this.state.guia,
        categoria: event.target.value
      }
    });
  }

  eliminarGuia(id) {
    this.setState(
      {
        loading: true
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/guiasturismo/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: ""
          }
        })
          .then(res => res.json())
          .then(
            result => {
              if (!result.err) {
                this.setState(
                  {
                    msg: {
                      visible: true,
                      body: "El guía se elimino correctamente."
                    }
                  },
                  () => {
                    this.getData();
                  }
                );
              } else {
                this.setState({
                  msg: {
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
    );
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const data = new FormData();
    
    data.append("idciudad", this.state.guia.idciudad);
    data.append("legajo", this.state.guia.legajo);
    data.append("categoria", this.state.guia.categoria);
    data.append("nombre", this.state.guia.nombre);
    data.append("telefono", this.state.guia.telefono);
    data.append("ambito", this.state.guia.ambito);
    data.append("correo", this.state.guia.correo);
    data.append("adhiereDosep", this.state.guia.adhiereDosep);
    data.append("adhiereCovid", this.state.guia.adhiereCovid);
    data.append("fechUltimaRenovacion", this.state.guia.fechUltimaRenovacion);
    data.append("dni", this.state.guia.dni);
    data.append("fechNac", this.state.guia.fechNac);
    data.append("direccion", this.state.guia.direccion);

    //ARCHIVOS
    var img = document.getElementById("upl-nov-uno").files[0];
    if (img) {
      data.append("foto-file", img, img.name);
    }

    var cap = document.getElementById("upl-capacitaciones").files[0];
    if (cap) {
      data.append("capacitaciones-file", cap, cap.name);
    }

    var cer = document.getElementById("upl-certificados").files[0];
    if (cer) {
      data.append("certificados-file", cer, cer.name);
    }

    var titulo = document.getElementById("upl-titulo").files[0];
    if (titulo) {
      data.append("titulo-file", titulo, titulo.name);
    }

    data.forEach(e => {
      console.log(e);
    })

    fetch(`${process.env.REACT_APP_API_HOST}/guiasturismox/new`, {
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
            this.setState(
              {
                id: result.insertId,
                msg: {
                  visible: true,
                  body: "Los datos se agregaron correctamente"
                }
              },
              () => {
                this.resetForm();
                this.getData();
              }
            );
          } else {
            this.setState({
              msg: {
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

  resetForm() {
    let date = new Date().toISOString().substr(0, 10);
    this.setState({
      guia: {
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
      }
    });
    document.getElementById("frm-novedades").reset();
  }

  handleInputChange(event) {
    const target = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      guia: {
        ...this.state.guia,
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

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/guiasturismo`, {
      method: "GET",
      headers: {
        Authorization: ""
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState({
              guias: result.data.registros
            });
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
          console.log(error);
        }
      );
    this.setState({
      loading: false
    });
    //Localidades
    let ciudades = new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
        method: "GET",
        headers: {
          Authorization: ""
        }
      })
        .then(res => res.json())
        .then(
          result => {
            if (!result.err) {
              this.setState(
                {
                  localidades: result.data.registros
                },
                () => {
                  resolve("Ok Ciudades");
                }
              );
            } else {
              this.setState(
                {
                  msg: {
                    visible: true,
                    body: result.errMsg
                  }
                },
                () => {
                  reject("Error");
                }
              );
            }
          },
          error => {
            //???
            console.log(error);
            reject("Error");
          }
        );
    });

    Promise.all([ciudades]).then(values => {
      this.setState({
        loading: false
      });
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const lista_guias = this.state.guias.map(novedad => {
      return (
        <FormGuiasTuristicos
          key={`novedad-${novedad.id}`}
          id={novedad.id}
          localidades={this.state.localidades}
          eliminar={this.eliminarGuia}
        />
      );
    });
    
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
      <div className="Novedades">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-user" /> Nuevo Guía de Turismo
            </h4>
            <form
              method="post"
              onSubmit={this.handleFormSubmit}
              id="frm-novedades"
            >
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
                          value={this.state.guia.idciudad}
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
                          value={this.state.guia.legajo}
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
                          value={this.state.guia.categoria}
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
                          value={this.state.guia.nombre}
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
                            value={this.state.guia.dni}
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
                          value={this.state.guia.direccion}
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
                          value={this.state.guia.telefono}
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
                          value={this.state.guia.correo}
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
                        value={this.state.guia.fechNac}
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
                        value={this.state.guia.fechUltimaRenovacion}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                        <label htmlFor="upl-nov-uno">Foto</label>
                        <br/>
                        <input
                          type="file"
                          className="d-none"
                          name="upl-nov-uno"
                          id="upl-nov-uno"
                          accept="image/*"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-nov-uno"
                          className="img-fluid img-novedad"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_GUIAS_FOTOS
                          }/${this.state.guia.foto}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-nov-uno").click();
                          }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="upl-certificados">Certificado: </label>
                        <input
                          type="file"
                          className="d-none"
                          name="upl-certificados"
                          id="upl-certificados"
                          accept="application/msword, application/pdf"
                          onChange={this.handleFileChange}
                        />
                        <i className="far fa-file-pdf" style={{marginLeft: "20px"}}  id="arc-upl-certificado" onClick={(e) => {
                            document.getElementById("upl-certificados").click();
                        }}></i>
                        <span style={{marginLeft:"10px"}}>{this.state.guia.certificados}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="upl-capacitaciones">Capacitacion: </label>
                        <input
                          type="file"
                          className="d-none"
                          name="upl-capacitaciones"
                          id="upl-capacitaciones"
                          accept="application/msword, application/pdf"
                          onChange={this.handleFileChange}
                        />
                        <i className="far fa-file-pdf" style={{marginLeft: "20px"}}  id="arc-upl-capacitacion" onClick={(e) => {
                            document.getElementById("upl-capacitaciones").click();
                        }}></i>
                        <span style={{marginLeft:"10px"}}>{this.state.guia.capacitaciones}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="upl-titulo">Titulo: </label>
                        <input
                          type="file"
                          className="d-none"
                          name="upl-titulo"
                          id="upl-titulo"
                          accept="application/msword, application/pdf"
                          onChange={this.handleFileChange}
                        />
                        <i className="far fa-file-pdf" style={{marginLeft: "20px"}}  id="arc-upl-titulo" onClick={(e) => {
                            document.getElementById("upl-titulo").click();
                        }}></i>
                        <span style={{marginLeft:"10px"}}>{this.state.guia.titulo}</span>
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
                    <button type="button" className="btn btn-warning">
                      <i className="far fa-window-restore" />
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-arrow-down" /> Agregar Guía
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <hr />
            {this.state.id != 0 ?
            <div>
              <h5 className="bg-dark text-white p-3 mb-3 rounded">
                 Agregar areas de cobertura de servicio
              </h5>
              <AreasServicio id ={this.state.id} />
            </div> 
            : ""
            }
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
              Listado de Guías de Turismo
            </h5>
            <div className="row">
              <div className="col">
                <hr />
                {lista_guias}
              </div>
            </div>
          </React.Fragment>
        )}
        <Msg
          visible={this.state.msg.visible}
          okClose={() =>
            this.setState({ msg: { ...this.state.msg, visible: false } })
          }
          tipo="0"
        >
          {this.state.msg.body}
        </Msg>
        <style jsx="true">{`
          .grid-noveades {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px;
          }
          .noveades-span-row-2 {
            grid-row: span 2 / auto;
          }
        `}</style>
      </div>
    );
  }
}
export default guiasdeturismo;
