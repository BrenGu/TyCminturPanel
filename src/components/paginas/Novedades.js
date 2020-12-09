import React, { Component } from "react";
import FromNov from "./comnovedades/FormNov";
import Msg from "../utiles/Msg";
import MyEditor from "./subcomponentes/MyEditor";
class Novedades extends Component {
  constructor(props) {
    super(props);
    let date = new Date().toISOString().substr(0, 10);
    this.state = {
      loading: true,
      novedad: {
        localidad: "",
        fecha: date,
        titulo: "",
        subtitulo: "",
        descripcion: "",
        descripcionHTML:"",
        latitud: "0",
        longitud: "0",
        foto_uno: "default.jpg",
        foto_dos: "default.jpg"
      },
      novedades: [],
      msg: {
        visible: false,
        body: ""
      }
    };
    this.getData = this.getData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleFromNovSubmit = this.handleFromNovSubmit.bind(this);
    this.eliminarNovedad = this.eliminarNovedad.bind(this);
    this.handlDescripcionHTMLChange = this.handlDescripcionHTMLChange.bind(this);
  }

  eliminarNovedad(id) {
    this.setState(
      {
        loading: true
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/novedad/${id}`, {
          method: "DELETE",
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
                    msg: {
                      visible: true,
                      body: "Los datos se eliminaron correctamente."
                    }
                  },
                  () => {
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
    );
  }

  handlDescripcionHTMLChange(desHTML, des) {
 console.log(desHTML)
    this.setState({
      novedad: {
        ...this.state.novedad,
        descripcionHTML: desHTML,
        descripcion: des
      },
    });
  }

  handleFromNovSubmit(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("localidad", this.state.novedad.localidad);
    //Falta validar la fecha!
    data.append("fecha", this.state.novedad.fecha);
    data.append("titulo", this.state.novedad.titulo);
    data.append("subtitulo", this.state.novedad.subtitulo);
    data.append("descripcion", this.state.novedad.descripcion);
    data.append("descripcionHTML", this.state.novedad.descripcionHTML);
    console.log(this.state.novedad.descripcionHTML)
    data.append("latitud", this.state.novedad.latitud);
    data.append("longitud", this.state.novedad.longitud);
    //Imágenes
    var img_uno = document.getElementById("upl-nov-uno").files[0];
    if (img_uno) {
      data.append("img-uno", img_uno, img_uno.name);
    }
    var img_dos = document.getElementById("upl-nov-dos").files[0];
    if (img_dos) {
      data.append("img-dos", img_dos, img_dos.name);
    }
    fetch(`${process.env.REACT_APP_API_HOST}/novedad`, {
      method: "POST",
      headers: {
        Authorization: ""
      },
      body: data
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
    let date = new Date().toISOString().substr(0, 10);
    this.setState({
      novedad: {
        localidad: "",
        fecha: date,
        titulo: "",
        subtitulo: "",
        descripcion: "",
        latitud: "0",
        longitud: "0",
        foto_uno: "default.jpg",
        foto_dos: "default.jpg"
      }
    });
    document.getElementById("frm-novedades").reset();
    document
      .getElementById("img-upl-nov-uno")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_NOVEDADES_FOTOS
        }/default.jpg`
      );
    document
      .getElementById("img-upl-nov-dos")
      .setAttribute(
        "src",
        `${process.env.REACT_APP_API_HOST}/${
          process.env.REACT_APP_API_DIRECTORY_NOVEDADES_FOTOS
        }/default.jpg`
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
    fetch(`${process.env.REACT_APP_API_HOST}/novedades/12`, {
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
              novedades: result.data.registros
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
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const lista_novedades = this.state.novedades.map(novedad => {
      return (
        <FromNov
          key={`novedad-${novedad.id}`}
          id={novedad.id}
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
              <i className="fas fa-newspaper" /> Novedades
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
                        <label htmlFor="localidad">Localidad</label>
                        <input
                          type="text"
                          name="localidad"
                          id="localidad"
                          className="form-control"
                          value={this.state.novedad.localidad}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="titulo">Título</label>
                        <input
                          type="text"
                          name="titulo"
                          id="titulo"
                          className="form-control"
                          value={this.state.novedad.titulo}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="subtitulo">Sub Título</label>
                        <input
                          type="text"
                          name="subtitulo"
                          id="subtitulo"
                          className="form-control"
                          value={this.state.novedad.subtitulo}
                          onChange={this.handleInputChange}
                          maxLength="75"
                        />
                      </div>
                    </div>

                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                          type="date"
                          name="fecha"
                          id="fecha"
                          className="form-control"
                          value={this.state.novedad.fecha}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="latitud">Latitud</label>
                        <input
                          type="text"
                          name="latitud"
                          id="latitud"
                          className="form-control"
                          value={this.state.novedad.latitud}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="longitud">Longitud</label>
                        <input
                          type="text"
                          name="longitud"
                          id="longitud"
                          className="form-control"
                          value={this.state.novedad.longitud}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <MyEditor
                          //descripcion={this.handlDescripcionChange}
                          descripcionHTML={this.handlDescripcionHTMLChange}
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
                            process.env.REACT_APP_API_DIRECTORY_NOVEDADES_FOTOS
                          }/${this.state.novedad.foto_uno}`}
                          alt="Foto"
                          onClick={e => {
                            document.getElementById("upl-nov-uno").click();
                          }}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-nov-dos"
                          id="upl-nov-dos"
                          accept="image/*"
                          onChange={this.handleImgChange}
                        />
                        <img
                          id="img-upl-nov-dos"
                          className="img-fluid img-novedad"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_NOVEDADES_FOTOS
                          }/${this.state.novedad.foto_dos}`}
                          alt="Foto"
                          onClick={e => {
                            document.getElementById("upl-nov-dos").click();
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
                      <i className="fas fa-arrow-down" /> Agregar Novedad
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
              Lista de Novedades
            </h5>
            <div className="row">
              <div className="col">
                <span>Últimas 12 Novedades</span>
                <hr />
                {lista_novedades}
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

export default Novedades;
