import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
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

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import useMutation from '_hooks/useMutation'
import { LoginFormSchema, LoginFormValues } from '_schemas/login_form_schema'
import useBoundStore from '_stores'
import { User } from '_types'

export default function Login() {
  const { t } = useTranslation()
  const theme: MD3Theme = useTheme()
  const styles = makeStyles(theme)

  const setUser = useBoundStore((state) => state.setUser)
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '099aChatOutsideTest2',
      password: '6628@talk',
      app: 'client_app',
      requiredRoles: ['infinitalk:manager', 'chat:normal']
    }
  })

  const { isPending, mutate } = useMutation<LoginFormValues, User>({
    endpoint:
      '/v1/auth?needs[]=access-token&needs[]=firebase-access-token&needs[]=license',
    onSuccess: (user: User) => {
      setUser(user)
      queryClient.invalidateQueries({
        queryKey: [
          `/v1/agents/users/${user?.username}/sip-account?customerId=${user?.agreementID}`
        ]
      })
    },
    onError: (error) => {
      setError('username', { message: error.message })
    }
  })

  const onSubmit = (formValues: LoginFormValues) => {
    queryClient.removeQueries()
    mutate(formValues)
  }

  return (
    <View style={styles.background}>
      <Portal>
        <Dialog dismissable={false} visible={isPending}>
          <Dialog.Content>
            <ActivityIndicator size='large' animating />
            <View style={styles.loadingView} />
            <Text style={styles.loadingText} variant='bodyLarge'>
              Please wait …
            </Text>
          </Dialog.Content>
        </Dialog>
      </Portal>

      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        keyboardVerticalOffset={100}
      >
        <Text style={styles.header}>Welcome back.</Text>

        <View style={styles.input}>
          <Controller
            control={control}
            name='username'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode='outlined'
                label='Email'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.username}
              />
            )}
          />
          {errors.username?.message && (
            <HelperText type='error' visible={!!errors.username}>
              {t(errors.username.message)}
            </HelperText>
          )}
        </View>

        <View style={styles.input}>
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode='outlined'
                label='Password'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.password}
              />
            )}
          />
          {errors.password?.message && (
            <HelperText type='error' visible={!!errors.password}>
              {t(errors.password.message)}
            </HelperText>
          )}
        </View>

        <Button mode='contained' onPress={handleSubmit(onSubmit)}>
          LOGIN
        </Button>
      </KeyboardAvoidingView>
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
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
    loadingView: {
      height: 5
    },
    loadingText: {
      textAlign: 'center'
    }
  })
