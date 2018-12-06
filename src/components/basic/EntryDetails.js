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
  color: rgba(0,0,0,.3);
  display: inline-block;
`

// const IconButtonStyled = styled(IconButton)`
//   margin: -100px 0 !important;
//   vertical-align: middle;
// `

class EntryDetails extends React.Component {
  render() {
    const { gloss, pos, morphPos, languageId } = this.props 

    const posArray = pos
      .map(posCode => {
        const posTerm = getPOSTerm({ languageId, posCode })
        return posCode === morphPos
          ? (
            <span
              style={{ color: "#000" }}
              key={posCode}
            >
              {posTerm}
            </span>
          )
          : posTerm
      })
      .reduce((accumulator, value, index) => [
        ...accumulator,
        <span key={index}>{i18n(", ", {}, "list separator", "grammar")}</span>,
        value,
      ], [])
      .slice(1)

    return (
      <DetailsLine>
        <Definition>{gloss}</Definition>
        <span> </span>
        <PartOfSpeech>{posArray}</PartOfSpeech>
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