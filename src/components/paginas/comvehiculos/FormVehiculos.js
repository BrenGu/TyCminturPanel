import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";

class FormVehiculos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      data: {
        idvehiculo: 0,
        idlocalidad: 0,
        nombre: "",
        domicilio: "",
        telefono: 0,
        email: "",
        web: "",
        latitud: 0,
        longitud: 0,
      },
      localidades: [],
      tipo_vehiculo: [],
      msg: {
        visible: false,
        body: "",
        tipo: 0,
      },
    };
    this.setData = this.setData.bind(this);
    this.getLocalidades = this.getLocalidades.bind(this);
    this.getTipoVehiculo = this.getTipoVehiculo.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleTpo_vehiculo_Change = this.handleTpo_vehiculo_Change.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFromVehiculosSubmit = this.handleFromVehiculosSubmit.bind(this);
    this.saveData = this.saveData.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
  }

  saveData(event) {
    event.preventDefault();
    fetch(
      `${process.env.REACT_APP_API_HOST}/updateVehiculo/${this.state.id}`,
      {
        method: "POST",
        headers: {
          Authorization: "asdssffsdff",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.data),
      }
    )
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

  handleTpo_vehiculo_Change(event) {
    //console.log("Handle tip_vehiculo: :", event.target.value);
    this.setState({
      data: {
        ...this.state.data,
        idvehiculo: event.target.value,
      },
    });
  }

  handleLocalidadChange(event) {
    this.setState({
      data: {
        ...this.state.data,
        idlocalidad: event.target.value,
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
        this.props.eliminar(this.state.data.id);
      }
    );
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

  handleFromVehiculosSubmit(event) {
    event.preventDefault();
    let data = {
      idvehiculo: this.setState.data.tipovehiculos,
      idlocalidad: this.state.data.idlocalidad,
      nombre: this.state.data.nombre,
      docimilio: this.state.data.docimilio,
      telefono: this.state.data.telefono,
      email: this.state.data.mail,
      web: this.state.data.web,
      latitud: this.state.data.latitud,
      longitud: this.state.data.longitud,
    };
    fetch(`${process.env.REACT_APP_API_HOST}/addvehiculo`, {
      method: "POST",
      headers: {
        Authorization: "asdssffsdff",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: "Los datos se agregaron correctamente",
                },
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
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      data: {
        ...this.state.data,
        [name]: value,
      },
    });
  }

  setData() {
    let token = this.context.token;

    this.setState(
      {
        id: this.props.id,
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/vehiculo/${this.state.id}`, {
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
                    data: result.data.registros[0],
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
      }
    );

    // fetch(`${process.env.REACT_APP_API_HOST}/vehiculos/${this.state.id}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: "",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then(
    //     (result) => {
    //       if (!result.err) {
    //         this.setState({
    //           terminales: result.data.data,
    //         });
    //       } else {
    //         this.setState({
    //           msg: {
    //             visible: true,
    //             body: result.errMsg,
    //           },
    //         });
    //       }
    //     },
    //     (error) => {
    //       //???
    //       console.log(error);
    //     }
    //   );
    // this.setState({
    //   loading: false,
    // });
  }

  getTipoVehiculo() {
    fetch(`${process.env.REACT_APP_API_HOST}/getTipoVehiculos`, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState(
              {
                tipo_vehiculo: result.data.registros,
              },
              () => {
                //console.log('TipoVehiculoOK')
                //console.log(this.state.tipo_vehiculo)
              }
            );
          } else {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: result.errMsg,
                },
              },
              () => {
                //console.log('TipoVehiculoError')
              }
            );
          }
        },
        (error) => {
          //???
          console.log(error);
          //reject("Error");
        }
      );
  }

  getLocalidades() {
    fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState(
              {
                localidades: result.data.registros,
              },
              () => {
                //resolve("Ok Ciudades");
              }
            );
          } else {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: result.errMsg,
                },
              },
              () => {
                //reject("Error");
              }
            );
          }
        },
        (error) => {
          //???
          console.log(error);
          //reject("Error");
        }
      );
  }

  resetForm() {
    this.setState({
      data: {
        idvehiculo: 0,
        idlocalidad: 6,
        nombre: "",
        direccion: "",
        telefono: 0,
        email: "",
        web: "",
        latitud: 0,
        longitud: 0,
      },
      loading: true,
    });
    document.getElementById("frm-vehiculos").reset();
  }

  componentDidMount() {
    this.getLocalidades();
    this.getTipoVehiculo();
    this.setData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setData();
    }
  }

  render() {
    const lista_localidades = this.state.localidades.map((localidad) => {
      return (
        <option key={`loc-${localidad.id}`} value={localidad.id}>
          {localidad.nombre.toUpperCase()}
        </option>
      );
    });

    const tipo_vehiculo = this.state.tipo_vehiculo.map((tip_vehiculo) => {
      //console.log("tipo_vehiculo item: ", tip_vehiculo)
      return (
        <option key={`tp-${tip_vehiculo.id}`} value={tip_vehiculo.id}>
          {tip_vehiculo.nombre}
        </option>
      );
    });

    return (
      <div className="Vehiculos">
        {this.state.loading ? (
          <div>Cargando ..</div>
        ) : (
          <React.Fragment>
            <form method="post" onSubmit={this.saveData} id="frm-vehiculo">
              <div className="row border p-2 mb-3">
              <div className="row">
                <div className="col-sm-12 col-md-6 m-auto">
                  <div className="form-group">
                    <label htmlFor="idlocalidad">Localidad</label>
                    <select
                      name="idlocalidad"
                      id="idlocalidad"
                      className="form-control"
                      value={this.state.data.idlocalidad}
                      onChange={this.handleLocalidadChange}
                    >
                      {lista_localidades}
                    </select>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 m-auto">
                  <div className="form-group">
                    <label htmlFor="tipo_vehiculo">Tipo de Vehiculo </label>
                    <select
                      name="tipo_vehiculo"
                      id="tipo_vehiculo"
                      className="form-control"
                      value={this.state.data.idvehiculo}
                      onChange={this.handleTpo_vehiculo_Change}
                    >
                      {tipo_vehiculo}
                    </select>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 m-auto">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      className="form-control"
                      value={this.state.data.nombre}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 m-auto">
                  <div className="form-group">
                    <label htmlFor="telefono">Telefono</label>
                    <input
                      type="text"
                      name="telefono"
                      id="telefono"
                      className="form-control"
                      value={this.state.data.telefono}
                      onChange={this.handleInputChange}
                    />
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
                      value={this.state.data.domicilio}
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
                      value={this.state.data.latitud}
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
                      value={this.state.data.longitud}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 m-auto">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="form-control"
                      value={this.state.data.email}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 m-auto">
                  <div className="form-group">
                    <label htmlFor="web">Web</label>
                    <input
                      type="text"
                      name="web"
                      id="web"
                      className="form-control"
                      value={this.state.data.web}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>

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
                            this.askDelete(this.state.data.nombre, e);
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
            </form>
            <hr className="mt-5 mb-5" />
          </React.Fragment>
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
      </div>
    );
  }
}
export default FormVehiculos;
