import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";
import MyEditor from "../../paginas/subcomponentes/MyEditor";
/*
    Parámetros:
    id: Id de la Novedad
    eliminar: manejador de evento de eliminación
*/

class FormCarrusel extends Component {
  constructor(props) {
    super(props);
    let date = new Date().toISOString().substr(0, 10);
    this.state = {
      loading: true,
      id: 0,
      registro: {
        id: 0,
        activo: "",
        idGaleria: "",
        horizontal: "",
        vertical: "",
        image: "default.jpg",
      },
      msg: {
        visible: false,
        body: "",
        tipo: 0,
      },
    };
    this.setData = this.setData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
    this.handlDescripcionHTMLChange = this.handlDescripcionHTMLChange.bind(
      this
    );
  }

  handlDescripcionHTMLChange(desHTML, des) {
    this.setState({
      registro: {
        ...this.state.registro,
        descripcionHTML: desHTML,
        descripcion: des,
      },
    });
  }
  handleImgChange(event) {
    //disparador ej: file-1-${this.state.registro.id
    //imagen ej: img-1-${this.state.registro.id
    let disparador = event.target.id.split("-");
    let id = `img-${disparador[1]}-${disparador[2]}`;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  askDelete(titulo) {
    this.setState({
      msg: {
        visible: true,
        body: `Seguro de eliminar "${titulo}"`,
        tipo: 1,
      },
    });
  }

  okDelete() {
    this.setState(
      {
        msg: {
          visible: false,
          body: "Se elimino correctamente",
          tipo: 0,
        },
      },
      () => {
        this.props.eliminar(this.state.registro.id);
      }
    );
  }

  saveData(event) {
    event.preventDefault();
    const formData = new FormData();
    let date = {
        "id": this.state.registro.id,
        "activo": this.state.registro.activo,
        "idGaleria": this.state.registro.idGaleria,
        "horizontal": this.state.registro.horizontal,
        "vertical": this.state.registro.vertical,
        "image": this.state.registro.image,
      };
    Object.keys(this.state.registro).forEach((key) =>
      formData.append(key, this.state.registro[key])
    );
    //Imágenes
    let image = document.getElementById(`file-1-${this.state.registro.id}`)
      .files[0];
    if (image) {
      formData.append("image", image, image.name);
    }

    /*
        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]);
        }
        */
    //Verificar tamaño de las imágenes no mas de 4MB
    if (formData.has("image")) {
      if (formData.get("image").size > 500000) {
        this.setState({
          msg: {
            tipo: 0,
            visible: true,
            body: "El tamaño de la primer imágen supera los 4MB.",
          },
        });
        return false;
      }
    }

    //Guardar los cambios
    let token = this.context.token;
    fetch(
      //console.log(this.)
      `${process.env.REACT_APP_API_HOST}/upimgcarrusel/${this.state.id}`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState({
              msg: {
                tipo: 0,
                visible: true,
                body: "Los datos se guardaron correctamente",
              },
            });
          } else {
            this.setState({
              msg: {
                tipo: 0,
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
      registro: {
        ...this.state.registro,
        [name]: value,
      },
    });
  }

  setData() {
    let token = this.context.token;
    this.setState(
      {
        id: this.props.id,
      },

      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/carruseles`, {
          method: "GET",
          headers: {
            Authorization: token,
            //"Content-Type": "application/json"
          },
        })
          .then((res) => res.json())
          .then(
            (result) => {
              if (!result.err) {
                if (parseInt(result.data.count, 10) > 0) {
                  this.setState({
                    registro: result.data.registros[0],
                    loading: false,
                  });
                  // console.log(result.data);
                } else {
                  console.log("No hay registro: " + this.state.id);
                }
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
             console.log("el error es " + error);
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
    return (
      <React.Fragment>
        {this.state.loading ? (
          <h1>Cargando...</h1>
        ) : (
          <form method="post" onSubmit={this.saveData} id="frm-novedades">
            <div className="row border p-2 mb-3">
              <div className="col-sm-12 col-md-3">
                <div>
                  <input
                    type="file"
                    className="d-none"
                    name={`file-1-${this.state.registro.id}`}
                    id={`file-1-${this.state.registro.id}`}
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <img
                    id={`img-1-${this.state.registro.id}`}
                    className="img-fluid"
                    style={{
                      width: "250px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/carrusel/${
                      this.state.registro.image
                    }`}
                    alt="Foto"
                    onClick={(e) => {
                      document
                        .getElementById(`file-1-${this.state.registro.id}`)
                        .click();
                    }}
                  />
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                    <span aria-hidden="true">Activo
                          {"           "}
                      </span>
                      <input
                        type="checkbox"
                        name="activo"
                        id="activo"
                        value={this.state.registro.activo}
                        onChange={this.handleInputChange}
                         />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-9">
                    <div className="form-group">
                    <span aria-hidden="true">Horizontal
                          {"           "}
                      </span>
                      <input
                        type="checkbox"
                        name="horizontal"
                        id="horizontal"
                        value={this.state.registro.horizontal}
                        onChange={this.handleInputChange}
                        />
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-3">
                    <div className="form-group">
                    <span aria-hidden="true">Vertical
                          {"           "}
                      </span>
                      <input
                        type="checkbox"
                        name="vertical"
                        id="vertical"
                        value={this.state.registro.vertical}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="idGaleria">Id Galeria</label>
                      <input
                        type="text"
                        name="idGaleria"
                        id="idGaleria"
                        className="form-control"
                        value={this.state.registro.idGaleria}
                        onChange={this.handleInputChange}
                        maxLength="75"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(e) =>
                          this.props.eliminar(this.state.registro.id)
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
              msg: { ...this.state.msg, visible: false, tipo: 0 },
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

FormCarrusel.contextType = Consumer;

export default FormCarrusel;
