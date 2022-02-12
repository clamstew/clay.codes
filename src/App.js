import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "@emotion/styled";
import { goSiteToCommands, terminalCommands, allCommands } from "./constants";

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

const CommandPromptWrapper = styled.div(({ outputShown }) => {
  const styles = {
    display: "flex",
    alignContent: "center",
    margin: "50px 0px"
  };
  if (outputShown) styles.margin = "50px 0 0 0";
  return styles;
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
  textAlign: "left",
  width: 548,
  marginBottom: 30
});

const SuccessOutput = styled.div({
  color: "green",
  textAlign: "left",
  width: 548,
  marginBottom: 30
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
  cursor: "pointer",
  ":hover": {
    // outline: "2px solid white"
    boxShadow: "0 0 0 2px white"
  }
});

const CommandsListWrapper = styled.div({ columns: 2, marginTop: 20 });

function App() {
  const commandPromptRef = useRef(null);
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);

  const runCommand = useCallback(
    (command) => {
      // console.warn("command running...", command);
      let output = "";
      if (goSiteToCommands[command]) {
        output = `Opening site: ${goSiteToCommands[command]}`;
        setCommandOutput(output);
        // delay for a hot second, so user can see the output
        setTimeout(() => {
          window.open(goSiteToCommands[command], "_blank");
        }, 600);
      } else if (command === terminalCommands.history) {
        // print history
        const historyString = `${commandHistory
          .map((historyItem) => historyItem.command)
          .join("<br />")}<br />${command}`;
        setCommandOutput(historyString);
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

    const keyUpEventListener = (event) => {
      // console.warn("what am i typing:", event.target.value);
      // will run command highlighting here
    };

    const keyDownEventListener = (event) => {
      // https://stackoverflow.com/questions/47809282/submit-a-form-when-enter-is-pressed-in-a-textarea-in-react?rq=1
      // console.warn("what keycode", event.which);
      if (event.which === 27 && event.shiftKey === false) {
        event.preventDefault();
        setCommand("");
        setCommandError("");
        setCommandOutput("");
        // @FIXME - need to clear input value
      } else if (event.which === 13 && event.shiftKey === false) {
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

  const commandsThatMatchPartialCommand = allCommands.filter((cmd) => {
    const regex = new RegExp(
      command
        .toLowerCase()
        .replace("(", "")
        .replace(")", "")
        .replace("*", "")
        .replace("&", "")
        .replace("^", "")
        .replace("%", "")
        .replace("$", "")
        .replace("#", "")
        .replace("@", "")
        .replace("!", "")
        .replace("~", "")
        .replace("`", "")
        .replace("-", "")
        .replace("_", "")
        .replace("+", "")
        .replace("=", "")
        .replace("[", "")
        .replace("]", "")
        .replace("{", "")
        .replace("}", "")
        .replace("|", "")
        .replace("\\", "")
        .replace("/", "")
        .replace("?", "")
        .replace(">", "")
        .replace(".", "")
        .replace("<", "")
        .replace(",", "")
    );
    return cmd.match(regex);
  });

  const tryAgain = (e) => {
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
      }}
    >
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

        <CommandPromptWrapper outputShown={commandOutput || commandError}>
          <CommandPromptPrefixWrapper>$></CommandPromptPrefixWrapper>
          <CommandPrompt
            ref={commandPromptRef}
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            onChange={(e) => setCommand(e.target.value)}
            placeholder="run a command ..."
          />
        </CommandPromptWrapper>

        {commandError && <Error>{commandError}</Error>}
        {commandOutput && (
          <SuccessOutput dangerouslySetInnerHTML={{ __html: commandOutput }} />
        )}

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
            <CommandsListWrapper>
              <ul style={{ margin: 0 }}>
                {command === "" &&
                  allCommands.map((cmd) => (
                    <CommandExample key={cmd} cmd={cmd} />
                  ))}
                {command !== "" &&
                  commandsThatMatchPartialCommand.map((cmd) => (
                    <CommandExample key={cmd} cmd={cmd} />
                  ))}
              </ul>
            </CommandsListWrapper>
          </ThingsToTryWrapper>
        )}

        {matchingCommandTyped && (
          <div>
            <span>Press</span>{" "}
            <SubmitButton onClick={() => runCommand(command)}>
              Enter
            </SubmitButton>{" "}
            <span>or</span>{" "}
            <AppLink href="#/" onClick={tryAgain}>
              Try again.
            </AppLink>
          </div>
        )}
      </AppHeader>
    </AppWrapper>
  );
}

export default App;
