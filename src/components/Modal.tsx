import {ChangeEvent} from "react";

type ModalProps = {
      inputValue: string;
      onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
      onSave: () => void;
      isOpen: boolean;
      setIsOpen: (isOpen: boolean) => void;
}

export function Modal(props: ModalProps) {

      const onClose = () => {
            props.setIsOpen(false);
      }

      return (
          <>
                {props.isOpen && (
                    <div className={"modal-bg"} onClick={onClose}>
                          <div className={"modal-main"} onClick={(e) => e.stopPropagation()}>
                                <div className={"modal-header"}>
                                      Input name for new folder:
                                      <button className={"btn"} onClick={onClose}> X </button>
                                </div>
                                <div className={"modal-body"}>
                                      <input value={props.inputValue} onChange={props.onInputChange} />
                                </div>
                                <div className={"modal-footer"}>
                                      <button className={"btn btn-outline-primary"} onClick={props.onSave}>Save</button>
                                </div>
                          </div>
                    </div>
                )}
          </>
      )
}