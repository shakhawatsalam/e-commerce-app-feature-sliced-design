import { useTranslation } from "react-i18next";

import { Spinner } from "@/shared/ui";

import styles from "./PageLoader.module.scss";

export const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{t("pageLoader.loading")}</h1>
      <Spinner size="lg"/>
    </div>
  );
};
