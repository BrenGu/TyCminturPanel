import React, { Component } from "react";
import { Consumer } from "../../../context";
import Msg from "../../utiles/Msg";
import MyEditor from "../../paginas/subcomponentes/MyEditor";

class FormArboles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      id: 0,
      registro: {
        id: 0,
        nombre_popular: "",
        nombre_cientifico: "",
        origen: "",
        descripcion: "",
        descripcionHTML: "",
        foto_uno: "default.jpg",
        foto_dos: "default.jpg",
        foto_tres: "default.jpg",
        foto_cuatro: "default.jpg",
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
          body: "",
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
    Object.keys(this.state.registro).forEach((key) =>
      formData.append(key, this.state.registro[key])
    );

    for (let [name, value] of formData) {
      console.log(`${name} = ${value}`); // key1 = value1, luego key2 = value2
    }
    //Imágenes
    let img_uno = document.getElementById(`file-1-${this.state.registro.id}`)
      .files[0];
    if (img_uno) {
      formData.append("img-uno", img_uno, img_uno.name);
    }
    let img_dos = document.getElementById(`file-2-${this.state.registro.id}`)
      .files[0];
    if (img_dos) {
      formData.append("img-dos", img_dos, img_dos.name);
    }
    let img_tres = document.getElementById(`file-3-${this.state.registro.id}`)
      .files[0];
    if (img_tres) {
      formData.append("img-tres", img_tres, img_tres.name);
    }
    let img_cuatro = document.getElementById(`file-4-${this.state.registro.id}`)
      .files[0];
    if (img_cuatro) {
      formData.append("img-cuatro", img_cuatro, img_cuatro.name);
    }

    /*
        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]);
        }
        */
    //Verificar tamaño de las imágenes no mas de 4MB
    if (formData.has("img-uno")) {
      if (formData.get("img-uno").size > 500000) {
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
    if (formData.has("img-dos")) {
      if (formData.get("img-dos").size > 500000) {
        this.setState({
          msg: {
            tipo: 0,
            visible: true,
            body: "El tamaño de la segunda imágen supera los 4MB.",
          },
        });
        return false;
      }
    }
    if (formData.has("img-tres")) {
      if (formData.get("img-tres").size > 500000) {
        this.setState({
          msg: {
            tipo: 0,
            visible: true,
            body: "El tamaño de la tercer imágen supera los 4MB.",
          },
        });
        return false;
      }
    }
    if (formData.has("img-cuatro")) {
      if (formData.get("img-cuatro").size > 500000) {
        this.setState({
          msg: {
            tipo: 0,
            visible: true,
            body: "El tamaño de la cuarta imágen supera los 4MB.",
          },
        });
        return false;
      }
    }

    //Guardar los cambios
    let token = this.context.token;
    fetch(
      //console.log(this.)
      `${process.env.REACT_APP_API_HOST}/arbol/${this.state.id}`,
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
        fetch(`${process.env.REACT_APP_API_HOST}/arbol/${this.state.id}`, {
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
          <form method="post" onSubmit={this.saveData} id="frm-arbol">
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
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/${
                      process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                    }/${this.state.registro.foto_uno}`}
                    alt="Foto"
                    onClick={(e) => {
                      document
                        .getElementById(`file-1-${this.state.registro.id}`)
                        .click();
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    className="d-none"
                    name={`file-2-${this.state.registro.id}`}
                    id={`file-2-${this.state.registro.id}`}
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <img
                    id={`img-2-${this.state.registro.id}`}
                    className="img-fluid mt-2"
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/${
                      process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                    }/${this.state.registro.foto_dos}`}
                    alt="Foto"
                    onClick={(e) => {
                      document
                        .getElementById(`file-2-${this.state.registro.id}`)
                        .click();
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    className="d-none"
                    name={`file-3-${this.state.registro.id}`}
                    id={`file-3-${this.state.registro.id}`}
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <img
                    id={`img-3-${this.state.registro.id}`}
                    className="img-fluid mt-2"
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/${
                      process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                    }/${this.state.registro.foto_tres}`}
                    alt="Foto"
                    onClick={(e) => {
                      document
                        .getElementById(`file-3-${this.state.registro.id}`)
                        .click();
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    className="d-none"
                    name={`file-4-${this.state.registro.id}`}
                    id={`file-4-${this.state.registro.id}`}
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <img
                    id={`img-4-${this.state.registro.id}`}
                    className="img-fluid mt-2"
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    src={`${process.env.REACT_APP_API_HOST}/${
                      process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                    }/${this.state.registro.foto_cuatro}`}
                    alt="Foto"
                    onClick={(e) => {
                      document
                        .getElementById(`file-4-${this.state.registro.id}`)
                        .click();
                    }}
                  />
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="nombre_popular">Nombre popular</label>
                      <input
                        type="text"
                        name="nombre_popular"
                        id="nombre_popular"
                        className="form-control"
                        value={this.state.registro.nombre_popular}
                        onChange={this.handleInputChange}
                        maxLength="50"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="nombre_cientifico">
                        Nombre científico
                      </label>
                      <input
                        type="text"
                        name="nombre_cientifico"
                        id="nombre_cientifico"
                        className="form-control"
                        value={this.state.registro.nombre_cientifico}
                        onChange={this.handleInputChange}
                        maxLength="50"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="origen">Origen</label>
                      <input
                        type="text"
                        name="origen"
                        id="origen"
                        className="form-control"
                        value={this.state.registro.origen}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="descripcion">Descripcion</label>
                      <MyEditor
                        //descripcion={this.handlDescripcionChange}
                        descripcionHTML={this.handlDescripcionHTMLChange}
                        contenido={this.state.registro.descripcionHTML}
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

FormArboles.contextType = Consumer;
export default FormArboles;
