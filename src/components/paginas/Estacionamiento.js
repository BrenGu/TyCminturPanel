import React, { Component } from "react";
import Msg from "../utiles/Msg";
import FormTerminales from "./comterminales/FormTerminales";
class Estacionamieto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        idlocalidad: 6,
        nombre: "",
        direccion: "",
        telefono: "",
        email: "",
        wed: "",
        horario:"",
        latitud: 0,
        longitud: 0,
      },
      estacionamieto: [],
      localidades: [],
      msg: {
        visible: false,
        body: "",
      },
    };
    this.getData = this.getData.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFromEstacionSubmit = this.handleFromEstacionSubmit.bind(this);
    this.eliminarElemento = this.eliminarElemento.bind(this);
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
    fetch(`${process.env.REACT_APP_API_HOST}/delestacionamiento/${id}`, {
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
  handleFromEstacionSubmit(event) {
    event.preventDefault();
    let data = {
      "idlocalidad": this.state.data.idlocalidad,
      "nombre": this.state.data.nombre,
      "direccion": this.state.data.direccion,
      "telefono": this.state.data.telefono,
      "email": this.state.data.email,
      "wed": this.state.data.wed,
      "horario": this.state.data.horario,
      "latitud": this.state.data.latitud,
      "longitud": this.state.data.longitud,
      
    };
    fetch(`${process.env.REACT_APP_API_HOST}/addestacionamiento`, {
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

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/getestacionamientos`, {
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
              estacionamieto: result.data.data,
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
  resetForm() {
    this.setState({
      data: {
        idlocalidad: 6,
        nombre: "",
        direccion: "",
        telefono: 0,
        mail: "",
        web: "",
        horario: "",
        latitud: 0,
        longitud: 0,

      },
      loading: true,
    });
    document.getElementById("frm-estacionamiento").reset();
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    // const lista_estacionamientos = this.state.estacionamiento.map((ter) => {
    //   return (
    //     <FormTerminales
    //       key={`ter-${ter.id}`}
    //       id={ter.id}
    //       localidad={this.state.localidades}
    //       eliminar={this.eliminarElemento}
    //     />
    //   );
    // });

    const lista_localidades = this.state.localidades.map((localidad) => {
      return (
        <option key={`loc-${localidad.id}`} value={localidad.id}>
          {localidad.nombre.toUpperCase()}
        </option>
      );
    });

    return (
      <div className="Estacionamiento">
        {this.state.loading ? (
          <div>Cargando ..</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-user" /> Nuevo Estacionamiento
            </h4>
            <form
              method="post"
              onSubmit={this.handleFromEstacionSubmit}
              id="frm-estacionamiento"
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
                      {lista_localidades}
                    </select>
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 m-auto">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre </label>
                    <input
                      name="nombre"
                      id="nombre"
                      className="form-control"
                      value={this.state.data.nombre}
                      onChange={""}
                    />
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 m-auto">
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
              </div>
              <div className="row ">
                <div className="col">
                  {"<" ? (
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-primary"
                        // onClick={this.saveData}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
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
              <div className="col">
                {/* {lista_estacionamientos} */}
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
export default Estacionamieto;
