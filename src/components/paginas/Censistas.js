import React, {useEffect, useState} from 'react';
import FormCensistas from "./comcensistas/FormCensistas"
import Msg from "../utiles/Msg"

const Censistas = () => {
    const [loading, setLoading] = useState(true);
    const [cen, setCen] = useState({
        dni: "", 
        nombre: "",
        apellido: "",
        foto: "default.png",
        direccion: "",
        email: "",
        telefono: ""
    });
    const [data, setData] = useState([]);
    const [msg, setMsg] = useState({
        visible: false,
        body: ""
    });
    
    const eliminar = (id) => {
        setLoading(true)

        fetch(`${process.env.REACT_APP_API_HOST}/censista/del/${id}`, {
            method: "DELETE",
            headers: {
            Authorization: ""
            }
        })
            .then(res => res.json())
            .then(
            result => {
                if (!result.err) {
                    setMsg({
                        visible: true,
                        body: "El censista se elimino correctamente."
                    })
                    getData();
                } else {
                    setMsg({
                        visible: true,
                        body: result.errMsgs
                    })
                }
            },
            error => {
                //???
                console.log(error);
            }
        );
    }
    
    const handleFromNovSubmit = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("dni", cen.dni);
        data.append("nombre", cen.nombre);
        data.append("apellido", cen.apellido);
        data.append("direccion", cen.direccion);
        data.append("email", cen.email);
        data.append("telefono", cen.telefono);

        var img_uno = document.getElementById("upl-nov-uno").files[0];
        if (img_uno) {
         data.append("img-uno", img_uno, img_uno.name);
        }
        fetch(`${process.env.REACT_APP_API_HOST}/censista/new`, {
            method: "POST",
            headers: {
              "Authorization": ""
            },
            body: data,
        })
        .then(res => res.json())
        .then(
            result => {
                if (!result.err) {
                    setMsg({
                        visible: true,
                        body: "Los datos se agregaron correctamente"
                    })
                    resetForm();
                    getData();
                } else {
                    setMsg({
                        visible: true,
                        body: result.errMsgs
                    });
                }
            },
            error => {
                console.log(error);
            }  
        );
    }
    
    const resetForm = () => {
        setCen({
            dni: "", 
            nombre: "",
            apellido: "",
            foto: "default.png",
            direccion: "",
            email: "",
            telefono: ""
        })
        document.getElementById("frm-novedades").reset();
        document
        .getElementById("img-upl-nov-uno")
        .setAttribute(
            "src",
            `${process.env.REACT_APP_API_HOST}/${
            process.env.REACT_APP_API_DIRECTORY_CENSISTAS_FOTOS
            }/default.png`
        );
    }

    const handleImgChange = (event) => {
        let id = "img-" + event.target.id;
        var reader = new FileReader();
        reader.onload = function(e) {
          let imagen = document.getElementById(id);
          imagen.setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if(name == "dni"){
            setCen({...cen, dni: value})
        }else if(name == "nombre"){
            setCen({...cen, nombre: value})
        }else if (name == "apellido"){
            setCen({...cen, apellido: value})
        }else if (name == "direccion"){
            setCen({...cen, direccion: value})
        }else if (name == "email"){
            setCen({...cen, email: value})
        }else if (name == "telefono"){
            setCen({...cen, telefono: value})
        }
    }
    
    const getData = () => {
        fetch(`${process.env.REACT_APP_API_HOST}/censista/all`, {
            method: "GET",
            headers: {
            Authorization: ""
            }
        })
        .then(res => res.json())
        .then(
        result => {
            if (!result.err) {
                setData(result.data.registros)
            } else {
                setMsg({
                    visible: true,
                    body: result.errMsg
                })
            }
        },
        error => {
            console.log(error);
        }
        );
        setLoading(false)
    }

    useEffect(() => {
        getData();
    }, [])
    
    const lista_guias = data.map(novedad => {
        return (
        <FormCensistas
            key={`novedad-${novedad.id}`}
            idProp={novedad.id}
            eliminar={eliminar}
        />
        );
    });

    return (
        <div className="Novedades">
        {loading ? (
            <div>Cargando</div>
        ) : (
            <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
                <i className="fas fa-user" /> Nuevo Censista
            </h4>
            <form
                method="post"
                onSubmit={handleFromNovSubmit}
                id="frm-novedades"
            >
                <div className="grid-noveades">
                <div className="noveades-span-row-2">
                    <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label htmlFor="dni">DNI</label>
                            <input
                                type="text"
                                name="dni"
                                id="dni"
                                className="form-control"
                                value={cen.dni}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group">
                        <label htmlFor="apellido">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            id="apellido"
                            className="form-control"
                            value={cen.apellido}
                            onChange={handleInputChange}
                        />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group">
                        <label htmlFor="direccion">Direccion</label>
                        <input
                            type="text"
                            name="direccion"
                            id="direccion"
                            className="form-control"
                            value={cen.direccion}
                            onChange={handleInputChange}
                        />
                        </div>
                    </div>          
                    </div>
                </div>
                <div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            className="form-control"
                            value={cen.nombre}
                            onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-control"
                            value={cen.email}
                            onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="telefono">Telefono</label>
                            <input
                            type="number"
                            name="telefono"
                            id="telefono"
                            className="form-control"
                            value={cen.telefono}
                            onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                </div>
                <br></br>
                <div className="row">
                    <div className="col mb-2">
                    </div>
                    <div className="d-flex">
                      <div className="col-6">
                        <input
                          type="file"
                          className="d-none"
                          name="upl-nov-uno"
                          id="upl-nov-uno"
                          accept="image/*"
                          onChange={handleImgChange}
                        />
                        <img
                          id="img-upl-nov-uno"
                          className="img-fluid img-novedad"
                          src={`${process.env.REACT_APP_API_HOST}/${
                            process.env.REACT_APP_API_DIRECTORY_CENSISTAS_FOTOS
                          }/${cen.foto}`}
                          alt="Foto"
                          onClick={(e) => {
                            document.getElementById("upl-nov-uno").click();
                          }}
                        />
                      </div>
                    </div>
                  </div>
                <div className="row mt-3">
                    <div className="col">
                        <div className="d-flex justify-content-between">
                            <button
                            type="button"
                            className="btn btn-warning"
                            onClick={resetForm}
                            >
                              <i className="far fa-window-restore" />
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-arrow-down" /> Agregar Censista
                            </button>
                         </div>
                    </div>
                </div>
                
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
                Listado de Censistas
            </h5>
            <div className="row">
                <div className="col">
                <hr />
                {lista_guias}
                </div>
            </div>
            </React.Fragment>
        )}
        <Msg
            visible={msg.visible}
            okClose={() =>
                setMsg({ ...msg, visible: false })
            }
            tipo="0"
        >
            {msg.body}
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
      
export default Censistas;