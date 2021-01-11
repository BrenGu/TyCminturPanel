/*import React, { Component } from "react";
import Loading from "../utiles/loading";
import {
  Row,
  Col,
  Card,
  Button,
  CardImg,
  CardImgOverlay,
  Input,
} from "reactstrap";
import ModalMsg from "../utiles/ModalMsg";

/*class CarruselHome extends Component{
    constructor (props){
    super(props);
    this.state = {
        carrusel:[]
    }
    this.handleFClick = this.handleFClick.bind(this);
    this.addAtractivo = this.addAtractivo.bind(this);
    this.fireUpdate = this.fireUpdate.bind(this);

}

class CarruselHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      foto: {
        activo: "",
        idGaleria: "",
        horizontal: "",
        vertical: "",
        image: "",
      },
      galeria: [],
      modal: {
        idDelete: 0,
        msg: "",
        open: false,
        onlyOk: false,
      },
    };
    this.findGalery = this.findGalery.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.saveCarrusel = this.saveCarrusel.bind(this);
  }
  handleImgChange = (event) => {
    const data = new FormData();
    data.append("imgup", event.target.files[0]);
    fetch(`${process.env.REACT_APP_API_HOST}/addimgcarrusel/${5}/imagen`, {
      method: "POST",
      headers: {
        Authorization: "asdadtytuiop",
        //"Content-Type": "multipart/form-data"
      },
      body: data,
    }).then((res) => {
      if (res.ok && res.status === 201) {
        this.setState(
          {
            loading: true,
          },
          () => {
            this.findGalery();
          }
        );
      }
    });
  };

  handleCancel = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        open: false,
      },
    });
  };

  handleDelete = () => {
    this.setState({
      modal: {
        ...this.state.modal,
        open: false,
      },
    });
    //alert(`Eliminar: ${this.state.modal.idDelete}`);
    fetch(
      `${process.env.REACT_APP_API_HOST}/delimagen/${
        this.state.modal.idDelete
      }`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("WebTurToken"),
        },
      }
    ).then((res) => {
      if (res.ok && res.status === 200) {
        this.setState(
          {
            loading: true,
          },
          () => {
            this.findGalery();
          }
        );
      } else {
        res.json().then((data) => {
          alert(data.errMsg);
        });
      }
    });
  };

  askDelete = (id, imagen, e) => {
    this.setState({
      modal: {
        ...this.state.modal,
        idDelete: id,
        msg: `Seguro de eliminar la imagen? (${imagen})`,
        open: true,
      },
    });
  };

  findGalery = () => {
    fetch(`${process.env.REACT_APP_API_RECURSOS}/carruseles`).then((res) => {
      if (res.ok && res.status === 200) {
        res.json().then((data) => {
          this.setState({
            galeria: data.data.registros,
            loading: false,
          });
          console.log(this.state.galeria);
        });
      }
    });
  };
  saveCarrusel() {
    fetch(
      `${process.env.REACT_APP_API_RECURSOS}/upimgcarrusel/${
        this.state.galeria.id
      }`,
      {
        method: "PATCH",
        headers: {
          Authorization: "asdssffsdff",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.galeria),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          if (!result.err) {
            this.fireMsg("Los datos se guardaron correctamente.", 0, 0);
          } else {
            if (result.errMsgs.length) {
              this.fireMsg(result.errMsgs, 0, 0);
            } else {
              this.fireMsg(result.errMsg, 0, 0);
            }
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
      foto: {
        ...this.state.foto,
        [name]: value,
      },
    });
  }

  componentDidMount() {
    //Obtener la Galeria
    this.findGalery();
  }

  render() {
    const loading = this.state.loading;
    const galeria = this.state.galeria.map((foto) => {
     
      return (
        <Col xs="6" md="3" key={`foto-${foto.id}`}>
          <Card inverse className="mb-4">
            <CardImg
              width="100%"
              className="img-card"
              src={`${process.env.REACT_APP_API_HOST}/carrusel/${foto.image}`}
              alt="Img"
            />
            <CardImgOverlay>
              <Button
                className="close bg-dark p-2 rounded"
                aria-label="Close"
                onClick={(e) =>
                  this.askDelete(this.state.foto.id, this.state.foto.image, e)
                }
              >
                <span aria-hidden="true">&times;</span>
              </Button>
            </CardImgOverlay>
          </Card>

          <div>
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="idGaleria">{foto.id}</label>
                <input
                  type="text"
                  name="idGaleria"
                  id="idGaleria"
                  className="form-control"
                  value={this.state.foto.idGaleria}
                  onChange={this.handleInputChange}
                  maxLength="50"
                />
              </div>
            </div>
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
              autoComplete="off"
            />
          </div>
          <div>
            <span aria-hidden="true">Vertical {"           "}</span>
            <input
              type="checkbox"
              name="vertical"
              id="vertical"
              value={this.state.foto.vertical}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <span aria-hidden="true">Horizontal {"           "}</span>
            <input
              type="checkbox"
              name="horizontal"
              id="horizontal"
              value={this.state.foto.horizontal}
              onChange={this.handleInputChange}
            />
          </div>

          <center>
            <button
              className="btn btn-primary float-right"
              onClick={this.saveCarrusel}
            >
              Guardar
            </button>
            {/*<Button
              color="primary"
              onClick={(e) => {
                document.getElementById("uploadImage").click();
              }}
              style={{marginTop:"20px"}}
            >
              Cambiar{" "}
            </Button>}
          </center>
        </Col>
      );
    });
    return (
      <div className="Galeria">
        {loading ? (
          <Loading />
        ) : (
          <div className="mb-4">
            <Row>
              <Col xs="12" md="12">
                <div className="d-flex justify-content-start mb-3">
                  <Input
                    id="uploadImage"
                    name="uploadImage"
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <Button
                    color="primary"
                    onClick={(e) => {
                      document.getElementById("uploadImage").click();
                    }}
                  >
                    <i className="fas fa-camera" />
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>{galeria}</Row>
            <Row>
              <Col xs="12" md="12">
                <div className="alert alert-warning mt-4" role="alert">
                  Advertencia!: Los cambios realizados a la galería de imágenes
                  se guardan automáticamente!.
                </div>
              </Col>
            </Row>
          </div>
        )}
        <ModalMsg
          open={this.state.modal.open}
          titulo="Eliminar"
          msg={this.state.modal.msg}
          onlyOk={this.state.modal.onlyOk}
          handleAceptar={this.handleDelete}
          handleCancelar={this.handleCancel}
        />
        <style jsx="true">{`
          .card-img-ovelay {
            padding: 5px;
          }
          .card-img {
            height: 200px;
          }
          @media only screen and (max-width: 990px) {
            .card-img {
              height: 100px;
            }
          }
          @media only screen and (max-width: 778px) {
            .card-img {
              height: 200px;
            }
          }
          @media only screen and (max-width: 400px) {
            .card-img {
              height: 130px;
            }
          }
        `}</style>
      </div>
    );
  }
}
export default CarruselHome;
*/

