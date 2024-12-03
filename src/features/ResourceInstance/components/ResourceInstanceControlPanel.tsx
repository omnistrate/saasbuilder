import { FC, useMemo } from "react";
import RestartIcon from "components/Icons/Reboot/Reboot";
import StopIcon from "components/Icons/Stop/Stop";
import ModifyIcon from "components/Icons/Edit/Edit";
import StartIcon from "components/Icons/Play/Play";
import Select from "components/FormElementsv2/Select/Select";
import RestoreInstanceIcon from "src/components/Icons/RestoreInstance/RestoreInstanceIcon";
import AddCapacityIcon from "src/components/Icons/AddCapacity/AddCapacityIcon";
import RemoveCapacityIcon from "src/components/Icons/RemoveCapacity/RemoveCapacityIcon";
import DeleteIcon from "src/components/Icons/Delete/Delete";
import MenuItem from "src/components/MenuItem/MenuItem";
import GenerateTokenIcon from "src/components/Icons/GenerateToken/GenerateTokenIcon";

type ResourceInstanceControlPanelProps = {
  isCurrentResourceBYOA?: boolean;
  handleRestart?: () => void;
  handleStart?: () => void;
  handleStop?: () => void;
  handleModify?: () => void;
  handleDelete?: () => void;
  handleAddCapacity?: () => void;
  handleRemoveCapacity?: () => void;
  handleRestore?: () => void;
  isCliManagedResource?: boolean;
  isRestartDisabled?: boolean;
  isStartDisabled?: boolean;
  isStopDisabled?: boolean;
  isModifyDisabled?: boolean;
  isDeleteDisabled?: boolean;
  isRestoreDisabled?: boolean;
  isAddCapacity?: boolean;
  isRemoveCapacity?: boolean;
  isLoading?: boolean;
  isVisibleRestore?: boolean;
  isVisibleCapacity?: boolean;
  isVisibleBYOA?: boolean;
  isVisibleGenerateToken?: boolean;
  handleGenerateToken?: () => void;
};

const ResourceInstanceControlPanel: FC<ResourceInstanceControlPanelProps> = ({
  isCurrentResourceBYOA,
  handleRestart = () => {},
  handleStart = () => {},
  handleStop = () => {},
  handleRestore = () => {},
  handleAddCapacity = () => {},
  handleRemoveCapacity = () => {},
  handleModify,
  handleDelete,
  handleGenerateToken = () => {},
  isCliManagedResource,
  isRestartDisabled,
  isStartDisabled,
  isStopDisabled,
  isModifyDisabled,
  isDeleteDisabled,
  isRestoreDisabled,
  isLoading,
  isAddCapacity,
  isRemoveCapacity,
  isVisibleRestore,
  isVisibleCapacity,
  isVisibleBYOA,
  isVisibleGenerateToken,
}) => {
  const buttons = useMemo(() => {
    const buttonsAction = [
      {
        isVisible: isVisibleGenerateToken,
        label: "Generate token",
        dataTestId: "generate-token",
        onClick: handleGenerateToken,
        icon: GenerateTokenIcon,
      },
      {
        isVisible: !isCurrentResourceBYOA && !isCliManagedResource,
        label: "Reboot",
        onClick: handleRestart,
        icon: RestartIcon,
        isDisabled: isRestartDisabled,
      },
    ];
    if (!isVisibleBYOA) {
      buttonsAction.push(
        {
          isVisible: !isCurrentResourceBYOA && !isCliManagedResource,
          label: "Start",
          onClick: handleStart,
          icon: StartIcon,
          isDisabled: isStartDisabled,
        },
        {
          isVisible: !isCurrentResourceBYOA && !isCliManagedResource,
          label: "Stop",
          onClick: handleStop,
          icon: StopIcon,
          isDisabled: isStopDisabled,
        }
      );
    }
    buttonsAction.push({
      isVisible: !!handleModify,
      label: "Modify",
      onClick: handleModify,
      icon: ModifyIcon,
      isDisabled: isModifyDisabled,
    });
    if (isVisibleRestore) {
      buttonsAction.push({
        isVisible: !!handleRestore,
        label: "Restore",
        onClick: handleRestore,
        icon: RestoreInstanceIcon,
        isDisabled: isRestoreDisabled,
      });
    }
    if (isVisibleCapacity) {
      buttonsAction.push(
        {
          isVisible: !!handleAddCapacity,
          label: "Add Capacity",
          onClick: handleAddCapacity,
          icon: AddCapacityIcon,
          isDisabled: isAddCapacity,
        },
        {
          isVisible: !!handleRemoveCapacity,
          label: "Remove Capacity",
          onClick: handleRemoveCapacity,
          icon: RemoveCapacityIcon,
          isDisabled: isRemoveCapacity,
        }
      );
    }
    buttonsAction.push({
      isVisible: !!handleDelete,
      label: "Delete",
      onClick: handleDelete,
      icon: DeleteIcon,
      isDisabled: isDeleteDisabled,
    });
    return buttonsAction;
  }, [
    handleDelete,
    handleModify,
    handleRestart,
    handleStart,
    handleStop,
    handleRestore,
    isCurrentResourceBYOA,
    isDeleteDisabled,
    isModifyDisabled,
    isRestartDisabled,
    isStartDisabled,
    isStopDisabled,
    isRestoreDisabled,
    isVisibleRestore,
    handleAddCapacity,
    handleRemoveCapacity,
    isAddCapacity,
    isRemoveCapacity,
    isVisibleBYOA,
    isVisibleCapacity,
    isVisibleGenerateToken,
  ]);

  return (
    <Select
      value={""}
      renderValue={(value: string) => {
        if (!value) {
          return "Action";
        } else {
          ("");
        }
      }}
      displayEmpty
      disabled={isLoading}
      sx={{
        margin: "0px",
        height: "40px",
      }}
    >
      {buttons.map(({ label, icon: Icon, onClick, isDisabled, isVisible }) => {
        return (
          isVisible &&
          onClick && (
            <MenuItem
              value={label}
              key={label}
              sx={{
                gap: "10px",
                fontSize: "14px",
                color: isDisabled || isLoading ? "#a3a6ac" : "",
              }}
              disabled={isDisabled || isLoading}
              onClick={onClick}
            >
              <Icon disabled={isDisabled || isLoading} color={"#667085"} />
              {label}
            </MenuItem>
          )
        );
      })}
    </Select>
  );
};

export default ResourceInstanceControlPanel;
