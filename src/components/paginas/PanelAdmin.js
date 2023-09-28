import React, { Component } from "react";
import Msg from "../utiles/Msg";
import { Consumer } from "../../context";
import FormPanelAdmin from "./companeladmin/FormPanelAdmin";

class PanelAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      users: [],
      tipos: [],
      user: {
        email: "",
        password: "",
        nombre: "",
        idtipo: 1,
      },
      msg: {
        visible: false,
        body: "",
      },
    };

    //this.updateUsuario = this.updateUsuario.bind(this);
    this.addUsuario = this.addUsuario.bind(this);
    this.verificar = this.verificar.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.eliminarUser = this.eliminarUser.bind(this);
    this.handleTipoChange = this.handleTipoChange.bind(this);
  }

  handleTipoChange(event) {
    this.setState({
      user: {
        ...this.state.user,
        idtipo: event.target.value,
      },
    });
  }

  /*updateUsuario(id){
    let data = {
      "email": this.state.user.email,
      "password": this.state.user.password,
      "nombre": this.state.user.nombre,
      "activo": "1"
    }
    fetch(`${process.env.REACT_APP_API_HOST}/user/${id}`, {
      method: 'PATCH',
      headers: {
        "Authorization": "asdssffsdff",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      
    }).then((response) => {
        this.setState({
          msg: {
            visible: true,
            body: "Mail registrado con exito"
          }
        }); 
      })
      .catch((error) => {
          console.log(error);
      });
  }*/

  addUsuario() {
    let data = {
      email: this.state.user.email,
      password: this.state.user.password,
      nombre: this.state.user.nombre,
      idtipo: this.state.user.idtipo,
    };
    fetch(`${process.env.REACT_APP_API_HOST}/user`, {
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
                user: {
                  ...this.state.user,
                  email: "",
                  nombre: "",
                  idtipo: 1,
                },
                msg: {
                  visible: true,
                  body: "Creacion correcta de usuario",
                },
              },
              () => {
                this.getData();
              }
            );
            //this.handleFClick(this.state.localidadSelect);
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

  verificar(event) {
    event.preventDefault();

    let res2 = this.state.users.filter(
      (x) => x.email === this.state.user.email && x.activo === "1"
    );
    console.log(res2);

    if (res2.length === 0) {
      this.addUsuario();
    } else {
      this.setState({
        msg: {
          visible: true,
          body: "Ese email ya existe",
        },
      });
    }
  }

  handleInputChange(event) {
    console.log("paso");
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      user: {
        ...this.state.user,
        [name]: value,
      },
    });
  }

  getData() {
    var self = this;
    fetch(`${process.env.REACT_APP_API_HOST}/users`, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    })
      .then((res) => res.json())
      .then(
        (result) => {
          self.setState({
            users: result.data.registros,
            loading: false,
          });
        },
        (error) => {
          console.log(error);
        }
      );

    fetch(`${process.env.REACT_APP_API_HOST}/tiposUser`, {
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
              tipos: result.data.registros,
              loading: false,
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
          this.setState({
            msg: {
              visible: true,
              body: error,
            },
          });
        }
      );
  }

  componentDidMount() {
    this.getData();
  }

  eliminarUser(id) {
    this.setState(
      {
        loading: true,
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/user/${id}`, {
          method: "DELETE",
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
                    msg: {
                      visible: true,
                      body: "El usuario se eliminó correctamente.",
                    },
                  },
                  () => {
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
    );
  }

  render() {
    const lista_user = this.state.users.map((user) => {
      return (
        <FormPanelAdmin
          key={`user-${user.id}`}
          id={user.id}
          eliminar={this.eliminarUser}
        />
      );
    });

    const tiposUser = this.state.tipos.map((tip) => {
      return (
        <option key={`tip-${tip.id}`} value={tip.id}>
          {tip.descripcion}
        </option>
      );
    });

    return (
      <div className="Novedades">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <div className="container">
              <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
                <i className="fas fa-user" /> Ingresá los datos del nuevo
                usuario
              </h4>
              <form method="post" onSubmit={this.verificar} id="frm-user-new">
                <div className="grid-noveades">
                  <div className="noveades-span-row-2">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="nombre">Nombre: </label>
                          <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            id="nombre"
                            value={this.state.user.nombre}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="Email">Email: </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Ingrese Email"
                            name="email"
                            id="email"
                            value={this.state.user.email}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="idtipo">Tipo de permiso: </label>
                        <select
                          name="idtipo"
                          id="idtipo"
                          className="form-control"
                          value={this.state.user.idtipo}
                          onChange={this.handleTipoChange}
                        >
                          {tiposUser}
                        </select>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="password">Contraseña: </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Ingrese Contraseña"
                          name="password"
                          id="password"
                          onChange={this.handleInputChange}
                        />
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
                        <i className="fas fa-arrow-down" /> Agregar Usuario
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <br />
            {/*<h5 className="bg-dark text-white p-3 mb-3 rounded">
              Listado de Usuarios
            </h5>
            <div className="row">
              <div className="col">
                {lista_user}
              </div>
            </div>
            <Msg visible={this.state.msg.visible} okClose={() => this.setState({msg: { ...this.state.msg, visible: false}})} okAceptar={null} tipo="0">
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
          `}</style>*/}
          </React.Fragment>
        )}
      </div>
    );
  }
}

PanelAdmin.contextType = Consumer;
export default PanelAdmin;
