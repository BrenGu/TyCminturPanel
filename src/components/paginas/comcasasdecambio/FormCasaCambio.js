import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";

class FormCasaCambio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      registro: {
        idlocalidad: 6, //Ciudad de San Luis por defecto
        nombre: "",
        direccion:"",
        telefono: "",
        web:"",
        horarioCierre: ""
      },
      localidades: [],
      msg: {
        visible: false,
        body: "",
        tipo: 0
      }
    };
    this.setData = this.setData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
  }

  handleLocalidadChange(event) {
    this.setState({
      registro: {
        ...this.state.registro,
        idlocalidad: event.target.value
      }
    });
  }

  askDelete(nombre) {
    this.setState({
      msg: {
        visible: true,
        body: `Seguro de eliminar "${nombre}"`,
        tipo: 1
      }
    });
  }

  okDelete() {
    this.setState(
      {
        msg: {
          visible: false,
          body: "",
          tipo: 0
        }
      },
      () => {
        this.props.eliminar(this.state.registro.id);
      }
    );
  }

  saveData(event) {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_API_HOST}/updatecasacambio/${this.state.id}`, {
      method: "POST",
      headers: {
        "Authorization": "asdssffsdff",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.registro)
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState({
              msg: {
                tipo: 0,
                visible: true,
                body: "Los datos se guardaron correctamente"
              }
            });
          } else {
            this.setState({
              msg: {
                tipo: 0,
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

  handleInputChange(event) {
    const target = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
        registro: {
            ...this.state.registro,
            [target]: value
        }
    });
  }

  setData() {
    let token = this.context.token;
    this.setState(
      {
        id: this.props.id,
        localidades: this.props.localidades
      },
      () => {
        fetch(
          `${process.env.REACT_APP_API_HOST}/casacambio/${this.state.id}`,
          {
            method: "GET",
            headers: {
              Authorization: token
              //"Content-Type": "application/json"
            }
          }
        )
          .then(res => res.json())
          .then(
            result => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                  this.setState({
                    registro: result.data.registros[0],
                    loading: false
                  });
                 
                } else {
                  console.log("No hay registro: " + this.state.id);
                }
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
              this.setState({
                msg: {
                  visible: true,
                  body: error
                }
              });
            }
          );
          fetch(
            `${process.env.REACT_APP_API_HOST}/ciudades`,
            {
              method: "GET",
              headers: {
                Authorization: token
                //"Content-Type": "application/json"
              }
            }
          )
            .then(res => res.json())
            .then(
              result => {
                if (!result.err) {
                  if (parseInt(result.data.count, 10) > 0) {
                    this.setState({
                      localidades: result.data.registros
                    });
                  } else {
                    console.log("No hay registro: " + this.state.id);
                  }
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
                this.setState({
                  msg: {
                    visible: true,
                    body: error
                  }
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
    const localidades = this.state.localidades.map(localidad => {
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
                  <div className="col">
                    <div className="form-group">
                        <label htmlFor="direccion">Direccion</label>
                        <input
                          type="text"
                          name="direccion"
                          id="direccion"
                          className="form-control"
                          value={this.state.registro.direccion}
                          onChange={this.handleInputChange}
                          maxLength="99"
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
                            value={this.state.registro.idlocalidad}
                            onChange={this.handleLocalidadChange}
                        >
                            {localidades}
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
                          value={this.state.registro.telefono}
                          onChange={this.handleInputChange}
                          maxLength="99"
                        />
                    </div>
                  </div>
                   <div className="col">
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
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                     <label htmlFor="horarioCierre">Horario</label>
                      <textarea
                        type="textarea"
                        name="horarioCierre"
                        id="horarioCierre"
                        className="form-control"
                        value={this.state.registro.horarioCierre}
                        onChange={this.handleInputChange}
                      />
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
                        onClick={/*e =>
                          this.props.eliminar(this.state.registro.id)*/(e) => { this.askDelete(this.state.registro.nombre, e) }
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
              msg: { ...this.state.msg, visible: false, tipo: 0 }
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

FormCasaCambio.contextType = Consumer;

export default FormCasaCambio;
