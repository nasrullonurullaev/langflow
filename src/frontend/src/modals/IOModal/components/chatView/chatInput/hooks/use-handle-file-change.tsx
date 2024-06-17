import ShortUniqueId from "short-unique-id";
import {
  ALLOWED_IMAGE_INPUT_EXTENSIONS,
  FS_ERROR_TEXT,
  SN_ERROR_TEXT,
} from "../../../../../../constants/constants";
import useAlertStore from "../../../../../../stores/alertStore";
import useFileUpload from "./use-file-upload";

export const useHandleFileChange = (setFiles, currentFlowId) => {
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (
        !fileExtension ||
        !ALLOWED_IMAGE_INPUT_EXTENSIONS.includes(fileExtension)
      ) {
        setErrorData({
          title: "Error uploading file",
          list: [FS_ERROR_TEXT, SN_ERROR_TEXT],
        });
        return;
      }

      const uid = new ShortUniqueId({ length: 10 }); // Increase the length to ensure uniqueness
      const id = uid();
      const type = file.type.split("/")[0];
      const blob = file;

      setFiles((prevFiles) => [
        ...prevFiles,
        { file: blob, loading: true, error: false, id, type },
      ]);

      useFileUpload(blob, currentFlowId, setFiles, id);
    }

    // Clear the file input value to ensure the change event is triggered even for the same file
    fileInput.value = "";
  };

  return {
    handleFileChange,
  };
};

export default useHandleFileChange;
