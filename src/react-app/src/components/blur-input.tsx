import { useCallback, useEffect, useState } from "react";

export function BlurInput(props: {
  name?: string;
  className?: string;
  type?: string;
  value: string;
  placeholder?: string;
  restoreIfEmpty?: boolean;
  trim?: boolean;
  multiline?: boolean;
  emitKeyStrokes?: boolean;
  onChange: (value: string) => void;
  onReturn?: () => void;
}) {
  const [currentValue, setCurrentValue] = useState(props.value);

  useEffect(() => {
    setCurrentValue(props.value);
  }, [props.value]);

  const onBlurCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      const newValue = props.trim ? value.trim() : value;

      if (newValue.length === 0 && props.restoreIfEmpty === true) {
        setCurrentValue(props.value);
      } else {
        setCurrentValue(newValue);
        props.onChange(newValue);
      }
    },
    [props]
  );

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setCurrentValue(props.trim ? value.trim() : value);

      if (props.emitKeyStrokes) {
        onBlurCallback(event);
      }
    },
    [onBlurCallback, props.emitKeyStrokes, props.trim]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!props.multiline && event.key === "Enter") {
        event.currentTarget.blur();
        if (props.onReturn) {
          props.onReturn();
        }
      }
    },
    [props]
  );

  if (props.multiline) {
    return (
      <textarea
        rows={1}
        name={props.name}
        autoComplete="off"
        className={props.className}
        value={currentValue}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={onBlurCallback}
        placeholder={props.placeholder}
      />
    );
  } else {
    return (
      <input
        type={props.type}
        name={props.name}
        autoComplete="off"
        maxLength={100}
        className={props.className}
        value={currentValue}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={onBlurCallback}
        placeholder={props.placeholder}
      />
    );
  }
}
