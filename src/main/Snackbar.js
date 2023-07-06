import React from "react";
import { SnackbarProvider } from "notistack";
export default function Snackbar(props) {
  return (
    <SnackbarProvider maxSnack={5} autoHideDuration={2500}>
      {props.children}
    </SnackbarProvider>
  );
}
