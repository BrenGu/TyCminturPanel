import React, { Component } from "react";
import Chart from "chart.js"

class Graficos extends React.Component {
    constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
    }
  
    componentDidUpdate() {
      this.myChart.data.labels = this.props.data.map(d => d.etiqueta);
      this.myChart.data.datasets[0].data = this.props.data.map(d => d.valor);
      this.myChart.update();
    }
  
    componentDidMount() {

      this.myChart = new Chart(this.canvasRef.current, {
        type: this.props.tipo == "bar-withouty" ? "bar" : this.props.tipo,
        options: {
          maintainAspectRatio: false,
          animation: {
            easing: "easeInOutElastic", 
            duration: 1300,
          },
          scales: this.props.tipo == "bar" ? {
            yAxes: [
              {
                ticks: {
                  min: 0
                }
              }
            ],
          } : this.props.tipo == "bar-withouty"?{
            yAxes: [
              {
                display: false,
                ticks: {
                  min: 0
                }
              }
            ],
            xAxes: [{
              gridLines: {
                display: false,
              },
            }]
          }
          :
          ""
        },
        data: {
          labels: this.props.data.map(d => d.etiqueta),
            datasets: [{
              label: this.props.title,
              data: this.props.data.map(d => d.valor),
              backgroundColor: this.props.color,
            }]
        }
      });
    }
  
    render() {
      return (
          <canvas ref={this.canvasRef} />
      );
    }
  }

  export default Graficos;