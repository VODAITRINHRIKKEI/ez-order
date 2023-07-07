import React from "react";
import { SnackbarProvider } from "notistack";
export default function Snackbar(props) {
  return (
    <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
      {props.children}
    </SnackbarProvider>
  );
}
