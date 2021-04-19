import React, { Component } from "react";
import Graficos from "./comestadisticas/Graficos";
import Msg from "../utiles/Msg";
import FormReport from "../paginas/comestadisticas/FormReport";
import FormGrafico from "./comestadisticas/FormGrafico";
import FormValores from "./comestadisticas/FormValores";

class Estadisticas extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          renderComponente: true,
          vis: false,
          graficos: [],
          data: [],
          reporte: {
            nombre: "",
            fechaDesde: "",
            fechaHasta: ""
          },
          valor_grafico: {
            etiqueta: "",
            valor: 0,
            idGrafico: 0,
          },
          dataFinal: [],
          msg: {
            visible: false,
            body: "",
          },
        };
        this.getData = this.getData.bind(this);
      }

      async getData() {
        let data1 = [];
        
        fetch(`${process.env.REACT_APP_API_HOST}/graficos`, {
          method: "GET",
          headers: {
            Authorization: "",
          },
        })
        .then((res) => res.json())
        .then((result) => { 
                result.data.registros.forEach(element => {
                  if(element.valores.length != 0){
                    data1.push({
                      title: element.tipoNombre,
                      data: element.valores
                    });  
                  }else{
                    data1.push({
                      title: element.tipoNombre,
                      data: [{etiqueta: "", valor: "0"}]
                    });
                  }
              });

              this.setState({
                data: result.data.registros,
                dataFinal: data1
              })
          },
            (error) => {
              //???
              console.log(error);
            }
          );
      }
    
      /* componentDidUpdate(prevState){
        if(this.state.renderComponente !== prevState.renderComponente ){
          this.getData(); 
        }
       }*/

      componentDidMount() {
        this.getData();
      }

  render() {
    var pos = -1;
    const graph = this.state.data.map((element) => {
      pos++;
      var año = element.fechaDesde.toString().substring(0, 4)
      var fechDesde = element.fechaDesde.toString().substring(8, 10);
      var fechHasta = element.fechaHasta.toString().substring(8, 10);

      if(element.tipoGrafico == "bar" || element.tipoGrafico == "bar-withouty"){
        return(
          <div className="sub-chart-wrapper">
            <div className="sub-chart-wrapper-titulo">{`${element.titulo} del ${fechDesde} al ${fechHasta} de ${año}`}</div>
            <div className="sub-chart-wrapper-subtitulo">{element.tipoNombre}</div>
            <Graficos
            tipo={element.tipoGrafico}
            data={this.state.dataFinal[pos].data}
            title={this.state.dataFinal[pos].title}
            color="#46BFBD"
          />
        </div>
        );
      }else{
        return(
          <div className="sub-chart-wrapper">
            <div className="sub-chart-wrapper-titulo">{`${element.titulo} del ${fechDesde} al ${fechHasta} de ${año}`}</div>
            <div className="sub-chart-wrapper-subtitulo">{element.tipoNombre}</div>
            <Graficos
            tipo={element.tipoGrafico}
            data={this.state.dataFinal[pos].data}
            title={this.state.dataFinal[pos].title}
            color={["#F7464A", "#46BFBD", "#FDB45C", '#3e517a', '#b08ea2', '#BBB6DF']}
          />
        </div>
        );
      }
    });
      return (
        <div className="Novedades">
          {this.state.loading ? (
            <div>Cargando</div>
          ) : (
            <React.Fragment>
              <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
                <i className="fas fa-chart-line" /> Estadisticas
              </h4>
              <FormReport actualizarComponente={()=> {
                this.setState({
                  renderComponente: !this.state.renderComponente
                }, () => {
                  this.getData()
                })
              }}></FormReport>
              <hr />
              <FormGrafico   actualizarComponente={()=> { this.setState({renderComponente: !this.state.renderComponente}, () => {this.getData()})
              }}></FormGrafico>
              <hr />
              <FormValores actualizarComponente={!this.state.renderComponente} actualizarGraph={this.getData}></FormValores>
              <div className="row">
              <div className="col-sm-12 col-md-12">
                <div className="alert alert-warning mt-4" role="alert">
                  Advertencia!: Los valores ingresados se guardan automáticamente!.
                </div>
              </div>    
              {graph}
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
          .sub-chart-wrapper {
            padding: 2%;
            display: inline-block;
            width: 50%;
            height: 300px;
            margin-bottom: 40px;
            text-align: center;
            .sub-chart-wrapper-titulo
            {     
              font-size: 1.3em;
              padding: 2px 15px;
              background-color: $color-dos;
              color: #fff;
              text-transform: uppercase;
            }
            .sub-chart-wrapper-subtitulo
            {
              font-size: 1.3em;
              padding: 2px 15px;
              margin-bottom: 15px;
              background-color: $color-dos;
              color: #fff;
              text-transform: uppercase;
            }
          }
          
          /* Simple responsivenss example */
          @media (max-width: 700px) {
            .sub-chart-wrapper {
              width: 96%;
            }
          }
          
        `}</style>
        </div>
      );
    }
}

export default Estadisticas;
