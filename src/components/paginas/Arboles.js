import React, { Component } from "react";
import Msg from "../utiles/Msg";
import MyEditor from "./subcomponentes/MyEditor"; 
import FormArboles from "./comarboles/FormArboles";

class Arboles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      arbol: {
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
      arboles: [],
      msg: {
        visible: false,
        body: "",
      },
    };
    this.getData = this.getData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleFormArbolSubmit = this.handleFormArbolSubmit.bind(this);
    this.eliminarArbol = this.eliminarArbol.bind(this);
    this.handleDescripcionHTMLChange = this.handleDescripcionHTMLChange.bind(
      this
    );
  }

  eliminarArbol(id) {
    this.setState(
      {
        loading: true,
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/arbol/${id}`, {
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
                      body: "Los datos se eliminaron correctamente.",
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

  handleDescripcionHTMLChange(desHTML, des){
    this.setState({
      arbol: {
        ...this.state.arbol,
        descripcionHTML: desHTML,
        descripcion: des,
      },
    });
  }

  handleFormArbolSubmit(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("nombre_popular", this.state.arbol.nombre_popular);
    data.append("nombre_cientifico", this.state.arbol.nombre_cientifico);
    data.append("origen", this.state.arbol.origen);
    data.append("descripcion", this.state.arbol.descripcion);
    data.append("descripcionHTML", this.state.arbol.descripcionHTML);

    //Imágenes
    var img_uno = document.getElementById("upl-arb-uno").files[0];
    if (img_uno) {
      data.append("img-uno", img_uno, img_uno.name);
    }
    var img_dos = document.getElementById("upl-arb-dos").files[0];
    if (img_dos) {
      data.append("img-dos", img_dos, img_dos.name);
    }
    var img_tres = document.getElementById("upl-arb-tres").files[0];
    if (img_tres) {
      data.append("img-tres", img_tres, img_tres.name);
    }
    var img_cuatro = document.getElementById("upl-arb-cuatro").files[0];
    if (img_cuatro) {
      data.append("img-cuatro", img_cuatro, img_cuatro.name);
    }

    fetch(`${process.env.REACT_APP_API_HOST}/arbol`, {
      method: "POST",
      headers: {
        Authorization: "",
      },
      body: data,
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

  resetForm() {
    let date = new Date().toISOString().substr(0, 10);
    this.setState({
      arbol: {
        nombre_popular: "",
        nombre_cientifico: "",
        origen: "",
        descripcion: "",
        foto_uno: "default.jpg",
        foto_dos: "default.jpg",
        foto_tres: "default.jpg",
        foto_cuatro: "default.jpg"
      },
    });
    document.getElementById("frm-arbol").reset();
    document
      .getElementById("img-upl-arb-uno")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
        }/default.jpg`
      );
    document
      .getElementById("img-upl-arb-dos")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
        }/default.jpg`
      );
      document
      .getElementById("img-upl-arb-tres")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
        }/default.jpg`
      );
      document
      .getElementById("img-upl-arb-cuatro")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
        }/default.jpg`
      );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      arbol: {
        ...this.state.arbol,
        [name]: value,
      },
    });
  }

  handleImgChange(event) {
    let id = "img-" + event.target.id;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/arboles/12`, {
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
              arboles: result.data.registros,
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

  componentDidMount() {
    this.getData();
  }


  render() {
    const lista_arboles = this.state.arboles.map((arbol) => {
      return (
        <FormArboles
        key={`arbol-${arbol.id}`}
          id={arbol.id}
          eliminar={this.eliminarArbol}
        />
      );
    });

    return (
      <div className="Arboles">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-newspaper" /> Carga de Árboles
            </h4>
            <form
              method="post"
              onSubmit={this.handleFormArbolSubmit}
              id="frm-arbol"
            >
              <div className="grid-arboles">
                <div className="arboles-span-row-2">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="nombre_popular">Nombre popular</label>
                        <input
                          type="text"
                          name="nombre_popular"
                          id="nombre_popular"
                          className="form-control"
                          value={this.state.arbol.nombre_popular}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="nombre_cientifico">
                          Nombre cientifico
                        </label>
                        <input
                          type="text"
                          name="nombre_cientifico"
                          id="nombre_cientifico"
                          className="form-control"
                          value={this.state.arbol.nombre_cientifico}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="origen">Origen</label>
                        <input
                          type="text"
                          name="origen"
                          id="origen"
                          className="form-control"
                          value={this.state.arbol.origen}
                          onChange={this.handleInputChange}
                          maxLength="75"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* End primera columna */}
                <div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="Descripcion">Descripcion</label>
                        <MyEditor
                          descripcionHTML={
                            this.handleDescripcionHTMLChange
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="row">
                    <div className="col-mb-2">
                      Tamaño sugerido no menor a 800px de ancho, 600px alto,
                      72ppp
                    </div>
                    <div className="d-flex">
                      <div className="col">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-arb-uno"
                          id="upl-arb-uno"
                          accept="image/"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-arb-uno"
                          className="img-fluid img-arbol"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                          }/${this.state.arbol.foto_uno}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-arb-uno").click();
                          }}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-arb-dos"
                          id="upl-arb-dos"
                          accept="image/"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-arb-dos"
                          className="img-fluid img-arbol"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                          }/${this.state.arbol.foto_dos}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-arb-dos").click();
                          }}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-arb-tres"
                          id="upl-arb-tres"
                          accept="image/"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-arb-tres"
                          className="img-fluid img-arbol"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                          }/${this.state.arbol.foto_tres}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-arb-tres").click();
                          }}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-arb-cuatro"
                          id="upl-arb-cuatro"
                          accept="image/"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-arb-cuatro"
                          className="img-fluid img-arbol"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_ARBOLES_FOTOS
                          }/${this.state.arbol.foto_cuatro}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-arb-cuatro").click();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={this.resetForm}
                    >
                      <i className="far fa-window-restore" />
                    </button>
                    <button
                    type="submit" 
                    className="btn btn-primary">
                      <i className="fas fa-arow-down"/>Agregar Árbol
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">Listas de Árboles</h5>
            <div className="row">
              <div className="col">
                <span>Últimos 12 árboles cargados</span>
                <hr />
                {lista_arboles}
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
          .grid-arboles {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px;
          }
          .arboles-span-row-2 {
            grid-row: span 2 / auto;
          }
        `}</style>
      </div>
    );
  }
}

export default Arboles;