import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";

/*
    Parámetros:
    id: Id de la Novedad
    eliminar: manejador de evento de eliminación
*/

class FormAgenciasViajes extends Component {
  constructor(props) {
    super(props);
    let date = new Date().toISOString().substr(0, 10);
    this.state = {
      loading: true,
      id: 0,
      registro: {
        idlocalidad: 6, //Ciudad de San Luis por defecto
        legajo: "",
        registro: "",
        nombre: "",
        domicilio: "",
        telefono: "",
        mail: "",
        web: "",
        representante: "",
        adhiereDosep: "",
        adhiereCovid: "",
      },
      localidades: [],
      msg: {
        visible: false,
        body: "",
        tipo: 0,
      },
    };
    this.setData = this.setData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
  }

  handleLocalidadChange(event) {
    this.setState({
      registro: {
        ...this.state.registro,
        idlocalidad: event.target.value,
      },
    });
  }
  handleImgChange(event) {
    //disparador ej: file-1-${this.state.registro.id
    //imagen ej: img-1-${this.state.registro.id
    let disparador = event.target.id.split("-");
    let id = `img-${disparador[1]}-${disparador[2]}`;
    var reader = new FileReader();
    reader.onload = function (e) {
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
        tipo: 1,
      },
    });
  }

  okDelete() {
    this.setState(
      {
        msg: {
          visible: false,
          body: "",
          tipo: 0,
        },
      },
      () => {
        this.props.eliminar(this.state.registro.id);
      }
    );
  }

  saveData(event) {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_HOST}/updagencias/${this.state.id}`, {
      method: "POST",
      headers: {
        Authorization: "asdssffsdff",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.registro),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState({
              msg: {
                tipo: 0,
                visible: true,
                body: "Los datos se guardaron correctamente",
              },
            });
          } else {
            this.setState({
              msg: {
                tipo: 0,
                visible: true,
                body: result.errMsgs,
              },
            });
          }
        },
        (error) => {
          //???
          console.log(error);
        }
      );
  }

  handleInputChange(event) {
    const target = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    this.setState({
      registro: {
        ...this.state.registro,
        [target]: value,
      },
    });
  }

  setData() {
    let token = this.context.token;
    this.setState(
      {
        id: this.props.id,
        localidades: this.props.localidades,
      },
      () => {
        fetch(
          `${process.env.REACT_APP_API_HOST}/agenciasviaje/${this.state.id}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
              //"Content-Type": "application/json"
            },
          }
        )
          .then((res) => res.json())
          .then(
            (result) => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                  this.setState({
                    registro: result.data.registros[0],
                    loading: false,
                  });
                } else {
                  console.log("No hay registro: " + this.state.id);
                }
              } else {
                this.setState({
                  msg: {
                    visible: true,
                    body: result.errMsg,
                  },
                });
              }
            },
            (error) => {
              //???
              this.setState({
                msg: {
                  visible: true,
                  body: error,
                },
              });
            }
          );
        fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
          method: "GET",
          headers: {
            Authorization: token,
            //"Content-Type": "application/json"
          },
        })
          .then((res) => res.json())
          .then(
            (result) => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                  this.setState({
                    localidades: result.data.registros,
                  });
                } else {
                  console.log("No hay registro: " + this.state.id);
                }
              } else {
                this.setState({
                  msg: {
                    visible: true,
                    body: result.errMsg,
                  },
                });
              }
            },
            (error) => {
              //???
              this.setState({
                msg: {
                  visible: true,
                  body: error,
                },
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
    const localidades = this.state.localidades.map((localidad) => {
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
          <form method="post" onSubmit={this.saveData} id="frm-novedades">
            <div className="row border p-2 mb-3">
              <div className="col">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        className="form-control"
                        value={this.state.registro.nombre}
                        onChange={this.handleInputChange}
                        maxLength="50"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-3">
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
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="registro">Registro</label>
                      <input
                        type="text"
                        name="registro"
                        id="registro"
                        className="form-control"
                        value={this.state.registro.registro}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="telefono">Telefono</label>
                      <input
                        type="text"
                        name="telefono"
                        id="telefono"
                        className="form-control"
                        value={this.state.registro.telefono}
                        onChange={this.handleInputChange}
                        maxLength="75"
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="domicilio">Domicilio</label>
                      <input
                        type="text"
                        name="domicilio"
                        id="domicilio"
                        className="form-control"
                        value={this.state.registro.domicilio}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="idlocalidad">Localidad</label>
                      <select
                        name="idlocalidad"
                        id="idlocalidad"
                        className="form-control"
                        value={this.state.registro.idlocalidad}
                        onChange={this.handleLocalidadChange}
                      >
                        {localidades}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="correo">Correo</label>
                      <input
                        type="text"
                        name="mail"
                        id="mail"
                        className="form-control"
                        value={this.state.registro.mail}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="web">Web</label>
                      <input
                        type="text"
                        name="web"
                        id="web"
                        className="form-control"
                        value={this.state.registro.web}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>{" "}
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="web">Representante</label>
                      <input
                        type="text"
                        name="web"
                        id="web"
                        className="form-control"
                        value={this.state.registro.representante}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="form-check">
                      {this.state.registro.adhiereDosep >= 1 ? (
                        <input
                          name="adhiereDosep"
                          id="adhiereDosep"
                          className="form-check-input"
                          type="checkbox"
                          value={this.state.registro.adhiereDosep}
                          onChange={this.handleInputChange}
                          checked={
                            this.state.registro.adhiereDosep ? "checked" : false
                          }
                        />
                      ) : (
                        <input
                          name="adhiereDosep"
                          id="adhiereDosep"
                          className="form-check-input"
                          type="checkbox"
                          value={this.state.registro.adhiereDosep}
                          onChange={this.handleInputChange}
                        />
                      )}
                      <label
                        className="form-check-label"
                        htmlFor="adhiereDosep"
                      >
                        Adhiere Dosep?
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-check">
                      {this.state.registro.adhiereCovid >= 1 ? (
                        <input
                          name="adhiereCovid"
                          id="adhiereCovid"
                          className="form-check-input"
                          type="checkbox"
                          value={this.state.registro.adhiereCovid}
                          onChange={this.handleInputChange}
                          checked={
                            this.state.registro.adhiereCovid ? "checked" : false
                          }
                        />
                      ) : (
                        <input
                          name="adhiereCovid"
                          id="adhiereCovid"
                          className="form-check-input"
                          type="checkbox"
                          value={this.state.registro.adhiereCovid}
                          onChange={this.handleInputChange}
                        />
                      )}
                      <label
                        className="form-check-label"
                        htmlFor="adhiereDosep"
                      >
                        Adhiere Covid?
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-check">
                      {this.state.registro.activo >= 1 ? (
                        <input
                          name="activo"
                          id="activo"
                          className="form-check-input"
                          type="checkbox"
                          value={this.state.registro.activo}
                          onChange={this.handleInputChange}
                          checked={
                            this.state.registro.activo ? "checked" : false
                          }
                        />
                      ) : (
                        <input
                          name="activo"
                          id="activo"
                          className="form-check-input"
                          type="checkbox"
                          value={this.state.registro.activo}
                          onChange={this.handleInputChange}
                        />
                      )}
                      <label className="form-check-label" htmlFor="activo">
                        Activo?
                      </label>
                    </div>
                  </div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={
                          /*e =>
                          this.props.eliminar(this.state.registro.id)*/ (e) => {
                            this.askDelete(this.state.registro.nombre, e);
                          }
                        }
                      >
                        <i className="fas fa-trash" />
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save" /> Guardar Cambios
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="mt-5 mb-5" />
          </form>
        )}
        <Msg
          visible={this.state.msg.visible}
          okAceptar={this.okDelete}
          okClose={() =>
            this.setState({
              msg: { ...this.state.msg, visible: false, tipo: 0 },
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

FormAgenciasViajes.contextType = Consumer;

export default FormAgenciasViajes;
