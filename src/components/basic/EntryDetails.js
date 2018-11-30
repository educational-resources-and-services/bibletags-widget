import React from 'react'
import i18n from '../../utils/i18n.js'
import styled from 'styled-components'
import { getPOSTerm } from '../../utils/helperFunctions.js'

// import IconButton from '@material-ui/core/IconButton'
// import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

const DetailsLine = styled.div`
  padding-top: 10px;
`

const Definition = styled.div`
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  margin-right: 3px;
`

const PartOfSpeech = styled.div`
  font-size: 14px;
  display: inline-block;
`

// const IconButtonStyled = styled(IconButton)`
//   margin: -100px 0 !important;
//   vertical-align: middle;
// `

class EntryDetails extends React.Component {
  render() {
    const { gloss, pos, language } = this.props 

    return (
      <DetailsLine>
        <Definition>{gloss}</Definition>
        <span> </span>
        <PartOfSpeech>{pos.map(posCode => getPOSTerm({ language, posCode })).join(i18n(", ", {}, "list separator"))}</PartOfSpeech>
        {/* <IconButtonStyled
          aria-label="Lexicon"
          onClick={() => {}}
        >
          <LibraryBooksIcon />
        </IconButtonStyled> */}
      </DetailsLine>
    )
  }

}

export default EntryDetails