import React, { Component } from "react";
import ddToDms from "../../../gm";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";

class FormCajeros extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      registro: {
        idlocalidad: 6,
        tpo_bco: 0,
        direccion: "",
        latitud: 0,
        longitud: 0,
      },
      localidades: [],
      tipo_bco: [],
      msg: {
        visible: false,
        body: "",
        tipo: 0,
      },
    };
    this.setLatLng = this.setLatLng.bind(this);
    this.setData = this.setData.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
    /*
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        */
  }

  handleLocalidadChange(event) {
    this.setState({
      registro: {
        ...this.state.registro,
        idlocalidad: event.target.value,
      },
    });
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
    event.preventDefoult();
    fetch(`${process.env.REACT_APP_API_HOST}/updatecajero/${this.state.id}`, {
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
            console.log("aaa", result);
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

  setLatLng() {
    let LatLng = ddToDms(
      this.state.registro.latitud,
      this.state.registro.longitud
    );
    this.setState({
      registro: {
        ...this.state.registro,
        latitudg: LatLng.lat,
        longitudg: LatLng.lng,
      },
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState(
      {
        registro: {
          ...this.state.registro,
          [name]: value,
        },
      },
      () => {
        if (name === "latitud" || name === "longitud") {
          let grados = ddToDms(
            this.state.registro.latitud,
            this.state.registro.longitud
          );
          this.setState({
            registro: {
              ...this.state.registro,
              latitudg: grados.lat,
              longitudg: grados.lng,
            },
          });
        }
      }
    );
  }

  setData() {
    let token = this.context.token;
    this.setState(
      {
        id: this.props.id,
        localidades: this.props.localidades,
        tipo_bco: this.props.tipo_bco,
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/cajero/${this.state.id}`, {
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
                    registro: result.data.registros[0],
                    loading: false,
                  });
                  console.log("CC", result.data.registros);
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
                  console.log("No hay registros: " + this.state.id);
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
        fetch(`${process.env.REACT_APP_API_HOST}/getbancos`, {
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
                    tipo_bco: result.data.registros,
                  });
                } else {
                  console.log("No hay registros: " + this.state.id);
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
    const tipo_bco = this.state.tipo_bco.map((tipo_banco) => {
      return (
        <option key={`tp-${tipo_banco.id}`} value={tipo_banco.id}>
          {tipo_banco.nombre}
        </option>
      );
    });
    const localidades = this.state.localidades.map((localidad) => {
      return (
        <option key={`loc-${localidad.id}`} value={localidad.id}>
          {localidad.nombre.toUpperCase()}
        </option>
      );
    });
    return (
      <React.Fragment>
        {this.state.isLoaded ? (
          <h1>Cargando...</h1>
        ) : (
          <form method="post" onSubmit={this.saveData} id="frm-cajeros">
            <div className="row border p-2 mb-3">
              <div className="col">
                <div className="row">
                  <div className="col-sm-12 col-md-6 m-auto">
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
                  <div className="col-sm-12 col-md-6 m-auto">
                    <div className="form-group">
                      <label htmlFor="tpo_bco">Bancos </label>
                      <select
                        name="tpo_bco"
                        id="tpo_bco"
                        className="form-control"
                        value={this.state.registro.tpo_bco}
                        onChange={this.handleTpo_bco_loca_Change}
                      >
                        {tipo_bco}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 m-auto">
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
                  <div className="col-sm-12 col-md-3 m-auto">
                    <div className="form-group">
                      <label htmlFor="latitud">Latitud</label>
                      <input
                        type="text"
                        name="latitud"
                        id="latitud"
                        className="form-control"
                        value={this.state.registro.latitud}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3 m-auto">
                    <div className="form-group">
                      <label htmlFor="longitud">Longitud</label>
                      <input
                        type="text"
                        name="longitud"
                        id="longitud"
                        className="form-control"
                        value={this.state.registro.longitud}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={
                          /*e =>
                          this.props.eliminar(this.state.registro.id)*/ (
                            e
                          ) => {
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
            this.setState({ msg: { ...this.state.msg, visible: false } })
          }
          tipo={this.state.msg.tipo}
        >
          {this.state.msg.body}
        </Msg>
      </React.Fragment>
    );
  }
}
FormCajeros.contextType = Consumer;
export default FormCajeros;
