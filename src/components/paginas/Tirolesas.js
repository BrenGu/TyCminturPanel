import React, { Component } from "react";
import FormTirolesas from "./comtirolesas/FormTirolesas";
import Msg from "../utiles/Msg";

class Tirolesas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        idlocalidad: 6, //Ciudad de San Luis por defecto
        nombre: "",
        direccion:"",
        telefono: "",
        web:"",
        activo: "1",
        icon: "", 
        url:"",
        titular:"",
        vencimiento: "",
      },
      tirolesas:[],
      localidades: [],
      msg: {
        visible: false,
        body: ""
      }
    };
    this.getData = this.getData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleFromNovSubmit = this.handleFromNovSubmit.bind(this);
    this.eliminarElemento = this.eliminarElemento.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
  }

  handleLocalidadChange(event) {
    this.setState({
      data: {
        ...this.state.data,
        idlocalidad: event.target.value
      }
    });
  }

  eliminarElemento(id) {
    fetch(`${process.env.REACT_APP_API_HOST}/deltirolesa/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "asdssffsdff",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then((result) => {
          if (!result.err) {
            this.setState(
              {
                loading: false,
                msg: {
                  visible: true,
                  body: "El elemento se elimino correctamente."
                }
  
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
                body: result.errMsgs
              }
            });
          }
        },
        (error) => {
          console.log(error);
        });
          
  }

  handleFromNovSubmit(event) {
    event.preventDefault();
    let data = {
      "idlocalidad": this.state.data.idlocalidad,
      "nombre":this.state.data.nombre,
      "direccion": this.state.data.direccion,
      "telefono": this.state.data.telefono,
      "web": this.state.data.web,
      "activo": this.state.data.activo,
      "icon":this.state.data.icon,
      "url": this.state.data.url,
      "titular": this.state.data.titular,
      "vencimiento": this.state.data.vencimiento
    };
    
    fetch(`${process.env.REACT_APP_API_HOST}/addtirolesas`, {
      method: "POST",
      headers: {
        Authorization: "asdssffsdff",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
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
    this.setState({
      data: {
        idlocalidad: 6, //Ciudad de San Luis por defecto
        nombre: "",
        direccion:"",
        telefono: "",
        web:"",
        activo: "",
        icon:"",
        url: "",
        titular:"",
        vencimiento:""
      },
      loading: true
    });
    document.getElementById("frm-novedades").reset();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      data: {
        ...this.state.data,
        [name]: value
      }
    });
  }

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/gettirolesasAll`, {
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
              tirolesas: result.data.registros
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
    const lista_tirolesas= this.state.tirolesas.map(tiro => {
      return (
        <FormTirolesas
          key={`tiro-${tiro.id}`}
          id={tiro.id}
          localidades={this.state.localidades}
          eliminar={this.eliminarElemento}
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
              <i className="fas fa-user" /> Nueva Tirolesa
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
                        <label htmlFor="id">Localidad</label>
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
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                          type="text"
                          name="nombre"
                          id="nombre"
                          className="form-control"
                          value={this.state.data.nombre}
                          onChange={this.handleInputChange}
                          maxLength="99"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="direccion">Direccion</label>
                        <input
                          type="text"
                          name="direccion"
                          id="direccion"
                          className="form-control"
                          value={this.state.data.direccion}
                          onChange={this.handleInputChange}
                          maxLength="99"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
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
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="web">Web</label>
                        <input
                          type="text"
                          name="web"
                          id="web"
                          className="form-control"
                          value={this.state.data.web}
                          onChange={this.handleInputChange}
                          maxLength="99"
                        />
                      </div>
                    </div>
                         
                  </div>
                </div>
                <div>                       
                  <div className="col-md-12">
                    <div className="form-group">
                    <label htmlFor="url">Url</label>
                      <input
                        type="text"
                        name="url"
                        id="url"
                        className="form-control"
                        value={this.state.data.url}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div> 
                  <div className="col-md-12">
                        <div className="form-group">
                        <label htmlFor="titular">Titular</label>
                        <input
                            type="text"
                            name="titular"
                            id="titular"
                            className="form-control"
                            value={this.state.data.titular}
                            onChange={this.handleInputChange}                          
                        />
                        </div>
                    </div>   
                    <div className="col-md-12">
                        <div className="form-group">
                        <label htmlFor="vencimiento">Vencimiento </label>
                        <input
                            type="text"
                            name="vencimiento"
                            id="vencimiento"
                            className="form-control"
                            value={this.state.data.vencimiento}
                            onChange={this.handleInputChange}                           
                        />
                        </div>
                    </div>   
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
                </div>
                
            </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-warning">
                      <i className="far fa-window-restore" />
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-arrow-down" /> Agregar Tirolesa
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
              Listado de Tirolesas
            </h5>
            <div className="row">
              <div className="col">
                <hr />
                {lista_tirolesas}
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
export default Tirolesas;
