/* eslint-disable no-redeclare */
/* eslint-disable no-console */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
<template>
  <div
    id="ap-progress"
    class="wrapper-ap-progress"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { PROGRESS, CLOUD } from "./../../common/constants";
import * as d3 from "d3";
import { SET_PI_ACTION, GET_REWORK_STATE} from './../../store/types/actions';
import { HOME_PI } from './../../store/types/getters';

export default {
  name: 'D3',
  // eslint-disable-next-line vue/require-prop-types
  props: ['openProgressDialog', 'setStepHome'],
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
            'Send V4 info to Cloud',
            'Download Plume CAs',
            'Open SSH Server',
            'Send FW to V4',
            'Send Plume CAs',
            'Install Plume CAs',
            'Install FW',
            'Send Log to Cloud'
      ],
      arrProgress: [],
      progressBar: null,
      progressBackground: null,
      progressError: null,
      progressFirstBackGround: null,
      FirstHighLight: null,
      progress: null,
      arrHighProgress: [],
      currentState: "success",
      timer: null,
      arrIcon: [],
      stepWidth: 0,
      isBegin: false,
    };
  },
  computed: {
    ...mapGetters('pi', {HOME_PI}),
    colors() {
        return { green: '#4DC87F', lightGreen: '#D9F0E3', white: '#FFFFFF', black: '#000000', red: '#E74C3C' };
    }
  },
  watch: {
      activeNum(newValue, oldValue) {
          this.prevNum = oldValue;
          if (this.$props && this.$props.setStepHome) {
            this.$props.setStepHome(newValue);
          }
      }
  },
  created() {
        this.allSteps = [...this.steps, ...this.stepErrors];
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setInterval(() => {
            if (this.isBegin) {
                this.GET_REWORK_STATE().finally(() => {
                    this.initData(() => {
                        this.updateProgressBar(this.activeNum, true)
                    });
                })
            }
        }, 2000);
  },
  mounted() {
    this.GET_REWORK_STATE().finally(() => {
        this.initData();
        this.initStep();
    })
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    ...mapActions('pi', {
        GET_REWORK_STATE,
        SET_PI_ACTION
    }),
    initData(callback) {
        if (this.HOME_PI && this.HOME_PI.pi_v4_state !== undefined) {
            this.handleData(this.HOME_PI.pi_v4_state, this.HOME_PI.pre_pi_v4_state);
        }
        if (callback) {
            callback();
        }
    },
    handlePrev(data) {
        switch (true) {
            case (
                data.indexOf(PROGRESS.REWORK__SCANNING) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_SCANNING) !== -1
            ):
                return 0;
            case (
                data.indexOf(PROGRESS.REWORK__SUCCESS_SCANNING) !== -1 ||
                data.indexOf(PROGRESS.REWOWK__FAIL_SENDING_V4_INFO_TO_CLOUD) !== -1 ||
                data.indexOf(PROGRESS.REWORK__SENDING_V4_INFO_TO_CLOUD) !== -1
                ):
                return 1;
            case (
                data.indexOf(PROGRESS.REWORK__DONWLOADING_PLUME_CAS_FROM_CLOUD) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_DONWLOADING_PLUME_CAS_FROM_CLOUD) !== -1 ||
                data.indexOf(PROGRESS.REWOWK__SUCCESS_SENDING_V4_INFO_TO_CLOUD) !== -1
                ):
                return 2;
            case (
                data.indexOf(PROGRESS.REWORK__OPENNING_SSH_SERVER_ON_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_OPENNING_SSH_SERVER_ON_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__SUCCESS_DONWLOADING_PLUME_CAS_FROM_CLOUD) !== -1
                ):
                return 3;
            case (
                data.indexOf(PROGRESS.REWORK__SENDING_FW_TO_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_SENDING_FW_TO_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__SUCCESS_OPENNING_SSH_SERVER_ON_V4) !== -1
                ):
                return 4;
            case (
                data.indexOf(PROGRESS.REWORK__SENDING_PLUME_CAS_TO_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_SENDING_PLUME_CAS_TO_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__SUCCESS_SENDING_FW_TO_V4) !== -1
                ):
                return 5;
            case (
                data.indexOf(PROGRESS.REWORK__INSTALLING_PLUME_CAS_ON_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_INSTALLING_PLUME_CAS_ON_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__SUCCESS_SENDING_PLUME_CAS_TO_V4) !== -1
                ):
                return 6;
            case (
                data.indexOf(PROGRESS.REWORK__INSTALLING_FW_FOR_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_INSTALLING_FW_FOR_V4) !== -1 ||
                data.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_PLUME_CAS_ON_V4) !== -1
                ):
                return 7;
            case (
                data.indexOf(PROGRESS.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD) !== -1 ||
                data.indexOf(PROGRESS.REWORK__FAIL_SENDING_UPGRADED_LOG_TO_CLOUD) !== -1 ||
                data.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1
                ):
                return 8;
            default:
                return 0;
        }
    },
    handleData(piV4State, piV4Prev) {
        const num = this.handlePrev(piV4Prev);
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
                this.activeNum = 7;
                this.currentState = "success";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD) !== -1:
                if (piV4Prev.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1) {
                    this.activeNum = 8;
                } else {
                    this.activeNum = num + this.steps.length -1;
                }
                this.currentState = "pending";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__FAIL_SENDING_UPGRADED_LOG_TO_CLOUD) !== -1:
                if (
                    piV4Prev.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1 ||
                    piV4Prev.indexOf(PROGRESS.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD) !== -1
                    ) {
                    this.activeNum = 8;
                } else {
                    this.activeNum = num + this.steps.length -1;
                }
                this.currentState = "failed";
                break;
            case piV4State.indexOf(PROGRESS.REWORK__SUCCESS_SENDING_UPGRADED_LOG_TO_CLOUD) !== -1:
                if (
                    piV4Prev.indexOf(PROGRESS.REWORK__SUCCESS_INSTALLING_FW_FOR_V4) !== -1 ||
                    piV4Prev.indexOf(PROGRESS.REWORK__SENDING_UPGRADED_LOG_TO_CLOUD) !== -1
                ) {
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
        if (step_ !== 0) {
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
        } else {
            this.progress
                .attr('fill', this.colors.green)
                .attr('width', () => {
                    return 0;
                });
        }

        if (positionI >= steps.length || (this.currentState == 'failed' && step_ !== 8)) {
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
            if (step_ == 0) {
                this.progressError.attr('fill', this.colors.green)
                this.progressFirstBackGround.attr('fill', this.colors.green)
            }
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
                    if (this.currentState == 'failed' && (i == step_ || i == step_ + steps.length - 1) && step_ !== 8) {
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
                    if (i > step_) {
                        d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>');
                    }
                    d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen);
                }
                if (step_ == 0 && i > 0 && i < steps.length) {
                    d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>')
                    d3.select('#vertical_' + i).attr('height', 0);
                }
            }
            if (step_ == 0 || (this.currentState == 'pending' && step_ < steps.length)) {
                this.progressError.transition()
                .delay(200)
                .attr('fill', this.colors.lightGreen)
                .attr('width', () => {
                    return 0;
                });
                this.progressFirstBackGround.transition()
                .delay(300)
                .attr('fill', this.colors.lightGreen)
                .attr('height', () => {
                    return 0;
                });
                this.arrHighProgress.map(el => el.attr('height', 0))
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
                for(let i = 1; i < this.allSteps.length; i++) {
                    if (i < step_ && step_ < steps.length) {
                        d3.select('#foreign_' + i).html('<i class="el-icon-check"></i>');
                    }
                    if (step_ < steps.length && i >= steps.length) {
                        d3.select('#label_' + i).attr('fill', this.colors.black).style("display", "none");
                        d3.select('#vertical_' + i).attr('height', 0);
                        d3.select('#step_' + i).attr('fill', this.colors.lightGreen).attr('stroke', this.colors.lightGreen).style("display", "none");
                        d3.select('#foreign_' + i).html('<i class="el-icon-arrow-right"></i>').style("display", "none");
                    }
                }
                if (step_ < steps.length) {
                    this.progressError
                    .attr('width', () => {
                        return 0;
                    });
                    this.progressFirstBackGround
                    .attr('height', () => {
                        return 0;
                    });
                    this.arrHighProgress.map(el => el.attr('height', 0))
                }
            }
        } else if (this.currentState == 'failed') {
            d3.select('#foreign_' + step_).html('<i class="el-icon-close" style="color: #fff"></i>')
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
    initStep() {
        var width = 960, offset = 48;
        // var wD3 = document.getElementById('ap-progress').offsetWidth;
        width += offset * 2;
        var dimensions = '' + 0 + ' ' + 0 + ' ' + width + ' ' + 240;

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
                if (this.HOME_PI && this.HOME_PI.cloud && this.HOME_PI.cloud.cloud_connected !== 'True') {
                    if (this.$props && this.$props.openProgressDialog) {
                        this.$props.openProgressDialog();
                    }
                    return;
                }
                if (this.HOME_PI && this.HOME_PI.cloud && this.HOME_PI.cloud.curr_state.indexOf(CLOUD.REWORK__SUCCESS_DOWNLOAD_FW_FROM_CLOUD.VALUE) === -1) {
                    if (this.$props && this.$props.openProgressDialog) {
                        this.$props.openProgressDialog();
                    }
                    return;
                }
                if (this.currentState == 'pending') {
                    return;
                }
                if (this.currentState == 'success' && index == this.activeNum && index != 0) {
                    return;
                }
                if (index !== this.activeNum && (
                    (index < this.activeNum && index != 0) ||
                    (index - this.activeNum > 1 && index < steps.length) ||
                    (this.currentState == 'failed' && index > this.activeNum && index < steps.length))
                ) {
                    return;
                }
                this.activeNum = index;
                this.currentState = 'pending';
                this.updateProgressBar(this.activeNum);
                this.SET_PI_ACTION({ action_name: this.prepareData(index), num: index})
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

        this.updateProgressBar(this.activeNum , true);
        this.isBegin = true;
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
}
</style>
