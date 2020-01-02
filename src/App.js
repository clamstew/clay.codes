import React, { useEffect, useRef, useState, useCallback } from "react";
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

const SiteTitle = styled.code({
  fontSize: 40,
  fontWeight: 400,
  userSelect: "none"
});

const CommandPromptWrapper = styled.div({
  display: "flex",
  alignContent: "center",
  margin: "50px 0px"
});

const CommandPrompt = styled.input({
  display: "inline-block",
  background: "#282c34",
  color: "white",
  border: "none",
  outline: "none",
  width: 500,
  height: 46,
  fontSize: 30,
  "@media (max-width: 560px)": {
    width: "94%"
  }
});

const CommandPromptPrefixWrapper = styled.div({
  display: "inline-block",
  color: "white",
  fontSize: 40
});

const ThingsToTryWrapper = styled.div({
  color: "white",
  border: "1px solid white",
  boxSizing: "border-box",
  textAlign: "left",
  padding: 15,
  fontSize: 16,
  width: 530,
  "@media (max-width: 560px)": {
    width: "94%"
  }
});

const Error = styled.div({
  color: "red",
  marginBottom: 20
});

const SuccessOutput = styled.div({
  color: "green"
});

const AppLink = styled.a({
  color: "#61dafb"
});

const SubmitButton = styled.button({
  background: "#282c34",
  border: "1px solid white",
  color: "white",
  borderRadius: "5px",
  fontSize: 18,
  cursor: "pointer"
});

const goSiteToCommands = {
  twitter: "https://twitter.com/Clay_Stewart",
  github: "https://github.com/clamstew",
  "hire me": "https://www.linkedin.com/in/claystewart/",
  "box it up": "https://www.mybox.es",
  asdf: "https://github.com/asdf-vm/asdf",
  "site code": "https://github.com/clamstew/clay.codes"
};

const allCommands = [...Object.keys(goSiteToCommands)];

function App() {
  const commandPromptRef = useRef(null);
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);

  const runCommand = useCallback(
    command => {
      // console.warn("command running...", command);
      let output = "";
      if (goSiteToCommands[command]) {
        output = `Opening site: ${goSiteToCommands[command]}`;
        setCommandOutput(output);
        // delay for a hot second, so user can see the output
        setTimeout(() => {
          window.open(goSiteToCommands[command], "_blank");
        }, 600);
      } else {
        output = `bash: command not found: ${command}`;
        setCommandError(output);
      }

      // add command to command history
      setCommandHistory([...commandHistory, { command, output }]);
    },
    [commandHistory]
  );

  useEffect(() => {
    const currentCommandPromptRef = commandPromptRef.current;
    // https://stackoverflow.com/questions/53314857/how-to-focus-something-on-next-render-with-react-hooks
    currentCommandPromptRef.focus();

    const runCommandAlias = runCommand;

    const keyUpEventListener = event => {
      console.warn("what am i typing:", event.target.value);
      // will run command highlighting here
    };

    const keyDownEventListener = event => {
      // https://stackoverflow.com/questions/47809282/submit-a-form-when-enter-is-pressed-in-a-textarea-in-react?rq=1
      console.warn("what keycode", event.which);
      if (event.which === 13 && event.shiftKey === false) {
        event.preventDefault();
        runCommandAlias(command.toLowerCase());
      } else {
        setCommandError("");
        setCommandOutput("");
      }
    };

    // Add event listener
    currentCommandPromptRef.addEventListener("keyup", keyUpEventListener);
    currentCommandPromptRef.addEventListener("keydown", keyDownEventListener);

    // Remove event listener on cleanup
    return () => {
      currentCommandPromptRef.removeEventListener("keyup", keyUpEventListener);
      currentCommandPromptRef.removeEventListener(
        "keydown",
        keyDownEventListener
      );
    };
  }, [command, commandHistory, runCommand]);

  const commandsThatMatchPartialCommand = allCommands.filter(cmd => {
    const regex = new RegExp(command.toLowerCase());
    return cmd.match(regex);
  });

  const tryAgain = e => {
    setCommand("");
    setCommandError("");
    setCommandOutput("");
    commandPromptRef.current.value = "";
  };

  const CommandExample = ({ cmd }) => (
    <li
      style={{ cursor: "pointer" }}
      onClick={() => {
        setCommand(cmd);
        commandPromptRef.current.value = cmd;
      }}>
      {cmd}
    </li>
  );

  const matchingCommandTyped =
    commandsThatMatchPartialCommand.length === 1 &&
    commandsThatMatchPartialCommand[0] === command;

  return (
    <AppWrapper>
      <AppHeader>
        <SiteTitle>&lt;clay.codes /&gt;</SiteTitle>

        <CommandPromptWrapper>
          <CommandPromptPrefixWrapper>$></CommandPromptPrefixWrapper>
          <CommandPrompt
            ref={commandPromptRef}
            spellcheck="false"
            onChange={e => setCommand(e.target.value)}
            placeholder="run a command ..."
          />
        </CommandPromptWrapper>

        {commandError && <Error>{commandError}</Error>}
        {commandOutput && <SuccessOutput>{commandOutput}</SuccessOutput>}

        {matchingCommandTyped || (
          <ThingsToTryWrapper>
            {commandsThatMatchPartialCommand.length > 0 && (
              <div>Commands to try:</div>
            )}
            {commandsThatMatchPartialCommand.length > 0 || (
              <div>
                No matching commands.{" "}
                <AppLink href="#/" onClick={tryAgain}>
                  Try again.
                </AppLink>
              </div>
            )}
            <ul>
              {command === "" &&
                allCommands.map(cmd => <CommandExample key={cmd} cmd={cmd} />)}
              {command !== "" &&
                commandsThatMatchPartialCommand.map(cmd => (
                  <CommandExample key={cmd} cmd={cmd} />
                ))}
            </ul>
          </ThingsToTryWrapper>
        )}

        {matchingCommandTyped && (
          <div>
            <span>Press</span>{" "}
            <SubmitButton onClick={() => runCommand(command)}>
              Enter
            </SubmitButton>
          </div>
        )}
      </AppHeader>
    </AppWrapper>
  );
}

export default App;
