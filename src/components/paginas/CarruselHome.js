import React, { Component } from "react";
import FormCarrusel from "./comcarrusel/FormCarrusel";
import Msg from "../utiles/Msg";

class CarruselHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      foto: {
        activo: false,
        idGHome: "",
        horizontal: false,
        vertical: false,
        image: "default.jpg"
      },
      galeria: [],
      msg: {
        visible: false,
        body: "",
      },
    };
    this.getData = this.getData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleFromNovSubmit = this.handleFromNovSubmit.bind(this);
    this.eliminarNovedad = this.eliminarNovedad.bind(this);
  }

  eliminarNovedad(id) {
    this.setState(
      {
        loading: true,
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/delimagen/${id}`, {
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

  handleFromNovSubmit(event) {
    event.preventDefault();
    const data = this.state.foto
    //Imágenes
    var img_uno = document.getElementById("upl-nov-uno").files[0];
    
    if (img_uno) {
      Object.defineProperty(data, "img-uno", {
        value: img_uno,
        writable: true,
        enumerable: true
      });
    }
    //Verificar tamaño de las imágenes no mas de 4MB
    /*if (data.has("img-uno")) {
      if (data.get("img-uno").size > 500000) {
        this.setState({
          msg: {
            visible: true,
            body: "El tamaño de la primer imágen supera los 4MB.",
          },
        });
        return false;
      }
    }*/
    console.log(data)
    fetch(`${process.env.REACT_APP_API_HOST}/addimgcarrusel`, {
      method: "POST",
      headers: {
        "Authorization": "asdssffsdff",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
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
            console.log(result);
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
  }
  resetForm() {
    this.setState({
      foto: {
        activo: false,
        idGHome: "",
        horizontal: false,
        vertical: false,
        image: "default.jpg",
      },
    });
    document.getElementById("frm-carrusel").reset();
    document
      .getElementById("img-upl-nov-uno")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_CARRUSEL
        }/default.jpg`
      );
  }

  handleInputChange(event) {
    const target = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      foto: {
        ...this.state.foto,
        [target]: value
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
    fetch(`${process.env.REACT_APP_API_HOST}/carruseles`, {
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
              galeria: result.data.registros,
            });
            console.log(this.state.galeria);
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
    const fotos = this.state.galeria.map((foto) => {
      return (
        <FormCarrusel
          key={`foto-${foto.id}`}
          id={foto.id}
          eliminar={this.eliminarNovedad}
        />
      );
    });
    return (
      <div className="Novedades">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-camera" /> Cambios de Imagen en el Carrusel
              Principal
            </h4>
            <form
              method="post"
              onSubmit={this.handleFromNovSubmit}
              id="frm-carrusel"
            >
              <div className="grid-noveades">
                <div className="noveades-span-row-2">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <span aria-hidden="true">
                          Activo
                          {"           "}
                        </span>
                        <input
                          type="checkbox"
                          name="activo"
                          id="activo"
                          value={this.state.foto.activo}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="idGHome">IdGaleria</label>
                        <input
                          type="text"
                          name="idGHome"
                          id="idGHome"
                          className="form-control"
                          value={this.state.foto.idGHome}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <span aria-hidden="true">
                          Horizontal
                          {"           "}
                        </span>
                        <input
                          type="checkbox"
                          name="horizontal"
                          id="horizontal"
                          value={this.state.foto.horizontal}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col">
                      <div className="form-group">
                        <span aria-hidden="true">
                          Vertical
                          {"           "}
                        </span>
                        <input
                          type="checkbox"
                          name="vertical"
                          id="vertical"
                          value={this.state.foto.vertical}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="row">
                    <div className="col mb-2">
                      Tamaño sugerido no menor a 800px de ancho 600px de alto
                      72ppp
                    </div>
                    <div className="d-flex">
                      <div className="col">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-nov-uno"
                          id="upl-nov-uno"
                          accept="image/*"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-nov-uno"
                          className="img-fluid img-novedad"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_CARRUSEL
                          }/${this.state.foto.image}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-nov-uno").click();
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
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-arrow-down" /> Agregar Imagen
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
              Carruseles Usados
            </h5>
            <div className="row">
              <div className="col">
                <span>Ultimos Carruseles</span>
                <hr />
                {fotos}
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

export default CarruselHome;