import React, { Component } from "react";
import FormCarrusel from "./comcarrusel/FormCarrusel";
import Msg from "../utiles/Msg";
import MyEditor from "./subcomponentes/MyEditor";
class CarruselHome extends Component {
  constructor(props) {
    super(props);
    let date = new Date().toISOString().substr(0, 10);
    this.state = {
      loading: true,
      foto: {
        activo: "",
        idGaleria: "",
        horizontal: "",
        vertical: "",
        image: "default.jpg",
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
    console.log(this.state.foto.image);
    console.log(this.state.foto.idGaleria);
    event.preventDefault();

    const data = new FormData();
    data.append("activo", this.state.foto.activo);
    data.append("idGaleria", this.state.foto.idGaleria);
    data.append("horizontal", this.state.foto.horizontal);
    data.append("vertical", this.state.foto.vertical);

    //Imágenes
    var img_uno = document.getElementById("upl-nov-uno").files[0];
    console.log();
    if (img_uno) {
      data.append("img-uno", img_uno, img_uno.name);
    }
    //Verificar tamaño de las imágenes no mas de 4MB
    if (data.has("img-uno")) {
      if (data.get("img-uno").size > 500000) {
        this.setState({
          msg: {
            visible: true,
            body: "El tamaño de la primer imágen supera los 4MB.",
          },
        });
        return false;
      }
    }
    fetch(`${process.env.REACT_APP_API_HOST}/addimgcarrusel`, {
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
    let date = new Date().toISOString().substr(0, 10);
    this.setState({
      foto: {
        activo: "",
        idGaleria: "",
        horizontal: "",
        vertical: "",
        image: "default.jpg",
      },
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
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      foto: {
        ...this.state.foto,
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
              id="frm-novedades"
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
                        <label htmlFor="idGaleria">IdGaleria</label>
                        <input
                          type="text"
                          name="idGaleria"
                          id="idGaleria"
                          className="form-control"
                          value={this.state.foto.idGaleria}
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
                          maxLength="75"
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
