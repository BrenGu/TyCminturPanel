import React, { Component } from "react";
import { Consumer } from "../../context";
import LocSelect from "../utiles/LocSelect";
import Atractivo from "./comatractivos/Atractivo";

class Atractivos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "gdiaz.news@gmail.com",
      password: "qwerty123",
      nombre: "Gustavo Diaz"
    };
    this.addUsuario = this.addUsuario.bind(this);
  }

  addUsuario(email, password, nombre) {
    let data = {
      email: "gdiaz.news@gmail.com",
      password: "qwerty123",
      nombre: "Gustavo Diaz"
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
            this.handleFClick(this.state.localidadSelect);
          } else {
            console.log(result.errMsg);
          }
        },
        error => {
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
        novedad: {
            ...this.state.novedad,
            [name]: value
        }
    });
}

  render() {
    return (
      <div>
        <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
          <i className="fas fa-city" /> Ingresá los datos del nuevo usuario
        </h4>
        <form>
          <input type="text" name="nombre" value={this.state.nombre} />
          <br />
          <input type="email" name="email" />
          <br />
          <input type="password" name="password" />
          <br />
        </form>

        <button className="btn btn-dark" onClick={this.addUsuario()}>
          Crear Nuevo Usuario
        </button>
      </div>
    );
  }
}

export default Atractivos;
