import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'

// import IconButton from '@material-ui/core/IconButton'
// import SearchIcon from '@material-ui/icons/Search'

const WordLine = styled.div`
  padding-right: 40px;
`

const Lexeme = styled.div`
  font-size: 17px;
  display: inline-block;
  margin-right: 3px;
`

const Pronounciation = styled.div`
  font-size: 15px;
  color: rgba(0,0,0,.5);
  display: inline-block;
  margin-right: 3px;
`

const Strongs = styled.div`
  font-size: 14px;
  display: inline-block;
  margin-right: 3px;
`

const Hits = styled.div`
  font-size: 13px;
  color: rgba(0,0,0,.5);
  display: inline-block;
`

// const IconButtonStyled = styled(IconButton)`
//   position: absolute !important;
//   top: 0;
//   right: 0;
// `

class EntryWord extends React.Component {
  render() {
    const { id, lex, vocal, hits, languageId } = this.props

    const strongs = id
      .split('-')[0]  // get rid of -eng or the like
      .replace(/^H0+/, 'H')  // get rid of leading zeros

    return (
      <WordLine>
        <Lexeme className={`${languageId}Font`}>{lex}</Lexeme>
        <span> </span>
        <Pronounciation>{vocal}</Pronounciation>
        <span> </span>
        <Strongs>{strongs}</Strongs>
        <span> </span>
        <Hits>{i18n("{{hits}}x", { hits })}</Hits>
        {/* <IconButtonStyled
          aria-label="Search"
          onClick={() => {}}
        >
          <SearchIcon />
        </IconButtonStyled> */}
      </WordLine>
    )
  }

}

export default EntryWord