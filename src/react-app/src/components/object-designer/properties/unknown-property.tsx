import { Utils } from "../../../utils";
import { ValueError } from "../../../project/validator";

export function UnknownProperty(props: {
  keyName?: string;
  text: string;
  errors: ValueError[];
}) {
  const { keyName, text, errors } = props;
  const hasErrors = errors.length > 0;

  return (
    <input
      type="text"
      name={`property-${keyName}`}
      autoComplete="off"
      className={Utils.classNames(
        "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        hasErrors ? "border-red-500" : "border-gray-300"
      )}
      value={text}
      readOnly={true}
    />
  );
}
