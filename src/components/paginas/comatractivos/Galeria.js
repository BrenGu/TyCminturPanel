import React, { Component } from "react";

class Galeria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            idAtractivo: 0,
            galeria: []
        };
        this.findGalery = this.findGalery.bind(this);
        this.askDelete = this.askDelete.bind(this);
        this.handleImgChange = this.handleImgChange.bind(this);
    }

    handleImgChange = (event) => {
        const data = new FormData();
        data.append("imgup", event.target.files[0]);
        fetch(`${process.env.REACT_APP_API_HOST}/atractivo/${this.state.idAtractivo}/imagen`, {
            method: "POST",
            headers: {
                "Authorization": "asdadtytuiop",
                //"Content-Type": "multipart/form-data"
            },
            body: data
        })
        .then(res => {
            if(res.ok && res.status === 201) {
                this.setState({
                    loading: true
                }, () => {
                    this.findGalery();
                });
            }
        });
    }

    askDelete = (id, imagen, e) => {
        fetch(`${process.env.REACT_APP_API_HOST}/atractivo/imagen/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "multipart/form-data"
            }
        })
        .then(res => {
            if(res.ok && res.status === 200) {
                this.findGalery();
            }
        });
    }
    
    findGalery = () => {
        fetch(`${process.env.REACT_APP_API_HOST}/atractivo/${this.state.idAtractivo}/imagenes`, {
            method: "GET",
            headers: {
                "Authorization": "asdssffsdff",
                //"Content-Type": "multipart/form-data"
            }
        })
        .then(res => {
            if(res.ok && res.status === 200) {
                res.json().then((data) => {
                    this.setState({
                        galeria: data.data.registros,
                        loading: false
                    });
                });
            }
        });
    }
    

    componentDidMount() {
        if(this.props.idAtractivo !== 0) {
            this.setState({
                idAtractivo: this.props.idAtractivo
            }, () => {
                this.findGalery();
            });
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.idAtractivo !== prevProps.idAtractivo) {
            this.setState({
                idAtractivo: this.props.idAtractivo
            }, () => {
                this.findGalery();
            });
        }
    }

    render() {
        const loading = this.state.loading;
        const galeria = this.state.galeria.map((g) => {
            return(
                <div className="col-sm-6 col-md-4" key={`g-${g.id}`}>
                    <div className="card bg-dark text-white mb-2">
                        <img className="card-img" src={`${process.env.REACT_APP_API_HOST}/atractivos/${g.imagen}`} alt="Img" />
                        <div className="card-img-overlay">
                            <div className="btn close bg-dark p-2 rounded" aria-label="Close" onClick={(e) => this.askDelete(g.id, g.imagen, e)}>
                                <span aria-hidden="true">&times;</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        return(
            <div className="Galeria">
                {
                    loading ?
                    <h4>Cargando...</h4>
                    :
                    <div className="mb-4">
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <div className="d-flex justify-content-end mb-3">
                                    <input id={`uploadImage-${this.state.idAtractivo}`} name={`uploadImage-${this.state.idAtractivo}`} type="file" className="d-none" accept="image/*" onChange={this.handleImgChange} />
                                    <button className="btn btn-primary" onClick={(e) => {document.getElementById("uploadImage-" + this.state.idAtractivo).click()}}><i className="fas fa-camera"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {galeria}
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-12">
                                <div className="alert alert-warning mt-4" role="alert">
                                    Advertencia!: Los cambios realizados a la galería de imágenes se guardan automáticamente!.
                                </div>
                            </div>
                        </div>
                    </div>
                }
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

export default Galeria;