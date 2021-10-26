import React,{ Component }  from 'react'
import { Consumer } from "../../context";
import Msg from "../utiles/Msg";

class GaleriaHome extends Component {
 constructor(props){
    super(props);
    this.state= {
        id: 0,
        registro: {
          id: 0,
          activo: false,
          idGHome: "",
          horizontal: false,
          vertical: false,
          image: "default.jpg",
        },
        galHome: [],
        msg: {
          visible: false,
          body: "",
          tipo: 0,
        },
        gallery: React.createRef(),
        galleryItems: [],
        itemWidth: 23,
        featured: React.createRef(),
        leftBtn: React.createRef(),
        rightBtn: React.createRef(),
        leftInterval: 0,
        rightInterval: 0,
        scrollRate: 0.2,
        left: 0,
        images: [ ]
   
    }
    this.selectItem = this.selectItem.bind(this);
    this.galleryWrapLeft = this.galleryWrapLeft.bind(this);
    this.galleryWrapRight = this.galleryWrapRight.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.stopMovement = this.stopMovement.bind(this);

    this.setData = this.setData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleGalChange = this.handleGalChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.askDelete = this.askDelete.bind(this);
    this.okDelete = this.okDelete.bind(this);
  }

    selectItem(e) {
        if (e.target.classList.contains('active')) return;
        
        this.state.featured.current.style.backgroundImage = e.target.style.backgroundImage;
        
        for (var i = 0; i < this.state.galleryItems.length; i++) {
            if (this.state.galleryItems[i].classList.contains('active'))
                this.state.galleryItems[i].classList.remove('active');
        }
        e.target.classList.add('active');

        this.state.images.forEach(element => {
            if(e.target.attributes.value.value == element.id){
                this.setState({
                    registro: element
                });
            }
        });

        
    }
    
    galleryWrapLeft() {
        var gal = this.state.gallery.current;
        var first = gal.children[0];
        gal.removeChild(first);
        gal.style.left = -this.state.itemWidth + '%';
        gal.appendChild(first);
        gal.style.left = '0%';
    }
    
    galleryWrapRight() {
        var gal = this.state.gallery.current;
        var last = gal.children[gal.children.length - 1];
        gal.removeChild(last);
        gal.insertBefore(last, gal.children[0]);
        gal.style.left = '-23%';
    }
    
    moveLeft() {
        var gal = this.state.gallery.current
        var x = this.state.left || 0;
        var y = setInterval(() => {
            gal.style.left = this.state.left + '%';
    
            if (this.state.left > -this.state.itemWidth) {
                this.state.left -= this.state.scrollRate;
            } else {
                this.state.left = 0;
                this.galleryWrapLeft();
            }
        }, 1);

        this.setState({
            left: x,
            leftInterval: y
        })
    }
    
    moveRight() {
        var gal = this.state.gallery.current
        //Make sure there is element to the leftd
        if (this.state.left > -this.state.itemWidth && this.state.left < 0) {
            var x = this.state.left  - this.state.itemWidth;      
            this.setState({
                left: x
            }, () => {
                var last = gal.children[gal.children.length - 1];
                gal.removeChild(last);
                gal.style.left= this.state.left + '%';
                gal.insertBefore(last, gal.children[0]);	
            
            })
        }
        
        var x = this.state.left || 0;
        var y = setInterval(() => {
            gal.style.left = this.state.left + '%';
    
            if (this.state.left < 0) {
                this.state.left += this.state.scrollRate;
            } else {
                this.state.left = -this.state.itemWidth;
                this.galleryWrapRight();
            }
        }, 1);

        this.setState({
            left: x,
            leftInterval: y
        })
        
    }
    
    stopMovement() {
        clearInterval(this.state.leftInterval);
        clearInterval(this.state.rightInterval);
    }
    
    componentDidMount() {
        this.setData();
    }

    handleImgChange(event) {
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
        const data = this.state.registro     
        const formData = new FormData();
        Object.keys(data).forEach((key) =>
          formData.append(key, data[key])
        );
        //Imágenes
        var img_uno = document.getElementById(`file-1-${data.id}`).files[0];
        if (img_uno) {
         formData.append("img-uno", img_uno, img_uno.name);
        }
        formData.forEach(e => console.log(e))
        //Guardar los cambios
        let token = this.context.token;
        fetch(
          `${process.env.REACT_APP_API_HOST}/upimgcarrusel/${data.id}`,
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
        const value = target.type === "checkbox" ? (target.checked? 1 : 0) : target.value;
        const name = target.name;
        this.setState(name == "horizontal" ? {
          registro: {
            ...this.state.registro,
            vertical: false,
            [name]: value,
          },
        }: name == "vertical" ? {
          registro: {
          ...this.state.registro,
          horizontal: false,
          [name]: value
        }}:{registro: {
          ...this.state.registro,
          [name]: value
        }} );
      }
    
      handleGalChange(event) {
        this.setState({
          registro: {
            ...this.state.registro,
            idGHome: event.target.value,
          },
        });
      }
    
      setData() {
        fetch(`${process.env.REACT_APP_API_HOST}/galeriaHome`, {
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
                    galHome: result.data.registros,
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
                    images: result.data.registros,
                    registro: result.data.registros[0]
                }, () => {
                    this.state.leftBtn.current.addEventListener('mouseenter', this.moveLeft);
                    this.state.leftBtn.current.addEventListener('mouseleave', this.stopMovement);
                    this.state.rightBtn.current.addEventListener('mouseenter', this.moveRight);
                    this.state.rightBtn.current.addEventListener('mouseleave', this.stopMovement);

                    this.state.featured.current.style.backgroundImage = `url('${process.env.REACT_APP_API_HOST}/carrusel/${this.state.images[0].image}')`;
                    var x = this.state.gallery.current.getElementsByClassName("gallery-item")
                    var cant = this.state.images.length
                    for (var i = 0; i < cant; i++) {
                        x[i].style.backgroundImage = `url('${process.env.REACT_APP_API_HOST}/carrusel/${this.state.images[i].image}')`;
                        x[i].addEventListener('click', this.selectItem);
                    }

                    this.setState({
                        galleryItems: x
                    })

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
      }
    
      componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
          this.setData();
        }
      }

    render() {
        var x = 0;

        const gal = this.state.galHome.map((g) => {
            return (
                <option key={`loc-${g.id}`} value={g.id}>
                {g.nombre}
                </option>
            )
        })

        const fotos = this.state.images.map((foto) => {
            if(this.state.registro.id == foto.id){
              return (
                <div class="item-wrapper">
                    <figure class={`gallery-item image-holder r-3-2 active transition`} value={foto.id}></figure>
                </div>
            );
            }else{
              return (
                <div class="item-wrapper">
                    <figure class={`gallery-item image-holder r-3-2 transition`} value={foto.id}></figure>
                </div>
            );
            }
            
        });

        return (
            <div class="container">
                <div className="col">
                    <div class="feature">
                     <img  id={`img-1-${this.state.registro.id}`} class="featured-item image-holder r-3-2 transition" src={`${process.env.REACT_APP_API_HOST}/carrusel/${
                      this.state.registro.image
                    }`} ref={this.state.featured}  onClick={(e) => {
                      document
                        .getElementById(`file-1-${this.state.registro.id}`)
                        .click();
                    }} />
                     
                    </div>
                
                    <div class="gallery-wrapper">
                        <div class="gallery" ref={this.state.gallery}>
                            {fotos}
                        </div>
                    </div>
                
                    <div class="controls">
                        <button class="move-btn left" ref={this.state.leftBtn}>&larr;</button>
                        <button class="move-btn right"ref={this.state.rightBtn}>&rarr;</button>
                    </div>
                </div>
                <div className="col">
                    <form
                    method="post"
                    onSubmit={this.saveData}
                    id="frm-carrusel"
                    >              
                      <input
                        type="file"
                        className="d-none"
                        name={`file-1-${this.state.registro.id}`}
                        id={`file-1-${this.state.registro.id}`}
                        accept="image/*"
                        onChange={this.handleImgChange}
                      />
                        <div className="form-group">
                            <span aria-hidden="true">
                            Activo
                            {"           "}
                            </span>
                            {this.state.registro.activo == 1?
                                <input
                                type="checkbox"
                                name="activo"
                                id="activo"
                                checked
                                value={this.state.registro.activo}
                                onChange={this.handleInputChange}
                                />
                            :
                            <input
                                type="checkbox"
                                name="activo"
                                id="activo"
                                value={this.state.registro.activo}
                                onChange={this.handleInputChange}
                                />
                            }
                        </div>
                            
                        <div className="form-group">
                            <label htmlFor="idGHome">IdGaleria</label>
                            <select
                            name="idGHome"
                            id="idGHome"
                            className="form-control"
                            value={this.state.registro.idGHome}
                            onChange={this.handleGalChange}
                            >
                                {gal}
                            </select>
                        </div>
                        <div className="form-group">
                            <span aria-hidden="true">
                            Horizontal
                            {"           "}
                            (Para versión web)
                            {"           "}
                            </span>
                            {this.state.registro.horizontal == 1?
                                <input
                                type="checkbox"
                                name="horizontal"
                                id="horizontal"
                                checked
                                value={this.state.registro.horizontal}
                                onChange={this.handleInputChange}
                                />
                                :
                                <input
                                type="checkbox"
                                name="horizontal"
                                id="horizontal"
                                value={this.state.registro.horizontal}
                                onChange={this.handleInputChange}
                                />
                            }
                        </div>
                        <div className="form-group">
                            <span aria-hidden="true">
                            Vertical
                            {"           "}
                            (Para versión mobile)
                            {"           "}
                            </span>
                            {this.state.registro.vertical == 1?
                                <input
                                type="checkbox"
                                name="vertical"
                                id="vertical"
                                checked
                                value={this.state.registro.vertical}
                                onChange={this.handleInputChange}
                                />
                                :
                                <input
                                type="checkbox"
                                name="vertical"
                                id="vertical"
                                value={this.state.registro.vertical}
                                onChange={this.handleInputChange}
                            />
                            }
                        </div>
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
                    </form>
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
                </div>
            <style>{`
                .container {
                    margin: 0 auto;
                    max-width: 850px;
                    max-height: 100vh;
                    background-color: white;
                }
                
                
                /* Useful Classes */
                .xy-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                
                .transition {
                    transition: all 350ms ease-in-out;
                }
                
                .r-3-2 {
                    width: 100%;
                    padding-bottom: 66.667%;
                    background-color: #ddd;
                }
                
                .image-holder {
                    background-size: cover;
                    background-position: center center;
                    background-repeat: no-repeat;
                }
                
                /* Main Styles */
                .gallery-wrapper {
                    position: relative;
                    overflow: hidden;
                }
                
                .gallery {
                    position: relative;
                    white-space: nowrap;
                    font-size: 0;
                }
                
                .item-wrapper {
                    cursor: pointer;
                    width: 23%; /* arbitrary value */
                    display: inline-block;
                    background-color: white;
                }
                
                .gallery-item { opacity: 0.5; }
                .gallery-item.active { opacity: 1; }

                .move-btn {
                    display: inline-block;
                    width: 50%;
                    border: none;
                color: #ccc;
                    background-color: transparent;
                    padding: 0.2em 1.5em;
                }
                .move-btn:first-child {border-right: none;}
                .move-btn.left  { cursor: w-resize; }
                .move-btn.right { cursor: e-resize; }
                
                `}

            </style>
        </div>
           
        )
    }
}

GaleriaHome.contextType = Consumer;

export default GaleriaHome;



