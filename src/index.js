const { addDialog, prompt } = require('bottender-proposal-multi-turns');

function getNumber() {
  return Math.floor(Math.random() * 100);
}

function createMathChallenge() {
  const left = getNumber();
  const right = getNumber();

  return {
    question: `${left} + ${right} = ?`,
    answer: `${left + right}`,
  };
}

const Challenge = addDialog('Challenge', [
  async context => {
    const { question, answer } = createMathChallenge();

    await context.sendText(question);

    return prompt('inputAnswer', {
      props: {
        expectedAnswer: answer,
      },
    });
  },
  async (context, props) => {
    const inputAnswer = props.prompt.inputAnswer.trim();

    const isAnswerCorrect = inputAnswer === props.expectedAnswer;

    await context.sendText(
      isAnswerCorrect ? 'Correct Answer!' : 'Wrong Answer!'
    );

    context.setState({
      score: isAnswerCorrect
        ? context.state.score + 1
        : context.state.score - 1,
    });
    await context.sendText(`Your Score: ${context.state.score}`);

    return Challenge;
  },
]);

module.exports = async function App() {
  return Challenge;
};
