/* eslint-disable no-redeclare */
/* eslint-disable no-console */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
<template>
  <div class="wrapper-ap-progress" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { PROGRESS, CLOUD } from "./../../common/constants";
import * as d3 from "d3";

export default {
  name: 'D3',
  data() {
    return {
      activeNum: 0,
      prevNum: 0,
      svg: null,
      steps: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      stepErrors: [9, 10, 11, 12, 13, 14, 15, 16],
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
      timer: null,
      arrIcon: [],
      stepWidth: 0,
    };
  },
  computed: {
    ...mapGetters('pi' ,['pi', 'nextAction']),
    colors() {
        return { green: '#4DC87F', lightGreen: '#D9F0E3', white: '#FFFFFF', black: '#000000', red: '#E74C3C' };
    }
  },
  watch: {
      currentState() {
          if (this.currentState == 'pending') {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setInterval(() => {
                    this.getReworkStates().finally(() => {
                        this.initData(() => {
                            this.updateProgressBar(this.activeNum)
                        });
                    })
                }, 5000);
          } else {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
          }
      }
  },
  created() {
      this.allSteps = [...this.steps, ...this.stepErrors];
  },
  mounted() {
    let num = localStorage.getItem("stepNum")
    num = num ? parseInt(num, 10) : null;
    if (num) {
        this.activeNum = num;
    }
    this.getReworkStates().finally(() => {
        this.initData();
        this.initStep();
    })
  },
  methods: {
    ...mapActions('pi', ['getReworkStates', 'doAction']),
    initData(callback) {
        if (this.pi && this.pi.pi_v4_state !== undefined) {
            this.handleData(this.pi.pi_v4_state, this.pi.pi_v4_prev);
        }
        if (callback) {
            callback();
        }
    },
    handleData(piV4State, piV4Prev) {
        let num = localStorage.getItem("stepNum")
        num = num ? parseInt(num, 10) : null; 
        switch (true) {
            case piV4State.indexOf(PROGRESS.REWORK__SCANNING) !== -1:
                this.activeNum = 0;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_SCANNING) !== -1:
                this.activeNum = 0;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_SCANNING) !== -1:
                this.activeNum = 0;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SENDING_V4_INFO_TO_CLOUD) !== -1:
                this.activeNum = 1;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWOWK__FAIL_SENDING_V4_INFO_TO_CLOUD) !== -1:
                this.activeNum = 1;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWOWK__SUCCESS_SENDING_V4_INFO_TO_CLOUD) !== -1:
                localStorage.setItem("stepNum", 1);
                this.activeNum = 1;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__DONWLOADING_PLUME_CAS_FROM_CLOUD) !== -1:
                this.activeNum = 2;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_DONWLOADING_PLUME_CAS_FROM_CLOUD) !== -1:
                this.activeNum = 2;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_DONWLOADING_PLUME_CAS_FROM_CLOUD) !== -1:
                localStorage.setItem("stepNum", 2);
                this.activeNum = 2;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__OPENNING_SSH_SERVER_ON_V4) !== -1:
                this.activeNum = 3;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_OPENNING_SSH_SERVER_ON_V4) !== -1:
                this.activeNum = 3;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_OPENNING_SSH_SERVER_ON_V4) !== -1:
                localStorage.setItem("stepNum", 3);
                this.activeNum = 3;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SENDING_FW_TO_V4) !== -1:
                this.activeNum = 4;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_SENDING_FW_TO_V4) !== -1:
                this.activeNum = 4;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_SENDING_FW_TO_V4) !== -1:
                localStorage.setItem("stepNum", 4);
                this.activeNum = 4;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SENDING_PLUME_CAS_TO_V4) !== -1:
                this.activeNum = 5;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_SENDING_PLUME_CAS_TO_V4) !== -1:
                this.activeNum = 5;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_SENDING_PLUME_CAS_TO_V4) !== -1:
                localStorage.setItem("stepNum", 5);
                this.activeNum = 5;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__INSTALLING_PLUME_CAS_ON_V4) !== -1:
                this.activeNum = 6;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_INSTALLING_PLUME_CAS_ON_V4) !== -1:
                this.activeNum = 6;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_PLUME_CAS_ON_V4) !== -1:
                localStorage.setItem("stepNum", 6);
                this.activeNum = 6;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__INSTALLING_FW_FOR_V4) !== -1:
                this.activeNum = 7;
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_INSTALLING_FW_FOR_V4) !== -1:
                this.activeNum = 7;
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1:
                localStorage.setItem("stepNum", 7);
                this.activeNum = 7;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD) !== -1:
                if (num >= 7 || piV4Prev.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1) {
                    this.activeNum = 8;
                } else {
                    this.activeNum = num + this.steps.length -1;
                }
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_SENDING_UPGRADED_LOG_TO_CLOUD) !== -1:
                if (num >= 7 || piV4Prev.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1) {
                    this.activeNum = 8;
                } else {
                    this.activeNum = num + this.steps.length -1;
                }
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_SENDING_UPGRADED_LOG_TO_CLOUD) !== -1:
                if (num >= 7 || piV4Prev.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1) {
                    this.activeNum = 8;
                } else {
                    this.activeNum = num + this.steps.length -1;
                }
                this.currentState = "success";
                break;
            default:
                this.activeNum = 0;
                this.currentState = "pending";
                break;
        }
    },
    prepareData(actionNumber) {
        let result = ""
        switch (actionNumber) {
            case 0:
                result = PROGRESS.REWORK__SCANNING;
                break;
            case 1:
                result = PROGRESS.REWORK__SENDING_V4_INFO_TO_CLOUD;
                break;
            case 2:
                result = PROGRESS.REWORK__DONWLOADING_PLUME_CAS_FROM_CLOUD;
                break;
            case 3:
                result = PROGRESS.REWORK__OPENNING_SSH_SERVER_ON_V4;
                break;
            case 4:
                result = PROGRESS.REWORK__SENDING_FW_TO_V4;
                break;
            case 5:
                result = PROGRESS.REWORK__SENDING_PLUME_CAS_TO_V4;
                break;
            case 6:
                result = PROGRESS.REWORK__INSTALLING_PLUME_CAS_ON_V4;
                break;
            case 7:
                result = PROGRESS.REWORK__INSTALLING_FW_FOR_V4;
                break;
            case 8:
                result = PROGRESS.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD;
                break;
            default:
                result = PROGRESS.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD;
                break;
        }
        return result
    },
    updateProgressBar(step_, isFirst) {
        var steps = this.steps;
        var stepWidth = this.stepWidth;
        const isBigNumber = step_ >= steps.length;
        var positionI = this.allSteps.indexOf(step_);
        var positionE = this.stepErrors.indexOf(step_);
        var positionB = this.stepErrors.indexOf(step_ + steps.length - 1);
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
        if (positionI >= steps.length || this.currentState == 'failed') {
            if (step_ > 0) {
                this.progressFirstBackGround
                .attr('height', () => {
                    return 128;
                });
            }
            this.progressError
            .attr('width', () => {
                var index = this.allSteps.indexOf(step_);
                if (index < steps.length) {
                    return (index) * stepWidth;
                }
                return (index - steps.length + 1) * stepWidth;
            });
            if (step_ != 0) {
                this.arrProgress[isBigNumber ? positionE : positionB]
                .attr('height', () => {
                    return 128;
                });
            }

            if (this.currentState == 'success' || this.currentState == 'pending') {
                d3.select('#step_' + positionI)
                    .attr('fill', this.colors.green)
                    .attr('stroke', this.colors.green)
                    .style("display", "block");
                this.arrHighProgress[positionE + 1].transition()
                    .delay(10)
                    .duration(1000)
                    .attr('fill', this.colors.green)
                    .attr('height', 128);
            }
        }
        if (isFirst) {
            for(let i = 0; i < this.allSteps.length; i++){
                if(i <= positionI && positionI < steps.length) {
                    d3.select('#step_' + i).attr('fill', this.colors.green).attr('stroke', this.colors.green);
                    if (i == 0 && i != positionI) { 
                        d3.select('#foreign_' + i).html('<i class="el-icon-refresh"></i>');
                    } else if (i == positionI && this.currentState == 'pending') {
                        d3.select('#foreign_' + i).html('<i class="el-icon-loading"></i>');
                    } else {
                        if (this.currentState == 'failed' && i == positionI) {
                            d3.select('#foreign_' + i).html('<i class="el-icon-refresh"></i>');
                            d3.select('#step_' + i).attr('fill', this.colors.red).attr('stroke', this.colors.red);
                        } else {
                            d3.select('#foreign_' + i).html('<i class="el-icon-check"></i>');
                        }
                    }
                } else if (i <= positionI - steps.length + 1 || i == positionI) {
                    d3.select('#step_' + i).attr('fill', this.colors.green).attr('stroke', this.colors.green);
                    if (i == 0) {
                        d3.select('#foreign_' + i).html('<i class="el-icon-refresh"></i>').style("display", "block");
                    } else if (i == positionI - steps.length + 1) {
                        d3.select('#step_' + i).attr('fill', this.colors.red).attr('stroke', this.colors.red).style("display", "block");
                        d3.select('#foreign_' + i).html('<i class="el-icon-close" style="color: #fff"></i>');
                    } else if (i == positionI) {
                        if (this.currentState == 'failed') {
                            d3.select('#foreign_' + i).html('<i class="el-icon-refresh"></i>').style("display", "block");
                            d3.select('#step_' + i)
                                .attr('fill', this.colors.red)
                                .attr('stroke', this.colors.red)
                                .style("display", "block");
                        } else if (this.currentState == 'pending') {
                            d3.select('#foreign_' + i).html('<i class="el-icon-loading"></i>').style("display", "block");
                        } else {
                            d3.select('#foreign_' + i).html('<i class="el-icon-check"></i>').style("display", "block");
                        }
                    } else {
                        d3.select('#foreign_' + i).html('<i class="el-icon-check"></i>').style("display", "block");
                    }
                    if (i == positionI) {
                        d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "block");
                    }
                } else {
                    if (this.currentState == 'failed' && (i == step_ || i == step_ + steps.length - 1)) {
                        d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>').style("display", "block");
                        d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "block");
                        d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen).style("display", "block");
                        // d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>');
                    } else if (i >= steps.length) {
                        d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "none");
                        d3.select('#vertical_' + i).attr('height', 0);
                        d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen).style("display", "none");
                        d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>').style("display", "none");
                    }
                    d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen);
                }
            }
            return;
        }
        d3.select('#step_' + step_).attr('fill', this.colors.green).attr('stroke', this.colors.green);
        if (this.currentState == 'pending') {
            d3.select('#foreign_' + step_).html('<i class="el-icon-loading"></i>');
            if (step_ == 0) {
                for(let i = 1; i < this.allSteps.length; i++) {
                    d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen);
                    if (i >= steps.length) {
                        d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "none");
                        d3.select('#vertical_' + i).attr('height', 0);
                        d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen).style("display", "none");
                        d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>').style("display", "none");
                    } else {
                        d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>');
                    }
                }
                this.progressError
                .attr('width', () => {
                    return 0;
                });
                this.progressFirstBackGround
                .attr('height', () => {
                    return 0;
                });
                this.arrHighProgress.map(el => el.attr('height', 0))
            } else {
                d3.select('#foreign_' + 0).html('<i class="el-icon-refresh"></i>');
            }
        } else if (this.currentState == 'failed') {
            d3.select('#foreign_' + step_).html('<i class="el-icon-close" style="color: #fff"></i>')
            // .on('click', () => {
            //     this.activeNum = step_;
            //     this.currentState = 'pending';
            //     this.updateProgressBar(step_);
            //     this.doAction({ action_name: this.prepareData(step_), num: step_})
            // })
            // .on("mouseenter", () => {
            //     d3.select(event.currentTarget).html('<i class="el-icon-refresh" style="color: #fff"></i>')
            // })
            // .on("mouseleave", () => {
            //     d3.select(event.currentTarget).html('<i class="el-icon-close" style="color: #fff"></i>')
            // })
            if (step_ !== 0 && step_ < steps.length) {
                d3.select('#label_' + (step_ + steps.length - 1)).attr('fill', this.colors.black).style("display", "block");
                d3.select('#foreign_' + (step_ + steps.length - 1)).html('<i class="el-icon-arrow-right"></i>').style("display", "block");
                d3.select('#step_' + (step_ + steps.length - 1)).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen).style("display", "block");
                d3.select('#vertical_' + (step_ + steps.length - 1)).attr('height', 128);
                this.arrHighProgress.map(el => el.attr('height', 0))
            }
            d3.select('#step_' + step_).attr('fill', this.colors.red).attr('stroke', this.colors.red).style("display", "block");
        } else if (this.currentState == 'success') {
            d3.select('#foreign_' + step_).html('<i class="el-icon-check"></i>');
            if (step_ < steps.length) {
                for(let i = steps.length; i < this.allSteps.length; i++){
                    d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "none");
                    d3.select('#vertical_' + i).attr('height', 0);
                    d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen).style("display", "none");
                    d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>').style("display", "none");
                }
                this.progressError
                .attr('width', () => {
                    return 0;
                });
                this.progressFirstBackGround
                .attr('height', () => {
                    return 0;
                });
            }
        }
    },
    handleTooltip(value) {
        switch (value) {
            case 0:
                return CLOUD.REWORK__SCANNING.TEXT;
            case 1:
                return CLOUD.REWORK__SENDING_V4_INFO_TO_CLOUD.TEXT;
            default:
                return CLOUD.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD.TEXT;
        }

    },
    initStep() {
        var width = 960, height = 240, offset = 48;

        width += offset * 2;
        height += offset * 2;
        var dimensions = '' + 0 + ' ' + 0 + ' ' + width + ' ' + height;

        this.svg = d3.select('.wrapper-ap-progress').append('svg')
            .attr('id', 'scene', true)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', dimensions)
            .classed('svg-content', true);

        // Define the div for the tooltip
        var div = d3.select(".wrapper-ap-progress").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);

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
            .attr('id', 'progressError')
            .attr('rx', 4)
            .attr('ry', 4)
            .attr("x", 0)
            .attr("y", 120);

        this.progressFirstBackGround = this.progressBar.append('rect')
            .attr('fill', this.colors.lightGreen)
            .attr('height', 0)
            .attr('width', 8)
            .attr('id', 'progressFirstBackGround')
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
            .attr('id', 'arrHighProgress_' + index)
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
        .attr('fill', this.colors.lightGreen)
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
                if (
                    (index !== this.activeNum && this.activeNum != index + steps.length - 1) && (
                    (index < this.activeNum && index != 0) ||
                    (index - this.activeNum > 1 && index < steps.length) ||
                    (this.currentState == 'failed' && index > this.activeNum && index < steps.length)) ||
                    this.currentState == 'pending'
                ) {
                    return;
                }
                if (index  >= steps.length) {
                    const value = this.activeNum < steps.length ? this.activeNum : this.activeNum - steps.length + 1;
                    localStorage.setItem("stepNum", value);
                } else if (index == 0) {
                    localStorage.setItem("stepNum", 0);
                }
                this.activeNum = index;
                this.currentState = 'pending';
                this.updateProgressBar(this.activeNum);
                this.doAction({ action_name: this.prepareData(index), num: index})
            })
            .on("mouseover", (d) => {
                console.log(index);
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9)
                    .style("left", (d.pageX - 100) + "px")
                div	.html("<span>" + this.handleTooltip(index) +"</span>")	
                    .style("top", (index >= steps.length ? "160px" : "15px"));
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            }));
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

        this.updateProgressBar(this.activeNum , true);
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

.wrapper-ap-progress {
    margin-top: 50px;
    position: relative;
}

div.tooltip {	
    position: absolute;			
    text-align: center;			
    width: 150px;					
    height: 30px;					
    padding: 2px;				
    font: 10px sans-serif;		
    background: lightsteelblue;	
    border: 0px;		
    border-radius: 3px;			
    pointer-events: none;			
}
</style>