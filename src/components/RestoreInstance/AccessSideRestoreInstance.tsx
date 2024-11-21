import { useState } from "react";
import RestoreInstanceModal from "./RestoreInstanceModal";
import { useMutation } from "@tanstack/react-query";
import { restoreResourceInstance } from "src/api/resourceInstance";
import useSnackbar from "src/hooks/useSnackbar";
import { SetState } from "src/types/common/reactGenerics";

type serviceSchema = {
  serviceProviderId: string;
  serviceURLKey: string;
  serviceAPIVersion: string;
  serviceEnvironmentURLKey: string;
  serviceModelURLKey: string;
  productTierURLKey: string;
};

type AccessSideRestoreInstanceProps = {
  open: boolean;
  handleClose: () => void;
  earliestRestoreTime: string;
  service: serviceSchema;
  subscriptionId: string;
  selectedInstanceId: string;
  setSelectionModel: SetState<string[]>;
  fetchResourceInstances: (value) => void;
  selectedResource: any;
  networkType: string;
};

function AccessSideRestoreInstance({
  open,
  handleClose,
  earliestRestoreTime,
  service,
  subscriptionId,
  selectedInstanceId,
  setSelectionModel,
  fetchResourceInstances,
  selectedResource,
  networkType,
}: AccessSideRestoreInstanceProps) {
  const [step, setStep] = useState(1);
  const [restoredInstanceID, setRestoredInstanceID] = useState(null);

  const snackbar = useSnackbar();
  const restoreMutation = useMutation(
    (values: { targetRestoreTime: string; network_type: string }) => {
      const payload = {
        targetRestoreTime: values.targetRestoreTime,
        network_type: values.network_type,
        serviceProviderId: service?.serviceProviderId,
        serviceKey: service?.serviceURLKey,
        serviceAPIVersion: service?.serviceAPIVersion,
        serviceEnvironmentKey: service?.serviceEnvironmentURLKey,
        serviceModelKey: service?.serviceModelURLKey,
        productTierKey: service?.productTierURLKey,
        resourceKey: selectedResource?.key,
        subscriptionId,
        id: selectedInstanceId,
      };
      return restoreResourceInstance(payload);
    },
    {
      onSuccess: (res: any) => {
        snackbar.showSuccess("Restore initiated successfully!");
        setSelectionModel([]);
        fetchResourceInstances(selectedResource);
        setRestoredInstanceID(res?.data?.id);
        setStep(2);
      },
    }
  );

  return (
    <RestoreInstanceModal
      open={open}
      handleClose={handleClose}
      earliestRestoreTime={earliestRestoreTime}
      restoreMutation={restoreMutation}
      networkType={networkType}
      step={step}
      setStep={setStep}
      restoredInstanceID={restoredInstanceID}
    />
  );
}

export default AccessSideRestoreInstance;
