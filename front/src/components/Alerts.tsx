import React from "react";
import { Alert, AlertIcon, chakra, Stack } from "@chakra-ui/react";

export interface IAlertWithoutActionProps {
  alertText: React.ReactNode;
}

export interface IAlertWithActionProps extends IAlertWithoutActionProps {
  actionText: string;
  onActionClick: () => void;
  // eslint-disable-next-line react/require-default-props
  type?: "error" | "warning";
}

export function AlertWithoutAction({ alertText }: IAlertWithoutActionProps) {
  return (
    <Alert status="error" data-testid="ErrorAlert">
      <>
        <AlertIcon />
        {alertText}
      </>
    </Alert>
  );
}

export function AlertWithAction({
  alertText,
  actionText,
  onActionClick,
  type,
}: IAlertWithActionProps) {
  return (
    <Alert status={type ?? "error"} data-testid="ErrorAlert">
      <AlertIcon />
      <Stack direction="column">
        <chakra.span>{alertText}</chakra.span>
        <chakra.span
          onClick={onActionClick}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {actionText}
        </chakra.span>
      </Stack>
    </Alert>
  );
}
