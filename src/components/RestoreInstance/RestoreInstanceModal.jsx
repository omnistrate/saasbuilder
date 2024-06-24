import React, { useEffect } from "react";
import InformationDialogTopCenter from "../Dialog/InformationDialogTopCenter";
import { useFormik } from "formik";
import RestoreInstanceFormStep from "./RestoreInstanceFormStep";
import RestoreInstanceSuccessStep from "./RestoreInstanceSuccessStep";
import { restoreFormikSchema } from "src/constants/restore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function RestoreInstanceModal({
  open,
  handleClose,
  earliestRestoreTime,
  restoreMutation,
  networkType,
  step,
  setStep,
  restoredInstanceID,
}) {
  const restoreFormik = useFormik({
    initialValues: {
      earliestRestoreTime: earliestRestoreTime
        ? dayjs.utc(earliestRestoreTime)
        : null,
      date: null,
      time: null,
    },
    validationSchema: restoreFormikSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const dateTimeString =
        values.date.format("YYYY-MM-DD") + "T" + values.time + "Z";
      const utcTimeString = dayjs.utc(dateTimeString)?.toISOString();
      restoreMutation.mutate({
        targetRestoreTime: utcTimeString,
        network_type: networkType,
      });
    },
  });

  useEffect(() => {
    if (!open) {
      restoreFormik.resetForm();
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <InformationDialogTopCenter
      open={open}
      handleClose={handleClose}
      maxWidth={step === 1 ? "650px" : "550px"}
    >
      {step === 1 && (
        <RestoreInstanceFormStep
          restoreFormik={restoreFormik}
          restoreMutation={restoreMutation}
          handleClose={handleClose}
        />
      )}
      {step === 2 && (
        <RestoreInstanceSuccessStep
          handleClose={handleClose}
          restoredInstanceID={restoredInstanceID}
        />
      )}
    </InformationDialogTopCenter>
  );
}

export default RestoreInstanceModal;
