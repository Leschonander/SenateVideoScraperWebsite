import React from 'react';
import { Typography, Snackbar } from '@material-ui/core';
import Link from 'next/link';

export default function ErrorNotification(props: {
  assistancePath?: string;
  errorMessage: string;
  errorCode: string;
  showAssistance?: boolean;
}) {
  const { showAssistance = true, errorMessage, assistancePath, errorCode } = props;
  if (!errorMessage) return null;

  const assistanceLink = assistancePath || `/support?errorCode=${errorCode}`;

  return (
    <Snackbar
      open={!!errorMessage}
      action={
        showAssistance ? (
          <Link href={assistanceLink}>
            <a>
              <Typography variant="h6" color="primary">
                {' '}
                Receber Assistnecia
              </Typography>
            </a>
          </Link>
        ) : undefined
      }
      message={<span id="message-id">{errorMessage}</span>}
    />
  );
}
