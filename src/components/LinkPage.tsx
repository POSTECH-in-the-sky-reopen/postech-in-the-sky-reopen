import * as React from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

interface LinkPageProps {
  href: string,
  label: string
}

const LinkPage: React.FunctionComponent<LinkPageProps> = (props) => {
  return (
    <Grid container justifyContent="flex-end">
      <Grid item>
        <Link href={props.href} variant="body2" color ="inherit" sx={{
          position: 'relative',
        }}>
          {props.label}
        </Link>
      </Grid>
    </Grid>
  )
}

export default LinkPage


