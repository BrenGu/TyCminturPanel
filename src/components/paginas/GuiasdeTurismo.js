import React, { Component } from "react";
import FormGuiasTuristicos from "./comguiasturisticos/FormGuiasTuristicos";
import Msg from "../utiles/Msg";

class guiasdeturismo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      novedad: {
        idciudad: 6, //Ciudad de San Luis por defecto
        legajo: "",
        categoria: "",
        nombre: "",
        telefono: "",
        ambito: "",
        correo: "",
        adhiereDosep: false
      },
      novedades: [],
      localidades: [],
      msg: {
        visible: false,
        body: ""
      }
    };
    this.getData = this.getData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleFromNovSubmit = this.handleFromNovSubmit.bind(this);
    this.eliminarNovedad = this.eliminarNovedad.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
  }

  handleLocalidadChange(event) {
    this.setState({
      novedad: {
        ...this.state.novedad,
        idciudad: event.target.value
      }
    });
  }

  eliminarNovedad(id) {
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

  handleFromNovSubmit(event) {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_HOST}/guiasturismox`, {
      method: "POST",
      headers: {
        "Authorization": "asdssffsdff",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.novedad)
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState(
              {
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
      novedad: {
        idciudad: "",
        legajo: "",
        categoria: "",
        nombre: "",
        telefono: "",
        ambito: "",
        correo: "",
        adhiereDosep: false
      }
    });
    document.getElementById("frm-novedades").reset();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      novedad: {
        ...this.state.novedad,
        [name]: value
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
              novedades: result.data.registros
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
    const lista_guias = this.state.novedades.map(novedad => {
      return (
        <FormGuiasTuristicos
          key={`novedad-${novedad.id}`}
          id={novedad.id}
          localidades={this.state.localidades}
          eliminar={this.eliminarNovedad}
        />
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
              onSubmit={this.handleFromNovSubmit}
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
                          value={this.state.novedad.idciudad}
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
                          value={this.state.novedad.legajo}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="categoria">Categoría</label>
                        <input
                          type="text"
                          name="categoria"
                          id="categoria"
                          className="form-control"
                          value={this.state.novedad.categoria}
                          onChange={this.handleInputChange}
                          maxLength="75"
                        />
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
                          value={this.state.novedad.nombre}
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
                          value={this.state.novedad.telefono}
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
                          value={this.state.novedad.correo}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
            
                  </div>
                </div>
                <div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="ambito">Ámbito</label>
                      <input
                        type="text"
                        name="ambito"
                        id="ambito"
                        className="form-control"
                        value={this.state.novedad.ambito}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className="form-check">                   
                        <input name="adhiereDosep" id="adhiereDosep" className="form-check-input" type="checkbox" value={this.state.novedad.adhiereDosep} onChange={this.handleInputChange} />                          
                        <label className="form-check-label" htmlFor="adhiereDosep">
                            Adhiere Dosep?
                        </label>
                      </div>
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
