import React from "react";
import Dialog from "@mui/material/Dialog";
import Title from "./Title";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

export default function Modal(props) {
  return (
    <>
      <Dialog
        open={props.show}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <div className="dialogBody">
          <div className="headerWithIcon">
            <Title>{props.title ? props.title : "Dialog"}</Title>
            <CloseIcon
              onClick={() => {
                props.onClose();
              }}
              fontSize="medium"
            />
          </div>
          <div className="dialogContent">{props.children}</div>
          <div className="dialogFooter">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                props.onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={async () => {
                try {
                  await props.confirm();
                  props.onClose();
                } catch (error) {
                  props.onClose();
                }
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
