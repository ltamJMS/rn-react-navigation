import { zodResolver } from '@hookform/resolvers/zod'
import { DefaultError } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import {
  ActivityIndicator,
  Button,
  Dialog,
  HelperText,
  MD3Theme,
  Portal,
  Text,
  TextInput,
  useTheme
} from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { LoginFormSchema, LoginFormValues } from '../schemas/LoginFormSchema'
import useMutation from '../hooks/useMutation'
import { User } from '../types'
import { useQuery } from '../hooks/useQuery'
import useBoundStore from '../store'
import { AuthStacksProps } from '../navigators/stacks/AuthStacks'

export default function Login({ navigation }: AuthStacksProps) {
  const { t } = useTranslation()
  const theme: MD3Theme = useTheme()
  const styles = makeStyles(theme)
  const authenticate = useBoundStore(state => state.authenticate)
  const { refetch } = useQuery<User>({
    queryKey: ['users/2'],
    refetchOnMount: false
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: 'example@gmail.com',
      password: '2343'
    }
  })

  const { isPending, mutate } = useMutation<
    User,
    DefaultError,
    LoginFormValues
  >({
    url: 'users',
    onSuccess: async () => {
      await refetch
      authenticate()
    }
  })

  const onSubmit = (formValues: LoginFormValues) => mutate(formValues)

  return (
    <View style={styles.background}>
      <Portal>
        <Dialog dismissable={false} visible={isPending}>
          <Dialog.Content className="py-8">
            <ActivityIndicator size="large" animating={true} />
            <View className="h-4" />
            <Text style={{ textAlign: 'center' }} variant="bodyLarge">
              Please wait …
            </Text>
          </Dialog.Content>
        </Dialog>
      </Portal>

      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.image}
        />

        <Text style={styles.header}>Welcome back.</Text>

        <View style={styles.input}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.email}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.email}>
            {t(`${errors.email?.message}`)}
          </HelperText>
        </View>

        <View style={styles.input}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.password}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.password}>
            {t(`${errors.password?.message}`)}
          </HelperText>
        </View>

        <View style={styles.forgotPassword}>
          <TouchableOpacity>
            <Text style={styles.label}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          className="w-full"
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          LOGIN
        </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    image: {
      width: 128,
      height: 128,
      marginBottom: 12
    },
    header: {
      fontSize: 26,
      color: theme.colors.primary,
      fontWeight: 'bold',
      paddingVertical: 14
    },
    background: {
      flex: 1,
      width: '100%'
    },
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
    input: {
      width: '100%',
      marginVertical: 8
    },
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24
    },
    label: {
      color: theme.colors.secondary
    },
    row: {
      flexDirection: 'row',
      marginTop: 4
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary
    }
  })
