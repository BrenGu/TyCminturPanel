import React, { Component } from "react";
//import LocSelect from "../utiles/LocSelect";
import FormCajeros from "./comcajeros/FormCajeros";
import Msg from "../utiles/Msg";

class Cajeros extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      data: {
        idlocalidad: 6,
        tpo_bco: 0,
        domicilio: "",
        latitud: 0,
        longitud: 0,
      },
      cajeros: [],
      localidades: [],
      tipo_bco: [],
      msg: {
        visible: false,
        body: "",
      },
    };
    this.getData = this.getData.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleTpo_bco_loca_Change = this.handleTpo_bco_loca_Change.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFromCajerosSubmit = this.handleFromCajerosSubmit.bind(this);
    this.eliminarElemento = this.eliminarElemento.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  handleTpo_bco_loca_Change(event) {
    this.setState({
      data: {
        ...this.state.data,
        tpo_bco: event.target.value,
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
    fetch(`${process.env.REACT_APP_API_HOST}/delcajero/${id}`, {
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
  handleFromCajerosSubmit(event) {
    event.preventDefault();
    let data = {
      idlocalidad: this.state.data.idlocalidad,
      tpo_bco: this.state.data.tpo_bco,
      domicilio: this.state.data.domicilio,
      latitud: this.state.data.latitud,
      longitud: this.state.data.longitud,
    };
    fetch(`${process.env.REACT_APP_API_HOST}/addcajero`, {
      method: "POST",
      headers: {
        Authorization: "asdssffsdff",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      //console.log(data)
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

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/getcajeros`, {
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
              cajeros: result.data.registros,
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
    let tpo_bco = new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_HOST}/getbancos`, {
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

    Promise.all([ciudades, tpo_bco]).then((values) => {
      this.setState({
        loading: false,
      });
    });
  }
  resetForm() {
    this.setState({
      data: {
        idlocalidad: 0,
        tpo_bco: 0,
        domicilio: "",
        latitud: 0,
        longitud: 0,
      },
      loading: true,
    });
    document.getElementById("frm-cajeros").reset();
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
    const tipo_bco = this.state.tipo_bco.map((tipo_banco) => {
      return (
        <option key={`tp-${tipo_banco.id}`} value={tipo_banco.id}>
          {tipo_banco.nombre}
        </option>
      );
    });
    const lista_cajeros = this.state.cajeros.map((caja) => {
      return (
        <FormCajeros
          key={`caja-${caja.id}`}
          id={caja.id}
          localidades={this.state.localidades}
          tipo_bco={this.state.tipo_bco}
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
              <i className="fas fa-money-check-alt" /> Nuevo Cajero
            </h4>
            <form
              method="post"
              onSubmit={this.handleFromCajerosSubmit}
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
                    <label htmlFor="tpo_bco">Bancos </label>
                    <select
                      name="tpo_bco"
                      id="tpo_bco"
                      className="form-control"
                      value={this.state.data.tpo_bco}
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
              </div>
              <div className="row ">
                <div className="col">
                  {"<" ? (
                    <div className="d-flex justify-content-between">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        //onClick={this.saveData}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        //  onClick={this.saveData}
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
              Listado de Cajeros
            </h5>
            <div className="row">
              <div className="col">{lista_cajeros}</div>
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

export default Cajeros;
