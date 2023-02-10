import React, { Component } from "react";
//import LocSelect from "../utiles/LocSelect";
import FormCajeros from "./comcajeros/FormCajeros";
import Msg from "../utiles/Msg";

class Vehiculos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        idlocalidad: 0,
        idvehiculo:0,
        direccion: "",
        latitud: 0,
        longitud: 0,
      },
      localidades: [],
      tipo_vehiculo: [],
      msg: {
        visible: false,
        body: "",
      },
    };
    this.getData = this.getData.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleTpo_vehiculo_Change = this.handleTpo_vehiculo_Change.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFromVehiculosSubmit = this.handleFromVehiculosSubmit.bind(this);
    this.eliminarElemento = this.eliminarElemento.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleTpo_vehiculo_Change(event) {
    this.setState({
      data: {
        ...this.state.data,
        tipovehiculo: event.target.value,
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

  eliminarElemento(id) {
    fetch(`${process.env.REACT_APP_API_HOST}/delvehiculo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "asdssffsdff",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState(
              {
                loading: false,
                msg: {
                  visible: true,
                  body: "El elemento se elimino correctamente.",
                },
              },
              () => {
                this.getData();
              }
            );
          } else {
            this.setState({
              loading: false,
              msg: {
                visible: true,
                body: result.errMsgs,
              },
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  resetForm() {
    this.setState({
      data: {
        idlocalidad: 0,
        idvehiculo: 0,
        direccion: "",
        latitud: 0,
        longitud: 0,
      },
      loading: true,
    });
    document.getElementById("frm-cajeros").reset();
  }

  handleFromVehiculosSubmit(event) {
    event.preventDefault();
    let data = {
      "idlocalidad": this.state.data.idlocalidad,
      "idvehiculo": this.state.data.idvehiculo,
      "direccion": this.state.data.direccion,
      "latitud": this.state.data.latitud,
      "longitud": this.state.data.longitud,
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
        ...this.state.registro,
        [name]: value,
      },
    });
  }

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/getvehiculos`, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState({
              vehiculos: result.data.data,
            });
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
          console.log(error);
        }
      );
    this.setState({
      loading: false,
    });
    //Localidades
    let ciudades = new Promise((resolve, reject) => {
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
                  resolve("Ok Ciudades");
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
                  reject("Error");
                }
              );
            }
          },
          (error) => {
            //???
            console.log(error);
            reject("Error");
          }
        );
    });

    // Tipo de Bancos

    let tipo_vehiculo = new Promise((resolve, reject) => {
      //  fetch(`${process.env.REACT_APP_API_HOST}/cajeros/localidad/${this.state.tipo_bco}`,{
      fetch(`${process.env.REACT_APP_API_HOST}/gettipovehiculos`, {
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
                  tipo_bco: result.data.registros,
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
                    body: result.errMsg,
                  },
                },
                () => {
                  reject("Error");
                }
              );
            }
          },
          (error) => {
            //???
            console.log(error);
            reject("Error");
          }
        );
    });

    Promise.all([ciudades, tipo_vehiculo]).then((values) => {
      this.setState({
        loading: false,
      });
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const localidades = this.state.localidades.map((localidad) => {
      return (
        <option key={`loc-${localidad.id}`} value={localidad.id}>
          {localidad.nombre.toUpperCase()}
        </option>
      );
    });
    const tipo_vehiculo = this.state.tipo_vehiculo.map((tip_vehiculo) => {
      return (
        <option key={`tp-${tip_vehiculo.id}`} value={tip_vehiculo.id}>
          {tip_vehiculo.nombre}
        </option>
      );
    });
    // const lista_cajeros = this.state.cajeros.map((caja) => {
    //   return (
    //     <FormCajeros
    //       key={`caja-${caja.id}`}
    //       id={caja.id}
    //       localidad={this.state.localidades}
    //       eliminar={this.eliminarElemento}
    //     />
    //   );
    // });

    return (
      <div className="Cajeros">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-user" /> Nuevo Vehiculo
            </h4>
            <form
              method="post"
              onSubmit={this.handleFromVehiculosSubmit}
              id="frm-cajeros"
            >
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
                      {localidades}
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
                      value={this.state.data.tipo_vehiculo}
                      onChange={this.handleTpo_vehiculo_Change}
                    >
                      {"-"}
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
                <div className="ccol-sm-12 col-md-3 m-auto">
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
              <div className="row ">
                <div className="col">
                  {"<" ? (
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.saveData}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.saveData}
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
              Listado de Vehiculos
            </h5>
            <div className="row">
              {/* <div className="col">{lista_cajeros}</div> */}
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

export default Vehiculos;
