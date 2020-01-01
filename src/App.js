import React, { useEffect, useRef, /*useCallback,*/ useState} from 'react';
import styled from "@emotion/styled";

const AppWrapper = styled.div({
  textAlign: "center"
});

const AppHeader = styled.header({
  backgroundColor: "#282c34",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "cyan"
});

const SiteTitle = styled.div({
  fontSize: 40,
  fontWeight: 400
})

const CommandPromptWrapper = styled.div({
  display: "flex",
  alignContent: "center",
  margin: "50px 0px"
})

const CommandPrompt = styled.input({
  display: "inline-block",
  background: "#282c34",
  color: "white",
  border: "none",
  outline: "none",
  width: 500,
  height: 46,
  fontSize: 30
})

const CommandPromptPrefixWrapper = styled.div({
  display: "inline-block",
  color: "white",
  fontSize: 40
})

const ThingsToTryWrapper = styled.div({
  color: "white",
  border: "1px solid white",
  boxSizing: "border-box",
  textAlign: "left",
  padding: 15,
  fontSize: 16,
  width: 530
})

const Error = styled.div({
  color: 'red',
  marginBottom: 20
})

function App() {
  const commandPromptRef = useRef(null);
  const [command, setCommand] = useState("")
  const [commandError, setCommandError] = useState("")

  function runCommand(command) {
    console.warn("command running...", command);

    if (command === "twitter") {
      const myTwitter = "https://twitter.com/Clay_Stewart";
      window.open(myTwitter, '_blank');
    }

    else if (command === "github") {
      const myGithub = "https://github.com/clamstew";
      window.open(myGithub, '_blank');
    }

    else if (command === "hire me") {
      const myGithub = "https://www.linkedin.com/in/claystewart/";
      window.open(myGithub, '_blank');
    }

    else if (command === "box it up") {
      const myBoxes = "https://www.mybox.es";
      window.open(myBoxes, '_blank');
    }

    else {
      setCommandError(`bash: command not found: ${command}`);
    }

  }

  useEffect(() => {
    const currentCommandPromptRef = commandPromptRef.current;
    // https://stackoverflow.com/questions/53314857/how-to-focus-something-on-next-render-with-react-hooks
    currentCommandPromptRef.focus();

    const keyUpEventListener = event => {
      
      console.warn("what am i typing:", event.target.value)
      
      // will run command highlighting here
    };

    const keyDownEventListener = event => {
      // https://stackoverflow.com/questions/47809282/submit-a-form-when-enter-is-pressed-in-a-textarea-in-react?rq=1
      console.warn("what keycode", event.which);
      if (event.which === 13 && event.shiftKey === false) {
        event.preventDefault();
        runCommand(command);
      } else {
        setCommandError("");
      }
    };

    // Add event listener
    currentCommandPromptRef.addEventListener("keyup", keyUpEventListener);
    currentCommandPromptRef.addEventListener("keydown", keyDownEventListener);
      
    // Remove event listener on cleanup
    return () => {
      currentCommandPromptRef.removeEventListener("keyup", keyUpEventListener);
      currentCommandPromptRef.removeEventListener("keydown", keyDownEventListener);
    };
  }, [command]);
  

  return (
    <AppWrapper>
      <AppHeader>
        <SiteTitle>clay.codes</SiteTitle>

        <CommandPromptWrapper>
          <CommandPromptPrefixWrapper>$></CommandPromptPrefixWrapper>
          <CommandPrompt
            ref={commandPromptRef}
            spellcheck="false"
            onChange={(e) => (setCommand(e.target.value))}
            placeholder="Type a command" />
        </CommandPromptWrapper>

        <Error>{commandError}</Error>

        <ThingsToTryWrapper>
          <div>Things to try:</div>
          <ul>
            <li>twitter</li>
            <li>github</li>
            <li>hire me</li>
            <li>box it up</li>
          </ul>
        </ThingsToTryWrapper>
      </AppHeader>
    </AppWrapper>
  );
}

export default App;
