import { DynamicModuleLoader } from "@/shared/lib";

import styles from "./LoginPage.module.scss";

import { LoginForm, loginReducer } from "@/features";

const LoginPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <h1 className={styles.title}>Sing in</h1>
        <DynamicModuleLoader
          reducer={{ loginForm: loginReducer }}
          removeAfterUnmount>
          <LoginForm />
        </DynamicModuleLoader>
      </div>
    </div>
  );
};

export default LoginPage;
