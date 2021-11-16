import React, { Component } from "react";

class GaleriaLoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      idLocalidad: 0,
      foto: [],
    };
    this.findGalery = this.findGalery.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
  }

  handleImgChange = (event) => {
    const data = new FormData();
    data.append("imgup", event.target.files[0]);
    fetch(
      `${process.env.REACT_APP_API_HOST}/ciudad/${
        this.state.idLocalidad
      }/imagen`,
      {
        method: "POST",
        headers: {
          Authorization: "asdadtytuiop",
          //"Content-Type": "multipart/form-data"
        },
        body: data,
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            this.setState(
              {
                loading: true,
              },
              () => {
                this.findGalery();
              }
            );
          } else {
            alert(result.errMsg);
          }
        },
        (error) => {
          this.setState({
            loading: false,
          });
        }
      );
  };

  askDelete = (id, imagen, e) => {
    fetch(`${process.env.REACT_APP_API_HOST}/ciudad/imagen/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "asdssffsdff",
        //"Content-Type": "multipart/form-data"
      },
    }).then((res) => {
      if (res.ok && res.status === 200) {
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

  findGalery = () => {
    fetch(
      `${process.env.REACT_APP_API_HOST}/ciudad/${this.state.idLocalidad}/imagen`,
      {
        method: "GET",
        headers: {
          Authorization: "asdssffsdff",
          //"Content-Type": "multipart/form-data"
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.err) {
            if (result.data.registros[0].foto !== "") {
              this.setState({
                foto: result.data.registros,
              });
            }

            this.setState({
              loading: false,
            });
          } else {
          }
        },
        (error) => {
        
          this.setState({
            loading: false,
          });
        }
      );
  };

  componentDidMount() {
    if (this.props.idLocalidad !== 0) {
      this.setState(
        {
          idLocalidad: this.props.idLocalidad,
        },
        () => {
          this.findGalery();
        }
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.idLocalidad !== prevProps.idLocalidad) {
      this.setState(
        {
          idLocalidad: this.props.idLocalidad,
        },
        () => {
          this.findGalery();
        }
      );
    }
  }

  render() {
    const loading = this.state.loading;
    const galeria = this.state.foto.map((g) => {
      return (
        <div className="col-sm-6 col-md-4" key={`g-${g.id}`}>
          <div className="card bg-dark text-white mb-2">
            <img
              className="card-img"
              src={`${process.env.REACT_APP_API_HOST}/recursos/ciudadesFotos/${
                g.foto
              }`}
              alt="Img"
            />
            <div className="card-img-overlay">
              <div
                className="btn close bg-dark p-2 rounded"
                aria-label="Close"
                onClick={(e) => this.askDelete(g.id, g.foto, e)}
              >
                <span aria-hidden="true">&times;</span>
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="Galeria">
        {loading ? (
          <h4>Cargando...</h4>
        ) : (
          <div className="mb-4">
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <div className="d-flex justify-content-end mb-3">
                  <input
                    id={`uploadImage-${this.state.idLocalidad}`}
                    name={`uploadImage-${this.state.idLocalidad}`}
                    type="file"
                    className="d-none"
                    accept="image/*"
                    onChange={this.handleImgChange}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      document
                        .getElementById("uploadImage-" + this.state.idLocalidad)
                        .click();
                    }}
                  >
                    <i className="fas fa-camera" />
                  </button>
                </div>
              </div>
            </div>
            <div className="row">{galeria}</div>
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <div className="alert alert-warning mt-4" role="alert">
                  Advertencia!: Los cambios realizados a la galería de imágenes
                  se guardan automáticamente!.
                </div>
              </div>
            </div>
          </div>
        )}
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

export default GaleriaLoc;
