import React, { Component } from "react";
import Msg from "../../utiles/Msg";

class AreasServicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      guiaArea: {
        idGuia:0,
        idArea:1
      },
      areasServ: [],
      guiasAreas: [],
      msg: {
        visible: false,
        body: ""
      }
    };
    this.getData = this.getData.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleAreaChange = this.handleAreaChange.bind(this);
    this.findGuide = this.findGuide.bind(this);
    this.eliminarAreaServ = this.eliminarAreaServ.bind(this);
  }
  
  eliminarAreaServ(id){
    fetch(`${process.env.REACT_APP_API_HOST}/guiasAreas/${id}`, {
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
                  body: "El area se elimino correctamente."
                }
              },
              () => {
                this.findGuide();
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


  handleAreaChange(event){
    this.setState({
      guiaArea: {
        ...this.state.guiaArea,
        idArea: event.target.value
      }
    });

  }

  handleFormSubmit(event) {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_API_HOST}/guiasareas`, {
      method: "POST",
      headers: {
        "Authorization": "asdssffsdff",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.guiaArea)
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: "El area se agrego correctamente"
                }
              },
              () => {
                this.findGuide();
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

  findGuide(){
    fetch(`${process.env.REACT_APP_API_HOST}/guiasturismo/areas/${this.state.guiaArea.idGuia}`, {
      method: "GET",
      headers: {
        "Authorization": ""
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState(
              {
                guiasAreas: result.data.registros
              }
            );
          } else {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: result.errMsg
                }
              }
            );
          }
        },
        error => {
          //???
          console.log(error);
        }
      );
  }

  getData() {
    this.setState({
      guiaArea: {
        ...this.state.guiaArea,
        idGuia: this.props.id
      }
      
    }, () => {
      this.findGuide();
      fetch(`${process.env.REACT_APP_API_HOST}/areasServicio`, {
        method: "GET",
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
                  areasServ: result.data.registros
                }
              );
            } else {
              this.setState(
                {
                  msg: {
                    visible: true,
                    body: result.errMsg
                  }
                }
              );
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
  });
  
    
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if(this.props.id !== prevProps.id) {
        this.setState({
          guiaArea: {
            ...this.state.guiaArea,
            idGuia: this.props.id
          }
        }, () => {
          this.findGuide();
        });
    }
}

  render() {
    const areas = this.state.areasServ.map(a => {
      return (
        <option key={`area-${a.id}`} value={a.id}>
          {a.nombre}
        </option>
      );
    });

    const areasServ = this.state.guiasAreas.map(a =>{
      return(
        <span style={{backgroundColor: "#B1B1B1", borderRadius:"20px", marginRight: "10px", padding: "5px 10px 6px 10px"}}>
          <span style={{marginRight: "10px"}} class="badge badge-light">  
            {a.nombre} 
          </span>
          <i className="fas fa-trash" onClick={e => this.eliminarAreaServ(a.id)} style={{color: "white", backgroundColor: "red", padding: "5px 5px 5px 5px", borderRadius:"5px", cursor: "pointer"}} />
           
        </span>
      );
    });

    return (
      <div className="Novedades">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <form
              method="post"
              onSubmit={this.handleFormSubmit}
              id="frm-novedades"
            >
              <div className="row mt-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <select
                      name="idArea"
                      id="idArea"
                      className="form-control"
                      value={this.state.guiasAreas.id}
                      onChange={this.handleAreaChange}
                    >
                      {areas}
                    </select>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-group">
                    {areasServ}
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-arrow-down" /> Agregar Area
                    </button>
                  </div>
                </div>
              </div>
            </form>
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
export default AreasServicio;

