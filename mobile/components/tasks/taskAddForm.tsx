import { dateToday, timeNow } from "@/lib/util/dateTimeUtil";
import { TaskCreateSchema, TaskCreateType } from "@/model/task.model";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";
import DatePicker from "react-native-date-picker";
import { ThemedButton } from "../ui/ThemedButton";
import Toast from "react-native-toast-message";
import UseTasks from "@/hooks/useTask";

export default function TaskAddForm({
  setModalOpen,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [dateModal, setDateModal] = React.useState(false);
  const [timeModal, setTimeModal] = React.useState(false);

  const { postTask } = UseTasks();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TaskCreateType>({
    resolver: zodResolver(TaskCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      timeToDo: new Date().toString(),
      deadline: dateToday,
      status: "todo",
    },
  });

  const onSubmit: SubmitHandler<TaskCreateType> = async (
    data: TaskCreateType
  ) => {
    try {

      const task = await postTask(data);

      // clear the form
      reset();

      // close the modal
      setModalOpen(false);

      //toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `successfully added task ${task.title}`,
        text1Style: { fontSize: 20 },
        text2Style: { fontSize: 15 },
      });
    } catch (error: unknown) {
      console.error(error);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Something went wrong",
        text1Style: { fontSize: 20 },
        text2Style: { fontSize: 15 },
      });
      setError("root", {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        minHeight: "100%",
        height: "100%",
      }}
    >
      {/* title */}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.textField}>
            <ThemedText>title</ThemedText>
            <TextInput
              placeholder="task title"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textForm}
            />
          </View>
        )}
        name="title"
      />
      {errors.title ? (
        <ThemedText style={styles.textError}>{errors.title.message}</ThemedText>
      ) : null}

      {/* time todo */}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.textField}>
            <ThemedText>time todo</ThemedText>
            <TouchableOpacity onPress={() => setTimeModal(true)}>
              <ThemedText style={[styles.dateTimeInput]}>
                {
                  new Date(value).toLocaleTimeString().slice(0, 4) // hh:mm
                }{" "}
                {
                  new Date(value).toLocaleTimeString().slice(8) // AM/PM //q: what is slice number for AM/PM in localeTimeString ? //a: 8
                }
              </ThemedText>
            </TouchableOpacity>
            <DatePicker
              modal={true}
              open={timeModal}
              mode="time"
              date={new Date(value)}
              onConfirm={(date) => {
                setTimeModal(false);
                onChange(date);
              }}
              onCancel={() => setTimeModal(false)}
              onDateChange={onChange}
            />
          </View>
        )}
        name="timeToDo"
      />
      {errors.timeToDo ? (
        <ThemedText style={styles.textError}>
          {errors.timeToDo.message}
        </ThemedText>
      ) : null}

      {/* deadline */}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.textField}>
            <ThemedText>deadline</ThemedText>
            <TouchableOpacity onPress={() => setDateModal(true)}>
              <ThemedText style={[styles.dateTimeInput]}>
                {new Date(value).toDateString()}
              </ThemedText>
            </TouchableOpacity>
            <DatePicker
              modal={true}
              open={dateModal}
              mode="date"
              date={new Date()}
              onConfirm={(date) => {
                setDateModal(false);
                onChange(date);
              }}
              onCancel={() => setDateModal(false)}
              onDateChange={onChange}
            />
          </View>
        )}
        name="deadline"
      />
      {errors.deadline ? (
        <ThemedText style={styles.textError}>
          {errors.deadline.message}
        </ThemedText>
      ) : null}

      {/* description */}
      <Controller
        control={control}
        rules={{
          required: false,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.textField}>
            <ThemedText>description</ThemedText>
            <TextInput
              placeholder="description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.textAreaForm}
              multiline={true}
            />
          </View>
        )}
        name="description"
      />
      {errors.description ? (
        <ThemedText style={styles.textError}>
          {errors.description.message}
        </ThemedText>
      ) : null}

      {/* root error */}
      {errors.root ? (
        <ThemedText style={styles.textError}>{errors.root.message}</ThemedText>
      ) : null}

      {/* submit button */}
      <ThemedButton
        onPress={handleSubmit(onSubmit)}
        title="add task"
        isSubmitting={isSubmitting}
        style={styles.submitButton}
        textStyles={{ fontSize: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: "flex-start",
    flex: 1,
    paddingHorizontal: 12,
  },
  textField: {
    gap: 5,
  },
  textForm: {
    height: 60,
    fontSize: 20,
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 0.2,
    shadowColor: "black",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.4,
    paddingHorizontal: 10,
  },
  textAreaForm: {
    height: 120,
    fontSize: 20,
    paddingTop: 20,
    paddingHorizontal: 10,
    textAlignVertical: "top",
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 0.2,
    shadowColor: "black",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.4,
    marginBottom: 10,
  },
  textError: {
    color: "red",
    paddingHorizontal: 10,
    marginLeft: "auto",
  },
  dateTimeInput: {
    fontSize: 20,
    padding: 10,
    fontWeight: "semibold",
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 0.2,
    shadowColor: "black",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.4,
    paddingHorizontal: 10,
  },
  submitButton: {
    padding: 10,
    margin: 10,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    marginTop: "auto",
    justifyContent: "center",
  },
});
