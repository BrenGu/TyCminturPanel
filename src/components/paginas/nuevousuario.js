import React, { Component } from "react";
import Msg from "../utiles/Msg";

class Atractivos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      email: "",
      password: "",
      nombre: "",
      msg: {
        visible: false,
        body: ""
      }
    };
    this.updateUsuario = this.updateUsuario.bind(this);
    this.addUsuario = this.addUsuario.bind(this);
    this.verificar = this.verificar.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  updateUsuario(id){
    let data = {
      "email": this.state.email,
      "password": this.state.password,
      "nombre": this.state.nombre,
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
  }

  addUsuario() {
    let data = {
      email: this.state.email,
      password: this.state.password,
      nombre: this.state.nombre
    };
    fetch(`${process.env.REACT_APP_API_HOST}/user`, {
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
            this.setState({
              email: "",
              nombre: "",
              msg: {
                  visible: true,
                  body: "Creacion correcta de usuario"
              }
          });
          //this.handleFClick(this.state.localidadSelect);
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

  verificar(){
    var self = this;
    fetch(`${process.env.REACT_APP_API_HOST}/users`, {
      method: "GET",
      headers: {
        Authorization: ""
      }
    })
      .then(res => res.json())
      .then(
        result => {
          self.setState({
            users: result.data.registros
          }, () => {
            let res1 = self.state.users.filter(x => x.email === self.state.email && x.activo === "0");
            let res2 = self.state.users.filter(x => x.email === self.state.email && x.activo === "1");
            if(res1.length === 1){
              var id = res1["0"].id;
              self.updateUsuario(id);
            }else if(res1.length === 0 && res2.length === 0){
              self.addUsuario();    
            }else{
              this.setState({
                msg: {
                  visible: true,
                  body: "Ese email ya existe"
                }
              });
            }
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
}

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
            <i className="fas fa-city" /> Ingresá los datos del nuevo usuario
          </h4>
          <div className="row">
              <div className="col-sm-12 col-md-4 m-auto">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Ingrese Nombre" name="nombre" id="nombre" value={this.state.nombre} onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                  <input type="email" className="form-control" placeholder="Ingrese Email" name="email" id="email" value={this.state.email} onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" placeholder="Ingrese Contraseña" name="password" id="password" onChange={this.handleInputChange} />
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-dark" onClick={this.verificar}>Crear Nuevo Usuario</button>
                </div>

              </div>
            </div>
          </div>
        <Msg visible={this.state.msg.visible} okClose={() => this.setState({msg: { ...this.state.msg, visible: false}})} okAceptar={null} tipo="0">
          {this.state.msg.body}
        </Msg>
      </React.Fragment>
    );
  }
}

export default Atractivos;
