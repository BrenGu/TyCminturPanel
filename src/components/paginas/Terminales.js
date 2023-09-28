import React, { Component } from "react";
import Msg from "../utiles/Msg";
import FormTerminales from "./comterminales/FormTerminales";
class Terminales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        idlocalidad: 6,
        nombre: "",
        domicilio: "",
        telefono: 0,
        interno: 0,
        email: "",
        web: "",
        activo: "1"  ,
        responsable: "",
        latitud: 0,
        longitud: 0,
      },
      terminales: [],
      localidades: [],
      msg: {
        visible: false,
        body: "",
      },
    };
    this.getData = this.getData.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFromTerminalSubmit = this.handleFromTerminalSubmit.bind(this);
    this.eliminarElemento = this.eliminarElemento.bind(this);
    this.resetForm = this.resetForm.bind(this);
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
    fetch(`${process.env.REACT_APP_API_HOST}/delterminal/${id}`, {
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
  handleFromTerminalSubmit(event) {
    event.preventDefault();
    let data = {
      idlocalidad: this.state.data.idlocalidad,
      nombre: this.state.data.nombre,
      domicilio: this.state.data.domicilio,
      telefono: this.state.data.telefono,
      interno: this.state.data.interno,
      email: this.state.data.email,
      web: this.state.data.web,
      activo: this.state.data.web,
      responsable: this.state.data.responsable,
      latitud: this.state.data.latitud,
      longitud: this.state.data.longitud,
    };
    fetch(`${process.env.REACT_APP_API_HOST}/addterminal`, {
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
  resetForm() {
    this.setState({
      data: {
        idlocalidad: 6,
        nombre: "",
        domicilio: "",
        telefono: 0,
        interno: 0,
        email: "",
        web: "",
        activo: "",
        responsable: "",
        latitud: 0,
        longitud: 0,
      },
      loading: true,
    });
    document.getElementById("frm-terminales").reset();
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

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/getterminales`, {
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
              terminales: result.data.registros,
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
    Promise.all([ciudades]).then((values) => {
      this.setState({
        loading: false,
      });
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const lista_terminales = this.state.terminales.map((ter) => {
      return (
        <FormTerminales
          key={`ter-${ter.id}`}
          id={ter.id}
          localidades={this.state.localidades}
          eliminar={this.eliminarElemento}
        />
      );
    });

    const lista_localidades = this.state.localidades.map((localidad) => {
      return (
        <option key={`loc-${localidad.id}`} value={localidad.id}>
          {localidad.nombre.toUpperCase()}
        </option>
      );
    });

    return (
      <div className="Terminales">
        {this.state.loading ? (
          <div>Cargando ..</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-bus" /> Nuevo Terminal
            </h4>
            <form
              method="post"
              onSubmit={this.handleFromTerminalSubmit}
              id="frm-terminales"
            >
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre </label>
                    <input
                      name="nombre"
                      id="nombre"
                      className="form-control"
                      value={this.state.data.nombre}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="domicilio">Direccion</label>
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
                <div className="col">
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
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="telefono">Telefono</label>
                    <input
                      type="text"
                      name="telefono"
                      id="telefono"
                      className="form-control"
                      value={this.state.data.telefono}
                      onChange={this.handleInputChange}
                      maxLength="99"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="interno">Interno</label>
                    <input
                      type="text"
                      name="interno"
                      id="interno"
                      className="form-control"
                      value={this.state.data.interno}
                      onChange={this.handleInputChange}
                      maxLength="99"
                    />
                  </div>
                </div>
                <div className="col">
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
              </div>
              <div className="row">
                <div className="col">
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
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="responsable">Responsable</label>
                    <input
                      type="text"
                      name="responsable"
                      id="responsable"
                      className="form-control"
                      value={this.state.data.responsable}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
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
                <div className="col">
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
                      <button type="submit" className="btn btn-primary">
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        // onClick={this.saveData}
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
              Listado de Terminales
            </h5>
            <div className="row">
              <div className="col">{lista_terminales}</div>
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
export default Terminales;
