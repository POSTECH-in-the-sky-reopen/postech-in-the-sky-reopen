import * as React from 'react';
import Button from '@mui/material/Button';

interface SubmitCheckValidProps {
    enabled: boolean,
    label: string
  }

const SubmitCheckValid: React.FunctionComponent<SubmitCheckValidProps> = (props) => {
    return (
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!props.enabled}
      >
        {props.label}
      </Button>
    )
  }

export default SubmitCheckValid
