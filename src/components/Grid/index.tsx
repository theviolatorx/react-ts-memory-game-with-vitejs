import { useRef, useState } from "react";
import { duplicateRegenerateSortArray } from "../../utils/card-utils";
import { Card, CardProps } from "../Card";
import './style.css';

export interface GridProps {
  cards: CardProps[];
}

export function Grid({ cards }: GridProps)  {

  const [stateCards, setStateCards] = useState(() =>{
    return duplicateRegenerateSortArray(cards);
  })


  const first = useRef<CardProps | null>(null);
  const second = useRef<CardProps | null>(null);
  const unflip = useRef(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  
  const handleReset = () => {
    setStateCards( duplicateRegenerateSortArray(cards));
    first.current = null;
    second.current = null;
    unflip.current = false;
    setMatches(0);
    setMoves(0);
  }

  
  const handleClick = (id: string) => {
    const newStateCards = stateCards.map((card) => {
      
      // se o id do cartão não for o id clicado, não faz nada
      if (card.id != id)  return card;
      // Se o cartão já estiver virado, não faz nada 
      if (card.flipped) return card;
      
      // desviro possiveis cartas erradas
      if (unflip.current && first.current && second.current) {
          // a Pessoa errou
          first.current.flipped = false;
          second.current.flipped = false;
          first.current = null;
          second.current = null;
          unflip.current = false;
        
      }
      // virar o card
      card.flipped = true;

      //Configura primeiro e segundo cartão clicado
      if (first.current === null) {
        first.current = card;
      } else if (second.current === null) {
        second.current = card;
      }

      // Se eu tenho os dois cartões virados, posso chegar se estão corretos

      if (first.current && second.current) {
        if (first.current.back === second.current.back) {
          //a Pessoa acertou
          first.current = null;
          second.current = null;
          setMatches((m) => m + 1);
        } else {
          // a Pessoa errou
         unflip.current = true;
        }

        setMoves((m) => m + 1);
      }
    
      

      return card;
    });

    setStateCards(newStateCards);

  }

  return (
<>
    <div className="text">
      <h1>Jogo da Memória</h1>
      <p>Movimentos: {moves} | Encontrados: {matches} |  <button onClick={() => handleReset()}>Reiniciar</button></p>
    </div>
  <div className="grid">
    {stateCards.map((card) => {
      return <Card {...card} key={card.id} handleClick={handleClick}/>;
    })}
  </div>
  </>
  );
}