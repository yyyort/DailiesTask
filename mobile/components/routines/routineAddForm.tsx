import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../ui/ThemedText";

import { ThemedButton } from "../ui/ThemedButton";
import Toast from "react-native-toast-message";
import { RoutineAddSchema, RoutineCreateType } from "@/model/routine.model";
import { dateToday } from "@/lib/util/dateTimeUtil";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DatePicker from "react-native-date-picker";
import useRoutine from "@/hooks/useRoutine";

export default function RoutineAddForm({
  setModalOpen,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RoutineCreateType>({
    resolver: zodResolver(RoutineAddSchema),
    defaultValues: {
      title: "",
      description: "",
      tasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const [timeModal, setTimeModal] = React.useState(false);

  const { postRoutine } = useRoutine();

  const onSubmit: SubmitHandler<RoutineCreateType> = async (
    data: RoutineCreateType
  ) => {
    try {
      // post routine
      const res = await postRoutine(data);

      // clear the form
      reset();

      // close the modal
      setModalOpen(false);

      //toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `successfully added task ${data.title}`,
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
        paddingHorizontal: 20,
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
              placeholder="routine title"
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

      {/* tasks */}
      <View
        style={{
          flexDirection: "column",
          gap: 10,
          marginTop: 10,
        }}
      >
        {fields.map((field, index) => (
          <View
            key={field.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.textField}>
                    <ThemedText>task</ThemedText>
                    <TextInput
                      placeholder="task title"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[
                        styles.textForm,
                        {
                          width: "90%",
                        },
                      ]}
                    />
                  </View>
                )}
                name={`tasks.${index}.title`}
              />
              {errors.tasks && errors.tasks[index]?.title ? (
                <ThemedText style={styles.textError}>
                  {errors.tasks[index].title.message}
                </ThemedText>
              ) : null}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.textField}>
                    <TouchableOpacity onPress={() => setTimeModal(true)}>
                      <ThemedText
                        style={[
                          styles.dateTimeInput,
                          {
                            width: "90%",
                          },
                        ]}
                      >
                        {`${new Date(value)
                          .toLocaleTimeString()
                          .slice(0, 4)} ${new Date(value)
                          .toLocaleTimeString()
                          .slice(8)}`}
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
                name={`tasks.${index}.timeToDo`}
              />
              {errors.tasks && errors.tasks[index]?.timeToDo ? (
                <ThemedText style={styles.textError}>
                  {errors.tasks[index].timeToDo.message}
                </ThemedText>
              ) : null}
            </View>

            {/* task remove */}
            <TouchableOpacity
              onPress={() => remove(index)}
              style={{
                marginRight: 20,
              }}
            >
              <ThemedText>
                <FontAwesome name="remove" size={24} color="black" />
              </ThemedText>
            </TouchableOpacity>
          </View>
        ))}

        <ThemedButton
          onPress={() =>
            append({
              title: "",
              description: "",
              status: "todo",
              timeToDo: new Date().toString(),
              deadline: dateToday,
            })
          }
          title="add task"
          style={[
            styles.submitButton,
            {
              marginTop: 10,
              marginBottom: 10,
            },
          ]}
          textStyles={{ fontSize: 20 }}
        />
      </View>

      {/* root error */}
      {errors.root ? (
        <ThemedText style={styles.textError}>{errors.root.message}</ThemedText>
      ) : null}

      {/* submit button */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          marginBottom: 80,
        }}
      >
        <ThemedButton
          onPress={handleSubmit(onSubmit)}
          title="add routine"
          isSubmitting={isSubmitting}
          style={[
            styles.submitButton,
            {
              marginBottom: 20,
            },
          ]}
          textStyles={{ fontSize: 20 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
