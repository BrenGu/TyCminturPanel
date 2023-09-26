import React, { Component } from "react";
//import LocSelect from "../utiles/LocSelect";
import FormCajeros from "./comcajeros/FormCajeros";
import Msg from "../utiles/Msg"
import FormVehiculos from "./comvehiculos/FormVehiculos";

class Vehiculos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        idvehiculo:1,
        idlocalidad: 0,
        nombre: "",
        domicilio: "",
        telefono: "",
        email: "",
        web: "",
        activo: "1"  ,
        latitud: 0,
        longitud: 0,
      },
      vehiculos: [],
      localidades: [],
      tipo_vehiculo: [],
      msg: {
        visible: false,
        body: "",
      },
    };
    this.getVehiculos = this.getVehiculos.bind(this);
    this.getTipoVehiculo = this.getTipoVehiculo.bind(this);
    this.getLocalidades = this.getLocalidades.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleTpo_vehiculo_Change = this.handleTpo_vehiculo_Change.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormVehiculosSubmit = this.handleFormVehiculosSubmit.bind(this);
    this.eliminarElemento = this.eliminarElemento.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  handleTpo_vehiculo_Change(event) {
    console.log("tipo vehiculo handle: ", this.state.data.idvehiculo)
    this.setState({
      data: {
        ...this.state.data,
        idvehiculo: event.target.value,
      },
    });
  }

  handleLocalidadChange(event) {
    console.log("Localidad handle: ", this.state.data.idlocalidad)
    this.setState({
      data: {
        ...this.state.data,
        idlocalidad: event.target.value,
      },
    });
  }

  eliminarElemento(id) {
    fetch(`${process.env.REACT_APP_API_HOST}/delVehiculo/${id}`, {
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
                this.getVehiculos();
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
        domicilio: "",
        latitud: 0,
        longitud: 0,
      },
      loading: true,
    });
    document.getElementById("frm-vehiculo").reset();
  }

  handleFormVehiculosSubmit(event) {
    event.preventDefault();
    let data = {
      idvehiculo: this.state.data.idvehiculo,
      idlocalidad: this.state.data.idlocalidad,
      nombre: this.state.data.nombre,
      domicilio: this.state.data.domicilio,
      telefono: this.state.data.telefono,
      email: this.state.data.email,
      web: this.state.data.web,
      activo: this.state.data.web,
      latitud: this.state.data.latitud,
      longitud: this.state.data.longitud,
    };
    fetch(`${process.env.REACT_APP_API_HOST}/addVehiculo`, {
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
                this.getVehiculos();
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
    console.log("handleInput ", name, " : ", value)
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log("handleInput ", name, " : ", value)
    this.setState({
      data: {
        ...this.state.data,
        [name]: value,
      },
    });
  }

  getVehiculos() {

    fetch(`${process.env.REACT_APP_API_HOST}/getVehiculos`, {
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
              vehiculos: result.data.registros,
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
                  // console.log('TipoVehiculoOK')
                  // console.log(this.state.tipo_vehiculo)
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

  componentDidMount() {
    this.getVehiculos();
    this.getTipoVehiculo();
    this.getLocalidades();
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

    const lista_vehiculos = this.state.vehiculos.map((vehiculo) => {
      return (
        <FormVehiculos
          key={`vehiculo-${vehiculo.id}`}
          id={vehiculo.id}
          localidad={this.state.localidades}
          eliminar={this.eliminarElemento}
        />
      );
    });

    return (
      <div className="Cajeros">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-car"/> Nuevo Vehiculo Taxi o Remis
            </h4>
            <form
              method="post"
              onSubmit={this.handleFormVehiculosSubmit}
              id="frm-vehiculo"
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
                    <div className="form-check">
                      <input
                        name="activo"
                        id="activo"
                        className="form-check-input"
                        type="checkbox"
                        value={this.state.data.activo}
                        onChange={this.handleInputChange}
                        defaultChecked={this.state.data.activo} // Establece el valor "defaultChecked"
                      />
                      <label className="form-check-label" htmlFor="activo">
                        Activo?
                      </label>
                    </div>
                  </div>
                <div className="col">
                  {"<" ? (
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        //onClick={this.saveData}
                      >
                        Agregar Vehiculo
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        //onClick={this.saveData}
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
              <div className="col">{lista_vehiculos}</div>
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
