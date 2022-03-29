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
      activeNum: "0",
      svg: null,
      steps: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      stepErrors: ['10', '11', '12', '13', '14', '15', '16', '17', '18'],
      allSteps: [],
      arrText: [
            'Scan',
            'Send to Cloud',
            'Download from Cloud',
            'Open SSH',
            'Send FW',
            'Send Plume Cas',
            'Install Plume Cas',
            'Install FW',
            'Send Log'
      ],
      arrProgress: [],
      progressBar: null,
      progressBackground: null,
      progressError: null,
      progressFirstBackGround: null,
      progress: null,
      arrHighProgress: [],
      currentState: "success",
      arrIcon: [],
      stepWidth: 0,
    };
  },
  computed: {
    ...mapGetters('post' ,["posts"]),
    colors() {
        return { green: '#4DC87F', lightGreen: '#D9F0E3', white: '#FFFFFF', black: '#000000' };
    }
  },
  created() {
      this.allSteps = [...this.steps, ...this.stepErrors];
  },
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
    updateProgressBar(step_) {
        var positionI = this.allSteps.indexOf(step_);
        var positionE = this.stepErrors.indexOf(step_);
        var steps = this.steps;
        var stepWidth = this.stepWidth;
        this.progress.transition()
            .duration(1000)
            .attr('fill', this.colors.green)
            .attr('width', () => {
                var index = this.allSteps.indexOf(step_);
                if (index < steps.length) {
                    return (index) * stepWidth;
                }
                return (index - steps.length + 1) * stepWidth;
            });
        if (positionI >= steps.length) {
            this.progressFirstBackGround
            .attr('height', () => {
                return 128;
            });
            this.progressError
            .attr('width', () => {
                var index = this.allSteps.indexOf(step_);
                return (index - steps.length + 1) * stepWidth;
            });
            this.arrProgress[positionE]
            .attr('height', () => {
                return 128;
            });
            d3.select('#step_' + positionI)
            .attr('fill', this.colors.green)
            .attr('stroke', this.colors.green)
            .style("display", "block");
            this.arrHighProgress[positionE + 1].transition()
            .delay(500)
            .duration(1000)
            .attr('fill', this.colors.green)
            .attr('height', 128);
        }
        for(let i = 0; i < this.allSteps.length; i++){
            if(i <= positionI && positionI < steps.length) {
                d3.select('#step_' + i).attr('fill', this.colors.green).attr('stroke', this.colors.green);
                if (this.currentState == 'pending' && this.allSteps[i] == this.activeNum) {
                    d3.select('#foreign_' + i).html('<i class="el-icon-loading"></i>');
                } else if (i == 0) {
                    d3.select('#foreign_' + i).html('<i class="el-icon-refresh"></i>');
                } else {
                    if (this.currentState == 'failed') {
                        d3.select('#foreign_' + i).html('<i class="el-icon-close"></i>');
                    } else {
                        d3.select('#foreign_' + i).html('<i class="el-icon-check"></i>');
                    }
                }
            } else if (i <= positionI - steps.length + 1 || i == positionI) {
                d3.select('#step_' + i).attr('fill', this.colors.green).attr('stroke', this.colors.green);
                if (i == 0) {
                    d3.select('#foreign_' + i).html('<i class="el-icon-refresh"></i>').style("display", "block");
                } else {
                    d3.select('#foreign_' + i).html('<i class="el-icon-check"></i>').style("display", "block");
                }
                if (i == positionI) {
                    d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "block");
                }
            } else {
                if (i >= steps.length) {
                    d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "none");
                }
                d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen);
            }
        }
    },
    initStep() {
        var width = 960, height = 480, offset = 48;

        width += offset * 2;
        height += offset * 2;
        var dimensions = '' + 0 + ' ' + 0 + ' ' + width + ' ' + height;

        this.svg = d3.select('.wrapper-ap-progress').append('svg')
            .attr('id', 'scene', true)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', dimensions)
            .classed('svg-content', true);

        var steps = this.steps;
        var stepErrors = this.stepErrors;

        var arrText = this.arrText;
        this.stepWidth = Math.floor((width - offset * 2) / (steps.length - 1));
        var stepWidth = this.stepWidth;
        var currentStep = '0';

        this.progressBar = this.svg.append('g')
                    .attr('transform', 'translate(' + offset + ',' + offset + ')');

        // eslint-disable-next-line no-unused-vars
        this.progressBackground = this.progressBar.append('rect')
            .attr('fill', this.colors.lightGreen)
            .attr('height', 8)
            .attr('width', width - offset * 2)
            .attr('rx', 4)
            .attr('ry', 4);

        this.progressError = this.progressBar.append('rect')
            .attr('fill', this.colors.lightGreen)
            .attr('height', 8)
            .attr('width', 0)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", 0)
            .attr("y", 120);

        this.progressFirstBackGround = this.progressBar.append('rect')
            .attr('fill', this.colors.lightGreen)
            .attr('height', 0)
            .attr('width', 8)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", -4)
            .attr("y", -1)

        for (let index = 0; index < stepErrors.length; index++) {
            this.arrProgress.push(this.progressBar.append('rect')
            .attr('fill', this.colors.lightGreen)
            .attr('height', 0)
            .attr('width', 8)
            .attr('id', "vertical_" + stepErrors[index])
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", (index + 1) * stepWidth - 4)
            .attr("y", -1));
        }

        this.progress = this.progressBar.append('rect')
            .attr('fill', this.colors.green)
            .attr('height', 8)
            .attr('width', 0)
            .attr('rx', 4)
            .attr('ry', 4);

        for (let index = 0; index < stepErrors.length; index++) {
            this.arrHighProgress.push(this.progressBar.append('rect')
            .attr('fill', this.colors.green)
            .attr('height', 0)
            .attr('width', 8)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", index * stepWidth - 4)
            .attr("y", -1))
        }

        this.progress.transition()
            .duration(1000)
            .attr('width', () => {
                var index = this.allSteps.indexOf(currentStep);
                return (index + 1) * stepWidth;
            });

        this.progressBar.selectAll('circle')
        .data(this.allSteps)
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
        .attr('fill', this.colors.white)
        .attr('stroke', this.colors.lightGreen)
        .attr('stroke-width', 6)
        .style("cursor", "pointer")
        .style("display", function(d) {
            if (d >= steps.length) {
                return "none"; 
            }
            return "block";
        });

        for (let index = 0; index < this.allSteps.length; index++) {
            let html = '<i class="el-icon-arrow-right"></i>'
            if (index == 0) {
                html = '<i class="el-icon-refresh"></i>';
            }
            this.arrIcon.push(this.progressBar.append('svg:foreignObject')
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
                return -8
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
            .on('click', () => {
                this.activeNum = index.toString();
                this.currentState = 'pending';
                this.updateProgressBar(this.activeNum);
                setTimeout(() => {
                    this.currentState = 'failed';
                    this.updateProgressBar(this.activeNum);
                }, 3000)
            }))
        }

        this.progressBar.selectAll('text')
        .data(this.allSteps)
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
                return 150; 
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

        this.updateProgressBar(this.activeNum);
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