import * as React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { OnChangeFunc } from './type-misc'

interface InputCheckValidProps {
  input: string, 
  label: string,
  isPassword: boolean,
  onChange: OnChangeFunc, 
  value: string | number, 
  isValid: boolean, 
  message: string
}

const InputCheckValid: React.FunctionComponent<InputCheckValidProps> = (props) => {
  const highlight = (typeof(props.value) === "number" || props.value.length > 0) ?
    ( props.isValid ? 
      {'error': false} :
      {'error': true}
    ) :
    {}
  
  const type = props.isPassword ?
    {'type': 'password'} :
    {}
    
  return (
    <Grid item xs={12}>
      <TextField
        required
        fullWidth
        {...highlight}
        name={props.input}
        id={props.input}
        label={props.label}
        {...type}
        onChange={props.onChange}
        value={props.value}
        helperText={props.message}
      />
    </Grid>
  )
}

export default InputCheckValid
