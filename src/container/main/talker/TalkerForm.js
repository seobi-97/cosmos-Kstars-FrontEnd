import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import useStyles from '../styles/TalkerFormCss';
import Axios from 'axios';

/*
TalkerForm 컴포넌트
 사용자로부터 talker, text, analysisType 받아온다.
*/
/*
메소드 정리
shouldComponentUpdate: 부모로부터 받은 selectedBoard에 brdno가 있으면, 글 수정이므로 입력상자에 이전값을 넣어주고, 없으면, 글 삽입이므로 ''값을 넣어준다.
                        true값을 반환하므로써 렌더링한다.
handleSubmit: save버튼을 누르면, json형식으로 data에 저장해서 부모의 onSaveData에 data를 넘겨준다.
              만약, 부모로부터 받은 selectedBoard에 brdno가 있으면 data의 brdno를 기존 selectedBoard의 brdno로 저장해서 넘겨준다.
*/


class TalkerForm extends Component {
  
  state = {
    talker:'',
    text:'',
    analysisType:'',
    isWaveform: false,

    timerCount:1000*6,
  }
  
  componentDidMount(){
    localStorage.setItem("textStatus", "NOTENTERED");
    localStorage.setItem("textBefore", "");

    /*
      textStatus

      NOTENTERED 키보드미입력(1분) 
      REQUIREDAUTO 강제저장(10분) 
      COMPLETED 저장완료상태

    */
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.timerCount !== this.state.timerCount){
      clearInterval(this.interval);
      this.interval = setInterval(this.handleSave, this.state.timerCount);
    }
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  //자동 저장 
  handleSave = () => {
    const {text} = this.state;

    if(localStorage.textBefore === text){
      localStorage.setItem("textStatus", "NOTENTERED");
      this.setState({
        timerCount: 1000*60,
      });

    }
    else {
      localStorage.setItem("textBefore", text);
      localStorage.setItem("textStatus", "REQUIREDAUTO");
      this.setState({
        timerCount: 1000*60,
      });
    }

    console.log("textStatus "+ localStorage.textStatus+", timerCount "+ this.state.timerCount);

  }

  //수정해야할 분석창이 넘어왔을 때
  shouldComponentUpdate(nextProps, nextState) {
    let selectedBoard = nextProps.selectedBoard;
   
    
    //입력 후 초기화
    if (!selectedBoard.brdno) {
        this.state.talker = "";
        this.state.text  = "";  
        this.state.analysisType = "";

        return true;
    }
    
    //insert 글 삽입
    this.state.talker = selectedBoard.talker;
    this.state.text = selectedBoard.text;
    this.state.analysisType = selectedBoard.analysisType;

    console.log("선택된 내용 번호: ", selectedBoard.brdno);
         
    return true;
  }


  handleChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    });
  }

  handleSubmit = async (e) => {
      e.preventDefault();
      let selectedBoard = this.props.selectedBoard;
      const { talker, text, analysisType } =this.state;
      
      let data = {
        talker: talker,
        text: text,
        analysisType: analysisType,
      }

      /*
      형태소 분석 서버 연동 

      try {
          const response = await Axios.post("/cosmos/kStars/analysis2", {
              talker, text, analysisType
          });
          const { status, data } = response;
          console.log("문장번호" + selectedBoard.brdno);

          if (status === 200) {
            //서버에서 넘어온 값들 
          this.props.onSaveData(data,selectedBoard.brdno); 
          console.log("서버 작동 하나용?" , data);
    }


      } catch (error) {
            
            console.log(error);
      } 
      */

      this.props.onSaveData(data,selectedBoard.brdno); 
  
  }

  
   handleWaveformClick = () => {
    this.setState({
      isWaveform: !this.state.isWaveform,
    });
  }


  render() {
    const classes = useStyles.bind();
    const {isWaveform} = this.state;
    
      return (

        <form onSubmit={this.handleSubmit}>
          <Paper className = {classes.root} style={{marginTop: 20, marginBottom: 15}}>
              <Grid container spacing = {3} item xs={12}>
             
                <Grid item xs = {3} direction="row" justify="flex-end" alignItems="center">
                    <TextField
                      label="발화인"
                      placeholder = "발화인을 입력하세요 ..."
                      className={classes.textField}
                      style={{ margin: 8 ,marginLeft: 120}}
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}

                      name="talker"
                      value={this.state.talker}
                      onChange={this.handleChange}
                      />
                </Grid>

                <Grid item xs ={6}>
                  <div>
                    <TextField
                      label="발화내용"
                      style={{ margin: 8 }}
                      placeholder="분석하고자 하는 텍스트를 입력하세요 ..."
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      InputLabelProps={{                                 
                        shrink: true,
                      }}
                      name="text"
                      value={this.state.text}
                      onChange={this.handleChange}
                  /> 
                  </div>
                </Grid>

                    <Grid container spacing= {3} item xs = {3} >
                      {/* 분석유형 선택 start */}
                      <Grid>
                        <FormControl variant="outlined" className={classes.formControl} style={{ marginTop: 20, minWidth: 130}}>
                          
                          <Select
                            value={this.state.analysisType}
                            onChange={this.handleChange}
                            inputProps={{
                              name: 'analysisType'
                            }}
                            >
                            <MenuItem  value={"morpAPI"}>morpAPI</MenuItem>
                            <MenuItem  value={"wsdAPI"}>wsdAPI</MenuItem>
                            <MenuItem  value={"wsd_polyAPI"}>wsd_polyAPI</MenuItem>
                            <MenuItem  value={"nerAPI"}>nerAPI</MenuItem>
                            <MenuItem  value={"dparseAPI"}>dparseAPI</MenuItem>
                            <MenuItem  value={"srlAPI"}>srlAPI</MenuItem>

                          </Select>
                        </FormControl>
                      </Grid>
                      {/* 분석유형 선택 end */}

                      {/* 입력버튼 start */}
                      <Grid item sm={1}
                      container
                      direction="column"
                      justify="flex-end"
                      alignItems="center"
                      >
                        <Button type="submit" variant="contained" color="secondary" className={classes.button} style={{ margin: 20 , padding: 10}}>
                            입력
                        </Button>

                      </Grid>
                        {/* 입력버튼 end */}

                    </Grid>
                  </Grid>
              
              </Paper>
              </form>
      );
  }
}
export default TalkerForm;