import {zodResolver} from '@hookform/resolvers/zod';
import {DefaultError, useQueryClient} from '@tanstack/react-query';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Button,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import useBoundStore from '../stores';
import {LoginFormSchema, LoginFormValues} from '../schemas/login_form_schema';
import useMutation from '../hooks/useMutation';
import {storeTokens, TokenBulk} from '../utils/token_storage';

export default function Login() {
  const styles = makeStyles();
  const queryClient = useQueryClient();
  const authenticate = useBoundStore(state => state.authenticate);

  const {control, handleSubmit} = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const {isPending, mutate} = useMutation<
    TokenBulk,
    DefaultError,
    LoginFormValues
  >({
    endpoint: 'login',
    onSuccess: async tokens => {
      storeTokens(tokens);
      authenticate();
      //   await refetch();
      // Show toast message
    },
  });

  const onSubmit = (formValues: LoginFormValues) => {
    queryClient.removeQueries();
    mutate(formValues);
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={100}>
        <Modal transparent={true} visible={isPending}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
            </View>
          </View>
        </Modal>

        <Text style={styles.header}>Welcome back.</Text>

        <Text style={styles.label}>First name</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="username"
          rules={{required: true}}
        />
        <Text style={styles.label}>Last name</Text>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
            />
          )}
          name="password"
          rules={{required: true}}
        />

        <View style={styles.button}>
          <Button title="Login" onPress={handleSubmit(onSubmit)} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      paddingVertical: 14,
    },
    background: {
      flex: 1,
      width: '100%',
    },
    label: {
      margin: 20,
      marginLeft: 0,
    },
    button: {
      marginTop: 40,
      color: 'white',
      height: 40,
      borderRadius: 4,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 8,
    },
    input: {
      backgroundColor: 'white',
      borderColor: 'none',
      height: 40,
      padding: 10,
      borderRadius: 4,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });
