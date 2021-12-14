import React, { Component } from "react";
import Msg from "../../utiles/Msg";

class FormPanelAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      tipos: [],
      loading: true,
      user: {
        email: "",
        password: "",
        nombre: "",
        activo: false,
        idtipo: 1,
      },
      msg: {
        visible: false,
        body: ""
      }
    };
    this.setData = this.setData.bind(this);
    this.updateUsuario = this.updateUsuario.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTipoChange = this.handleTipoChange.bind(this);
  }

  handleTipoChange(event) {
    this.setState({
      user: {
        ...this.state.user,
        idtipo: event.target.value
      }
    });
  }

  updateUsuario(event){
    event.preventDefault(); 

    let data = {
      "email": this.state.user.email,
      "nombre": this.state.user.nombre,
      "activo": this.state.user.activo,
      "idtipo": this.state.user.idtipo
    }
    fetch(`${process.env.REACT_APP_API_HOST}/user/${this.state.id}`, {
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
            body: "Usuario modificado con exito"
          }
        }); 
      })
      .catch((error) => {
          console.log(error);
      });
  }

  setData() {
    let token = this.context.token;
    this.setState(
      {
        id: this.props.id
      },
      () => {
        fetch(
          `${process.env.REACT_APP_API_HOST}/user/${this.state.id}`,
          {
            method: "GET",
            headers: {
              Authorization: token
            }
          }
        )
          .then(res => res.json())
          .then(
            result => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                  this.setState({
                    user: result.data.registros[0]
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
            `${process.env.REACT_APP_API_HOST}/tiposUser`,
            {
              method: "GET",
              headers: {
                Authorization: token
              }
            }
          )
            .then(res => res.json())
            .then(
              result => {
                if (!result.err) {
                    this.setState({
                        tipos: result.data.registros,
                        loading: false
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
        user: {
            ...this.state.user,
            [name]: value
        }
    });
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
    const tiposUser = this.state.tipos.map(tip => {
        return (
          <option key={`tip-${tip.id}`} value={tip.id}>
            {tip.descripcion}
          </option>
        );
    });

    return (
        <React.Fragment>
        {this.state.loading ? (
            <h1>Cargando...</h1>
          ) : (
        <React.Fragment>
            <form method="post" onSubmit={this.updateUsuario} id="frm-user-update">
                <div className="grid-noveades">
                    <div className="noveades-span-row-2">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre: </label>
                                    <input type="text" className="form-control" name="nombre" id="nombre" value={this.state.user.nombre} onChange={this.handleInputChange}/>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="Email">Email: </label>
                                    <input type="email" className="form-control" placeholder="Ingrese Email" name="email" id="email" value={this.state.user.email} onChange={this.handleInputChange}/>
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
                          <div className="form-check">
                              {this.state.user.activo >= 1 ? 
                                (
                                <input name="activo" id="activo" 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        value={this.state.user.activo} 
                                        onChange={this.handleInputChange} 
                                        checked={ this.state.user.activo ? "checked": false} />)
                                : (
                                  <input name="activo" id="activo" 
                                  className="form-check-input" 
                                  type="checkbox" value={this.state.user.activo} onChange={this.handleInputChange} />
                                  )
                              }  
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
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={e =>
                                this.props.eliminar(this.state.id)
                                }
                            >
                                <i className="fas fa-trash" />
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-arrow-down" /> Guardar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <hr />
            <Msg visible={this.state.msg.visible} okClose={() => this.setState({msg: { ...this.state.msg, visible: false}})} okAceptar={null} tipo="0">
                {this.state.msg.body}
            </Msg>
            </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default FormPanelAdmin;
