import { ActionButton } from "@adobe/react-spectrum";
import { UnstyledOpenInCodeSandboxButton } from "@codesandbox/sandpack-react";
import LinkOut from "@spectrum-icons/workflow/LinkOut";
import { useRef } from "react";

export function OpenInSandboxButton() {
  let ref = useRef(null);
  return (
    <>
      <ActionButton
        isQuiet
        aria-label="Open in Sandbox"
        onPress={() => ref.current.childNodes[0].click()}
      >
        <LinkOut />
      </ActionButton>
      <div ref={ref} aria-hidden="true" className="hidden">
        <UnstyledOpenInCodeSandboxButton>
          Open in Sandbox
        </UnstyledOpenInCodeSandboxButton>
      </div>
    </>
  );
}
