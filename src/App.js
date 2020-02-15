import React, { useState } from 'react';
import {
  shuffle,
  filter
} from 'lodash';
import './App.css';

import { db } from './db';
import { images } from './images';

const getAnswerColor = props => {
  const {
    ordinal,
    selected,
    correct,
    answered,
  } = props;
  if (!answered) {
    return 'white';
  }
  if (ordinal === correct) {
    return 'green';
  }
  if (selected === ordinal && ordinal !== correct) {
    return 'red';
  }
  return 'white';
}
function Answer(props) {
  const {
    text,
    ordinal,
    selected,
    correct,
    handleSelection,
    answered,
  } = props;

  const color = getAnswerColor(props);
  return (<div key={ordinal}>
    <label style={{color}}>
    <input value={ordinal} type="radio" name="answer" onChange={handleSelection}/>
    {text}</label>
  </div>);
};

function HeaderComponent(props) {
  const {
    questionsAnswered,
    questionsCorrect
  } = props;

  const percentage = questionsAnswered ?
    Number.parseFloat(100 * questionsCorrect / questionsAnswered).toFixed(1) :
    '-';
  return <div>
    Score: {`${questionsCorrect}/${questionsAnswered} (${percentage} %)`}
  </div>
}
function QuestionComponent(props) {
  const {
    q,
    next,
    selected,
    handleSelection,
    answered,
    answer,
  } = props;
  if (!q) {
    return (<div>No more questions</div>);
  }
  const {
    QuestionTextNL,
    QuestionAnswerANL,
    QuestionAnswerBNL,
    QuestionAnswerCNL,
    QuestionAnswerDNL,
    QuestionCorrectAnswer: correct,
    QuestionPK,
    QuestionNr
  } = q;
  const answers = {
    A: QuestionAnswerANL,
    B: QuestionAnswerBNL,
    C: QuestionAnswerCNL,
    D: QuestionAnswerDNL
  };
  return <div key={QuestionPK}>
    {images[QuestionNr] &&
    <div>
      <img src={`./images_nl/${images[QuestionNr]}`}/>
    </div>
    }
    {QuestionTextNL}
    {'ABCD'.split('').map(ordinal =>
      Answer({ text: answers[ordinal], ordinal, correct, selected, handleSelection, answered }))}
    <div>
      {answered &&
        <button type="submit" onClick={next} >Volgende vraag</button>
      }
      {!answered &&
        <button type="submit" onClick={answer} >Controleer</button>
      }
    </div>
  </div>
}

function ChapterComponent({
  chapter,
  setChapter,
  setStart,
}) {
  return (
  <div>
    <div>
      Kies een hoofdstuk:
    </div>
    <div>
    <select onChange={(event) => setChapter(parseInt(event.target.value, 10))}>
    {db.CategorieTable.map(c => {
        const numQuestionsText = c.CategorieNumberOfQuestions === 1 ?
        "1 examenvraag" :
        `${c.CategorieNumberOfQuestions} examenvragen`;

        return (
      <option value={c.CategorieFromChapter}>
        {`${c.CategorieName} (${numQuestionsText})`}
      </option>);
    }
    )}
    </select>
    </div>
    <div>
    <button onClick={() => setStart(true)}>start</button>
    </div>
  </div>);
}

function App() {
  // 1113 uses a png
  // const qIdx = findIndex(db.QuestionsTable, q => q.QuestionPK === 1113);
  // const [ idx, setIdx ] = useState(qIdx);
  const [ idx, setIdx ] = useState(0);
  const [ selected, select ] = useState(undefined);
  const handleSelection = event => {
    select(event.target.value);
  }
  const next = () => {
    setIdx(idx + 1);
    select(undefined);
  };
  const [ chapter, setChapter ] = useState(101);
  const [ start, setStart ] = useState(false);
  const [ questions, setQuestions ] = useState([]);
  const [ questionsAnswered, setQuestionsAnswered ] = useState(0);
  const [ questionsCorrect, setQuestionsCorrect ] = useState(0);
  const [ answered, setAnswered ] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        {!start &&
        ChapterComponent({
          setChapter,
          chapter,
          setStart: value => {
            console.log('chapter', chapter);
            const filtered = filter(db.QuestionsTable, q => q.QuestionChapter === chapter);
            setQuestions(
              shuffle(filtered)
            );
            console.log('questions', questions.length, chapter, filtered.length);
            setStart(value);
          }
        })}
      { start &&
      <div>
        {HeaderComponent({
          questionsAnswered,
          questionsCorrect
        })}
      {QuestionComponent({
        q: questions[idx],
        next: () => {
          setAnswered(false);
          next();
        },
        selected,
        select,
        handleSelection,
        answered,
        answer: () => {
          if (answered) {
            return;
          }
          if (selected === questions[idx].QuestionCorrectAnswer) {
            setQuestionsCorrect(questionsCorrect + 1);
          }
          setQuestionsAnswered(questionsAnswered + 1);
          setAnswered(true);
        }
        })}
      </div>
      }
      </header>
    </div>
  );
}

export default App;
