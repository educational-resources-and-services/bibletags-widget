import { stripProps } from '../../utils/helperFunctions.js'
import styled from 'styled-components'

const LinkLikeSpan = styled(stripProps('span', ['disabled']))`

  text-decoration: underline;
  color: rgba(0,0,0,.4);

  ${({ disabled }) =>
    disabled
      ? `
        color: rgba(0,0,0,0.2);
      `
      : `
        :hover {
          color: black;
          cursor: pointer;
        }
      `
  }

`

export default LinkLikeSpan