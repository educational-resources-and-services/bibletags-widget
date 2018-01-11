import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  padding: 15px;
`

class EntrySection extends React.Component {
  render() {
    const { children, bg, style } = this.props 

    return (
      <Container
        style={{
          ...style,
          backgroundColor: bg,
        }}
      >
        {children}
      </Container>
    )
  }

}

export default EntrySection