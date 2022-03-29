/* eslint-disable no-redeclare */
/* eslint-disable no-console */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
<template>
  <el-container style="margin-top: 10px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Progress Step</span>
        </div>
        <div class="wrapper-ap-progress"></div>
      </el-card>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as d3 from "d3";

export default {
  name: 'D3',
  data() {
    return {
      activeNum: "0"
    };
  },
  computed: {
    ...mapGetters('post' ,["posts"])
  },
  created() {},
  mounted() {
    if (!this.posts || this.posts.length  === 0) {
    //   this.getPosts().then(() => this.initData());
    }
    this.initStep();
  },
  methods: {
    ...mapActions('post', ['getPosts']),
    initData() {
    },
    initStep() {
        var colors = { green: '#4DC87F', lightGreen: '#D9F0E3', white: '#FFFFFF', black: '#000000' };
        var width = 960, height = 480, offset = 48;

        width += offset * 2;
        height += offset * 2;
        var dimensions = '' + 0 + ' ' + 0 + ' ' + width + ' ' + height;

        var svg = d3.select('.wrapper-ap-progress').append('svg')
            .attr('id', 'scene', true)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', dimensions)
            .classed('svg-content', true);

        var steps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var stepErrors = ['10', '11', '12', '13', '14', '15', '16', '17', '18'];

        var arrText = [
            'Scan',
            'Send to Cloud',
            'Download from Cloud',
            'Open SSH',
            'Send FW',
            'Send Plume Cas',
            'Install Plume Cas',
            'Install FW',
            'Send Log'
        ];
        var arrProgress = [];
        var arrHighProgress = [];
        var arrIcon = [];
        var stepWidth = Math.floor((width - offset * 2) / (steps.length - 1)),
        currentStep = '0';

        var progressBar = svg.append('g')
                    .attr('transform', 'translate(' + offset + ',' + offset + ')');

        // eslint-disable-next-line no-unused-vars
        var progressBackground = progressBar.append('rect')
            .attr('fill', colors.lightGreen)
            .attr('height', 8)
            .attr('width', width - offset * 2)
            .attr('rx', 4)
            .attr('ry', 4);

        var progressError = progressBar.append('rect')
            .attr('fill', colors.lightGreen)
            .attr('height', 8)
            .attr('width', 0)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", 0)
            .attr("y", 120);

        var progressFirstBackGround = progressBar.append('rect')
            .attr('fill', colors.lightGreen)
            .attr('height', 0)
            .attr('width', 8)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", -4)
            .attr("y", -1)

        for (var index = 0; index < stepErrors.length; index++) {
            arrProgress.push(progressBar.append('rect')
            .attr('fill', colors.lightGreen)
            .attr('height', 0)
            .attr('width', 8)
            .attr('id', "vertical_" + stepErrors[index])
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", (index + 1) * stepWidth - 4)
            .attr("y", -1));
        }

        var progress = progressBar.append('rect')
            .attr('fill', colors.green)
            .attr('height', 8)
            .attr('width', 0)
            .attr('rx', 4)
            .attr('ry', 4);

        for (let index = 0; index < stepErrors.length; index++) {
            arrHighProgress.push(progressBar.append('rect')
            .attr('fill', colors.green)
            .attr('height', 0)
            .attr('width', 8)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", index * stepWidth - 4)
            .attr("y", -1))
        }

        progress.transition()
            .duration(1000)
            .attr('width', function(){
                var index = [...steps, ...stepErrors].indexOf(currentStep);
                return (index + 1) * stepWidth;
            });

        progressBar.selectAll('circle')
        .data([...steps, ...stepErrors])
        .enter()
        .append('circle')
        .attr('id', function(d, i){ return 'step_' + i; })
        .attr('cx', function(d, i) {
            if (d >= steps.length) {
                return (i - steps.length + 1) * stepWidth; 
            }
            return i * stepWidth; 
        })
        .attr('cy', function(d) {
            if (d >= steps.length) {
                return 124; 
            }
            return 4; 
        })
        .attr('r', 10)
        .attr('fill', colors.white)
        .attr('stroke', colors.lightGreen)
        .attr('stroke-width', 6)
        .style("cursor", "pointer")
        .style("display", function(d) {
            if (d >= steps.length) {
                return "none"; 
            }
            return "block";
        });

        for (let index = 0; index < [...steps, ...stepErrors].length; index++) {
            let html = '<i class="el-icon-arrow-right"></i>'
            if (index == 0) {
                html = '<i class="el-icon-check"></i>';
            }
            arrIcon.push( progressBar.append('svg:foreignObject')
            .attr('id', 'foreign_' + index)
            .attr('height', '20px')
            .attr('x', function() {
                if (index >= steps.length) {
                    return (index - steps.length + 1) * stepWidth - 8; 
                }
                return index * stepWidth - 8
            })
            .attr('y', function() {
                if (index >= steps.length) {
                    return 112; 
                }
                return -7
            })
            .attr('width', '20px')
            .style("cursor", "pointer")
            .style("display", function() {
                if (index >= steps.length) {
                    return "none"; 
                }
                return "block";
            })
            .html(html)
            .on('click', function() {
                updateProgressBar((index).toString());
            }))
        }

        progressBar.selectAll('text')
        .data([...steps, ...stepErrors])
        .enter()
        .append('text')
        .attr('id', function(d, i){ return 'label_' + i; })
        .attr('dx', function(d, i) {
            if (d >= steps.length) {
                return (i - steps.length + 1) * stepWidth; 
            }
            return i * stepWidth; 
        })
        .attr('dy', function(d) {
            if (d >= steps.length) {
                return 130; 
            }
            return -25; 
        })
        .attr('text-anchor', 'middle')
        .text(function(_, i) {
            return arrText[i] || arrText[arrText.length - 1];
        })
        .style("display", function(d) {
            if (d >= steps.length) {
                return "none"; 
            }
            return "block";
        })
        .style("font-size", '9px')

        updateProgressBar(this.activeNum);

        function updateProgressBar(step_){
            var positionI = [...steps, ...stepErrors].indexOf(step_);
            var positionE = stepErrors.indexOf(step_);
            progress.transition()
                .duration(1000)
                .attr('fill', colors.green)
                .attr('width', function(){
                    var index = [...steps, ...stepErrors].indexOf(step_);
                    if (index < steps.length) {
                        return (index) * stepWidth;
                    }
                    return (index - steps.length + 1) * stepWidth;
                });
            if (positionI >= steps.length) {
                progressFirstBackGround
                .attr('height', function(){
                    return 128;
                });
                progressError
                .attr('width', function(){
                    var index = [...steps, ...stepErrors].indexOf(step_);
                    return (index - steps.length + 1) * stepWidth;
                });
                arrProgress[positionE]
                .attr('height', function(){
                    return 128;
                });
                d3.select('#step_' + positionI).attr('fill', colors.green).attr('stroke', colors.green).style("display", "block");
                arrHighProgress[positionE + 1].transition()
                .delay(500)
                .duration(1000)
                .attr('fill', colors.green)
                .attr('height', 128);
            }
            for(var i = 0; i < [...steps, ...stepErrors].length; i++){
                if(i <= positionI && positionI < steps.length) {
                    d3.select('#step_' + i).attr('fill', colors.green).attr('stroke', colors.green);
                    d3.select('#foreign_' + i).html('<i class="el-icon-check"></i>');
                } else if (i <= positionI - steps.length + 1 || i == positionI) {
                    d3.select('#step_' + i).attr('fill', colors.green).attr('stroke', colors.green);
                } else {
                    d3.select('#step_' + i).attr('fill', colors.lightGreen).attr('stroke', colors.lightGreen);
                    d3.select('#label_' + i).attr('fill', colors.black);
                }
            }
        }
    }
  }
};
</script>
<style>
.text {
  font-size: 14px;
}

.el-button {
    min-width: 134px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}
</style>