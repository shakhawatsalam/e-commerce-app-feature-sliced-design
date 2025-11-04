import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import ArrowRight from "@/shared/assets/icons/ArrowRight.svg?react";
import MailIcon from "@/shared/assets/icons/Mail.svg?react";
import PhoneIcon from "@/shared/assets/icons/Phone.svg?react";
import { AuthMethod, routePaths } from "@/shared/config";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { AppIcon, Button, Input, PhoneInput, Tabs } from "@/shared/ui";

import { selectLoginEmail } from "../../model/selectors/selectLoginEmail/selectLoginEmail";
import { selectLoginMethod } from "../../model/selectors/selectLoginMethod/selectLoginMethod";
import { selectLoginPassword } from "../../model/selectors/selectLoginPassword/selectLoginPassword";
import { selectLoginPhone } from "../../model/selectors/selectLoginPhone/selectLoginPhone";
import { login } from "../../model/services/login";
import { loginActions } from "../../model/slice/loginSlice";

import styles from "./LoginForm.module.scss";
import { selectLoginIsLoading } from "../../model/selectors/selectLoginLoading/selectLoginLoading";
import { selectLoginError } from "../../model/selectors/selectLoginError/selectLoginError";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector(selectLoginEmail);
  const phone = useAppSelector(selectLoginPhone);
  const password = useAppSelector(selectLoginPassword);
  const method = useAppSelector(selectLoginMethod);
  const isLoading = useAppSelector(selectLoginIsLoading);
  const error = useAppSelector(selectLoginError);

  const handleChangeEmail = (value: string) => {
    dispatch(loginActions.setEmail(value));
  };
  const handleChangePhone = (value: string) => {
    dispatch(loginActions.setPhone(value));
  };
  const handleChangePassword = (value: string) => {
    dispatch(loginActions.setPassword(value));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, phone, password }));
    if (login.fulfilled.match(result)) {
      navigate(routePaths.home);
    }
  };

  const handleTabChange = () => {
    dispatch(
      loginActions.setMethod(
        method === AuthMethod.EMAIL ? AuthMethod.PHONE : AuthMethod.EMAIL
      )
    );
    dispatch(loginActions.resetForm());
  };
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Tabs onChange={handleTabChange} defaultValue={method}>
        <Tabs.List>
          <Tabs.Trigger value={AuthMethod.EMAIL}>
            <AppIcon Icon={MailIcon} />
            Email
          </Tabs.Trigger>
          <Tabs.Trigger value={AuthMethod.PHONE}>
            <AppIcon Icon={PhoneIcon} />
            Phone
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={AuthMethod.EMAIL}>
          <Input
            error={!!error}
            label='Email'
            value={email}
            onChange={handleChangeEmail}
            type='email'
            className={styles.input}
            placeholder='Enter your email'
          />
        </Tabs.Content>
        <Tabs.Content value={AuthMethod.PHONE}>
          <PhoneInput
            error={!!error}
            label='Phone'
            value={phone}
            onChange={handleChangePhone}
            className={styles.input}
            placeholder='Enter your phone'
          />
        </Tabs.Content>
      </Tabs>

      <Input
        value={password}
        label='Password'
        error={!!error}
        onChange={handleChangePassword}
        type='password'
        className={styles.input}
        placeholder='Enter your password'
      />
      {error && <div className={styles.error}>{error}</div>}
      <Button
        isLoading={isLoading}
        fullWidth
        type='submit'
        className={styles.button}
        size='md'>
        Login <AppIcon Icon={ArrowRight} />
      </Button>
    </form>
  );
};
