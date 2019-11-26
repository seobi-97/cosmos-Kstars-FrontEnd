import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

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


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(3, 2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },

}));

class TalkerForm extends Component {
  
  state = {
    talker:'',
    text:'',
    analysisType:'',

  }
  
  
  shouldComponentUpdate(nextProps, nextState) {
    let selectedBoard = nextProps.selectedBoard;
   
    
    //update 글 수정(입력상자 초기화)
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

    console.log("선택된 내용: ", selectedBoard);
         
    return true;
  }


  handleChange = (e) => {
    this.setState({
        [e.target.name]: e.target.value
    })
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

      console.log("입력 내용: ", this.state);


      try {
          const response = await Axios.post("/cosmos/kStars/analysis", {
              talker, text, analysisType
          });
          const { status, data } = response;

          console.log(response);

          if (status === 200) {
            console.log(data);
 
          }

      } catch (error) {
            
            console.log(error);
      } 

       
      //수정시 선택된 brdno로 저장되어 넘어감.
      if (selectedBoard.brdno) {
        data.brdno = selectedBoard.brdno
      } 

      this.props.onSaveData(data); 



  }



  render() {
    const classes = useStyles.bind();
    
      return (
          <form onSubmit={this.handleSubmit}>
        
          <Paper className = {classes.root} style={{marginTop: 20, marginBottom: 15,}}>
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
                      <TextField
                        label="발화내용"
                        style={{ margin: 8 }}
                        placeholder="분석하고자 하는 텍스트를 입력하세요 ..."
                        helperText="분석하기 버튼을 누르세요"
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
                </Grid>

                
                    <Grid container spacing = {3}  item xs = {3} >
                      {/* 분석유형 선택 start */}
                      <Grid>
                        <FormControl variant="outlined" className={classes.formControl} style={{ marginTop: 20, minWidth: 130,}}>
                          
                          <Select
                            value={this.state.analysisType}
                            onChange={this.handleChange}
                            inputProps={{
                              name: 'analysisType',
                             
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

                      {/* 분석하기 버튼 start */}
                      <Grid >
                        <Button type="submit" variant="contained" color="secondary" className={classes.button} style={{ margin: 20 , padding: 13}}>
                          분석하기
                        </Button>
                      </Grid>
                    </Grid>
                      {/* 분석하기 버튼 end */}
                    
                  </Grid>
                      
              </Paper>
              </form>
      );
  }
}
export default TalkerForm;